import { Injectable } from '@angular/core';
import {
    Objective,
    OBJECTIVES,
    DEFAULT_OBJECTIVE,
    NUMBER_OF_OBJECTIVES,
    CORNER_POSITIONS,
    MIN_SIZE_FOR_BONUS,
    LETTERS_FOR_BONUS,
} from '@common/objectives';
import { WordValidationService } from './word-validation.service';
import { PlayerService } from './player.service';
import { PLAYER_ONE_INDEX } from '@app/classes/constants';
import { ClientSocketService } from './client-socket.service';
import { GameSettingsService } from './game-settings.service';

@Injectable({
    providedIn: 'root',
})
export class ObjectivesService {
    objectives: Objective[];
    privateObjectives: Objective[];
    publicObjectives: Objective[];

    constructor(
        private wordValidationService: WordValidationService,
        private playerService: PlayerService,
        private clientSocketService: ClientSocketService,
        private gameSettingsService: GameSettingsService,
    ) {
        this.objectives = OBJECTIVES;
        this.privateObjectives = [DEFAULT_OBJECTIVE, DEFAULT_OBJECTIVE];
        this.publicObjectives = [DEFAULT_OBJECTIVE, DEFAULT_OBJECTIVE];
        this.receiveObjectives();
    }

    receiveObjectives() {
        this.clientSocketService.socket.on('receiveObjectives', (objectives: Objective[]) => {
            for (const objective of objectives) {
                if (objective.isCompleted) {
                    this.objectives[objective.id].isCompleted = true;
                }
            }
        });
    }

    initializeObjectives(objectivesIndexes: number[]) {
        for (let i = 0; i < objectivesIndexes.length; i++) {
            if (i < NUMBER_OF_OBJECTIVES) {
                this.privateObjectives[i] = this.objectives[objectivesIndexes[i]];
            } else {
                this.publicObjectives[i - NUMBER_OF_OBJECTIVES] = this.objectives[objectivesIndexes[i]];
            }
        }
    }

    checkObjectivesCompletion() {
        if (!this.privateObjectives[0].isCompleted) {
            this.isCompleted(this.privateObjectives[0].id);
        }
        for (const objective of this.publicObjectives) {
            if (!objective.isCompleted) this.isCompleted(objective.id);
        }
    }

    isCompleted(id: number) {
        switch (id) {
            case 0: {
                this.validateObjectiveOne(id);
                break;
            }
            case 1: {
                break;
            }
            case 2: {
                break;
            }
            case 3: {
                break;
            }
            case 4: {
                this.validateObjectiveFour(id);
                break;
            }
            case 5: {
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
        return id;
    }

    validateObjectiveFour(id: number) {
        let count = 0;
        for (const word of this.wordValidationService.lastPlayedWords.keys()) {
            for (const letter of word) {
                if (LETTERS_FOR_BONUS.includes(letter)) count++;
            }
        }
        if (count > 1) this.addObjectiveScore(id);
    }

    validateObjectiveSeven(id: number) {
        for (const word of this.wordValidationService.lastPlayedWords.keys()) {
            if (word.length >= MIN_SIZE_FOR_BONUS) {
                this.addObjectiveScore(id);
            }
        }
    }

    validateObjectiveEight(id: number) {
        for (const word of this.wordValidationService.lastPlayedWords.keys()) {
            for (const position of this.wordValidationService.lastPlayedWords.get(word) as string[]) {
                if (CORNER_POSITIONS.includes(position)) {
                    this.addObjectiveScore(id);
                }
            }
        }
    }

    addObjectiveScore(id: number) {
        this.playerService.addScore(this.objectives[id].score, PLAYER_ONE_INDEX);
        this.objectives[id].isCompleted = true;
        this.updateOpponentObjectives();
    }

    updateOpponentObjectives() {
        if (!this.gameSettingsService.isSoloMode)
            this.clientSocketService.socket.emit('sendObjectives', this.objectives, this.clientSocketService.roomId);
    }
}
