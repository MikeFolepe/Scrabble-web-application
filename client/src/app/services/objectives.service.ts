import { Injectable } from '@angular/core';
import { ONE_MINUTE } from '@app/classes/constants';
import { GameType } from '@common/game-type';
import {
    CORNER_POSITIONS,
    LETTERS_FOR_OBJ5,
    MIN_SCORE_FOR_OBJ4,
    MIN_SIZE_FOR_OBJ2,
    MIN_SIZE_FOR_OBJ7,
    NUMBER_OF_OBJECTIVES,
    Objective,
    OBJECTIVES,
} from '@common/objectives';
import { ObjectiveTypes } from '@common/objectives-type';
import { ClientSocketService } from './client-socket.service';
import { EndGameService } from './end-game.service';
import { GameSettingsService } from './game-settings.service';
import { PlacementsHandlerService } from './placements-handler.service';
import { PlayerService } from './player.service';
import { RandomBonusesService } from './random-bonuses.service';
import { WordValidationService } from './word-validation.service';

@Injectable({
    providedIn: 'root',
})
export class ObjectivesService {
    objectives: Objective[][];
    playerIndex: number;
    activeTimeRemaining: number[];
    extendedWords: string[];
    private obj1Counter: number[];
    private obj1ActionTracker: string[][];
    private obj1LastAttempt: number[];

    constructor(
        private wordValidationService: WordValidationService,
        private playerService: PlayerService,
        private clientSocketService: ClientSocketService,
        private gameSettingsService: GameSettingsService,
        private randomBonusesService: RandomBonusesService,
        private placementsService: PlacementsHandlerService,
        private endGameService: EndGameService,
    ) {
        this.objectives = [[], []];
        this.activeTimeRemaining = [ONE_MINUTE, ONE_MINUTE];
        this.obj1LastAttempt = [0, 0];
        this.obj1Counter = [0, 0];
        this.obj1ActionTracker = [[], []];
        this.receiveObjectives();
    }

    initializeObjectives(): void {
        const arrayOfIndex = this.gameSettingsService.gameSettings.objectiveIds;
        for (let i = 0; i < NUMBER_OF_OBJECTIVES; i++) {
            for (let j = 0; j < NUMBER_OF_OBJECTIVES; j++) {
                const objective = OBJECTIVES[arrayOfIndex[i][j]];
                this.objectives[i].push(objective);
            }
        }
    }

    receiveObjectives(): void {
        this.clientSocketService.socket.on('receiveObjectiveCompleted', (id: number) => {
            const objective = this.findObjectiveById(id) as Objective;
            objective.isCompleted = true;
        });
    }

    updateOpponentObjectives(id: number): void {
        if (!this.gameSettingsService.isSoloMode) this.clientSocketService.socket.emit('objectiveAccomplished', id, this.clientSocketService.roomId);
    }

    checkObjectivesCompletion(): void {
        // Classic Mode -> No check for objectives completion
        if (this.gameSettingsService.gameType === GameType.Classic) return;

        if (!this.objectives[ObjectiveTypes.Private][this.playerIndex].isCompleted) {
            this.isCompleted(this.objectives[ObjectiveTypes.Private][this.playerIndex].id);
        }

        for (const objective of this.objectives[ObjectiveTypes.Public]) {
            if (!objective.isCompleted) this.isCompleted(objective.id);
        }
    }

    isCompleted(id: number): void {
        switch (id) {
            case 0: {
                this.validateObjectiveOne(id);
                break;
            }
            case 1: {
                this.validateObjectiveTwo(id);
                break;
            }
            case 2: {
                this.validateObjectiveThree(id);
                break;
            }
            case 3: {
                this.validateObjectiveFour(id);
                break;
            }
            case 4: {
                this.validateObjectiveFive(id);
                break;
            }
            case 5: {
                this.validateObjectiveSix(id);
                break;
            }
            case 6: {
                this.validateObjectiveSeven(id);
                break;
            }
            case 7: {
                this.validateObjectiveEight(id);
                break;
            }
            default: {
                break;
            }
        }
    }

    validateObjectiveOne(id: number) {
        const numberOfOccurrencesToValidate = 3;
        const minLengthToValidate = 4;
        let actionLog: string[] = [];
        const size = this.endGameService.actionsLog.length - 1;
        let currentWordLength = 0;

        for (let index = size; index >= 0; index = index - 2) {
            actionLog.push(this.endGameService.actionsLog[index]);
        }

        actionLog = actionLog.reverse();

        for (const word of this.wordValidationService.lastPlayedWords.keys()) {
            currentWordLength = word.length;
        }

        for (let index = this.obj1LastAttempt[this.playerIndex]; index < actionLog.length; index++) {
            this.obj1ActionTracker[this.playerIndex].push(actionLog[index]);
        }

        const length = this.obj1ActionTracker[this.playerIndex].length - 1;
        this.obj1ActionTracker[this.playerIndex][length] += currentWordLength >= minLengthToValidate ? 'Valide' : 'Invalide';
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        this.obj1ActionTracker[this.playerIndex] = this.obj1ActionTracker[this.playerIndex].slice(Math.max(length - 1 - 3, 0), length + 1);

        for (let index = length; index >= this.obj1LastAttempt[this.playerIndex]; index--) {
            if (this.obj1ActionTracker[this.playerIndex][index] === 'placerSuccesValide') {
                this.obj1Counter[this.playerIndex]++;
            } else {
                this.obj1Counter[this.playerIndex] = this.obj1ActionTracker[this.playerIndex][index] === 'placerSuccesInvalide' ? 0 : 1;
                break;
            }
        }

        this.obj1LastAttempt[this.playerIndex] = actionLog.length;

        if (this.obj1Counter[this.playerIndex] === numberOfOccurrencesToValidate) {
            this.addObjectiveScore(id);
            this.obj1Counter[this.playerIndex] = 0;
        }
    }

    validateObjectiveTwo(id: number) {
        for (const word of this.wordValidationService.lastPlayedWords.keys()) {
            const position = this.wordValidationService.playedWords.get(word) as string[];
            const nbOfOccurences = position.length / word.length;

            if (word.length >= MIN_SIZE_FOR_OBJ2 && nbOfOccurences > 1) this.addObjectiveScore(id);
        }
    }

    validateObjectiveThree(id: number) {
        for (const positions of this.wordValidationService.lastPlayedWords.values()) {
            const playedPositionsUsed: string[][] = [];
            for (const position of positions) {
                this.isPositionInPlayedWords(position, playedPositionsUsed);
            }
            // TODO: supprimer cette ligne lorsque satisfait
            // console.log('MOTS INTERSECTIONS : ', playedPositionsUsed);
            if (playedPositionsUsed.length > 1) {
                this.addObjectiveScore(id);
                return;
            }
        }
    }

    validateObjectiveFour(id: number) {
        if (this.activeTimeRemaining[this.playerIndex] > 0 && this.playerService.players[this.playerIndex].score >= MIN_SCORE_FOR_OBJ4)
            this.addObjectiveScore(id);
    }

    validateObjectiveFive(id: number) {
        let specificLettersUsed = 0;
        for (const word of this.wordValidationService.lastPlayedWords.keys()) {
            for (const letter of word) {
                if (LETTERS_FOR_OBJ5.includes(letter.toUpperCase())) specificLettersUsed++;
            }
            if (specificLettersUsed > 1) {
                this.addObjectiveScore(id);
                return;
            }
            specificLettersUsed = 0;
        }
    }

    validateObjectiveSix(id: number) {
        if (this.extendedWords.length === 0) return;
        for (const position of this.placementsService.extendingPositions) {
            if (this.randomBonusesService.bonusPositions.has(position)) this.addObjectiveScore(id);
        }
    }

    validateObjectiveSeven(id: number): void {
        for (const word of this.wordValidationService.lastPlayedWords.keys()) {
            if (word.length >= MIN_SIZE_FOR_OBJ7) {
                this.addObjectiveScore(id);
            }
        }
    }

    validateObjectiveEight(id: number): void {
        for (const word of this.wordValidationService.lastPlayedWords.keys()) {
            for (const position of this.wordValidationService.lastPlayedWords.get(word) as string[]) {
                if (CORNER_POSITIONS.includes(position)) {
                    this.addObjectiveScore(id);
                }
            }
        }
    }

    // TODO: nom de fonction peut etre amelioré eventuellement
    isPositionInPlayedWords(position: string, playedPositionsUsed: string[][]) {
        for (const playedPositions of this.wordValidationService.priorPlayedWords.values()) {
            if (playedPositions.includes(position) && !playedPositionsUsed.includes(playedPositions)) {
                playedPositionsUsed.push(playedPositions);
            }
        }
    }

    addObjectiveScore(id: number): void {
        const objective = this.findObjectiveById(id) as Objective;
        this.playerService.addScore(objective.score, this.playerIndex);
        objective.isCompleted = true;
        this.updateOpponentObjectives(id);
    }

    findObjectiveById(idToSearchFor: number): Objective | undefined {
        for (let i = 0; i < NUMBER_OF_OBJECTIVES; i++) {
            for (let j = 0; j < NUMBER_OF_OBJECTIVES; j++) {
                if (this.objectives[i][j].id === idToSearchFor) return this.objectives[i][j];
            }
        }
        return undefined;
    }
}
