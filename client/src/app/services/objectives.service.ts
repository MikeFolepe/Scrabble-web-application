import { Injectable } from '@angular/core';
import { ONE_MINUTE, PLAYER_ONE_INDEX } from '@app/classes/constants';
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
    activeTimeRemaining: number;
    extendedWords: string[];

    constructor(
        private wordValidationService: WordValidationService,
        private playerService: PlayerService,
        private clientSocketService: ClientSocketService,
        private gameSettingsService: GameSettingsService,
        private randomBonusesService: RandomBonusesService,
        private placementsService: PlacementsHandlerService,
    ) {
        this.objectives = [[], []];
        this.activeTimeRemaining = ONE_MINUTE;
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
        // TODO: on peut enlever le if car si c'est mode solo, on n'est pas connecté au server,
        // le emit devient du code mort
        if (!this.gameSettingsService.isSoloMode) this.clientSocketService.socket.emit('objectiveAccomplished', id, this.clientSocketService.roomId);
    }

    checkObjectivesCompletion(): void {
        // Mode classique -> aucune vérification requise
        if (this.gameSettingsService.gameType === 'Scrabble classique') return;

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
                // TODO: y'a un petit offset de 1 entre le case et le nom de la fonction
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
        return id;
    }

    validateObjectiveTwo(id: number) {
        for (const word of this.wordValidationService.lastPlayedWords.keys()) {
            if (word.length >= MIN_SIZE_FOR_OBJ2 && this.wordValidationService.playedWords.has(word)) this.addObjectiveScore(id);
        }
    }

    validateObjectiveFour(id: number) {
        if (this.activeTimeRemaining > 0 && this.playerService.players[PLAYER_ONE_INDEX].score >= MIN_SCORE_FOR_OBJ4) this.addObjectiveScore(id);
    }

    validateObjectiveFive(id: number) {
        let count = 0;
        for (const word of this.wordValidationService.lastPlayedWords.keys()) {
            for (const letter of word) {
                if (LETTERS_FOR_OBJ5.includes(letter.toUpperCase())) count++;
            }
        }
        if (count > 1) this.addObjectiveScore(id);
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
