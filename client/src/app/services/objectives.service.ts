/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Injectable } from '@angular/core';
import { ONE_MINUTE, PLAYER_ONE_INDEX } from '@app/classes/constants';
import {
    CORNER_POSITIONS,
    DEFAULT_OBJECTIVE,
    LETTERS_FOR_OBJ5,
    MIN_SCORE_FOR_OBJ4,
    MIN_SIZE_FOR_OBJ2,
    MIN_SIZE_FOR_OBJ7,
    NUMBER_OF_OBJECTIVES,
    Objective,
    OBJECTIVES,
} from '@common/objectives';
import { ClientSocketService } from './client-socket.service';
import { GameSettingsService } from './game-settings.service';
import { PlayerService } from './player.service';
import { WordValidationService } from './word-validation.service';

@Injectable({
    providedIn: 'root',
})
export class ObjectivesService {
    objectives: Objective[];
    privateObjectives: Objective[];
    publicObjectives: Objective[];
    activeTime: number;

    constructor(
        private wordValidationService: WordValidationService,
        private playerService: PlayerService,
        private clientSocketService: ClientSocketService,
        private gameSettingsService: GameSettingsService,
    ) {
        this.objectives = OBJECTIVES;
        this.privateObjectives = [DEFAULT_OBJECTIVE, DEFAULT_OBJECTIVE];
        this.publicObjectives = [DEFAULT_OBJECTIVE, DEFAULT_OBJECTIVE];
        this.activeTime = 0;
        this.receiveObjectives();
    }

    receiveObjectives(): void {
        this.clientSocketService.socket.on('receiveObjectives', (objectives: Objective[]) => {
            for (const objective of objectives) {
                if (objective.isCompleted) {
                    this.objectives[objective.id].isCompleted = true;
                }
            }
        });
    }

    initializeObjectives(objectivesIndexes: number[]): void {
        for (let i = 0; i < objectivesIndexes.length; i++) {
            if (i < NUMBER_OF_OBJECTIVES) {
                this.privateObjectives[i] = this.objectives[objectivesIndexes[i]];
            } else {
                this.publicObjectives[i - NUMBER_OF_OBJECTIVES] = this.objectives[objectivesIndexes[i]];
            }
        }
    }

    checkObjectivesCompletion(): void {
        // TODO: comme normalement y'a un seul objectif privé on peut eventuellement enlever le '[]' a refactor le code ici d'apres Anthony.
        if (!this.privateObjectives[0].isCompleted) {
            this.isCompleted(this.privateObjectives[0].id);
        }
        for (const objective of this.publicObjectives) {
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
                break;
            }
            case 6: {
                // TODO: y'a un petit offset de 1 entre le case et le nom de la fonction
                this.validateObjectiveSix(id);
                break;
            }
            case 7: {
                // TODO regarder les nombres magiques et enlver le lintdisbale
                this.validateObjectiveSeven(id);
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
        if (this.activeTime <= ONE_MINUTE && this.playerService.players[PLAYER_ONE_INDEX].score >= MIN_SCORE_FOR_OBJ4) this.addObjectiveScore(id);
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

    validateObjectiveSix(id: number): void {
        for (const word of this.wordValidationService.lastPlayedWords.keys()) {
            if (word.length >= MIN_SIZE_FOR_OBJ7) {
                this.addObjectiveScore(id);
            }
        }
    }

    validateObjectiveSeven(id: number): void {
        for (const word of this.wordValidationService.lastPlayedWords.keys()) {
            for (const position of this.wordValidationService.lastPlayedWords.get(word) as string[]) {
                if (CORNER_POSITIONS.includes(position)) {
                    this.addObjectiveScore(id);
                }
            }
        }
    }

    addObjectiveScore(id: number): void {
        this.playerService.addScore(this.objectives[id].score, PLAYER_ONE_INDEX);
        this.objectives[id].isCompleted = true;
        this.updateOpponentObjectives();
    }

    updateOpponentObjectives(): void {
        if (!this.gameSettingsService.isSoloMode)
            this.clientSocketService.socket.emit('sendObjectives', this.objectives, this.clientSocketService.roomId);
    }
}