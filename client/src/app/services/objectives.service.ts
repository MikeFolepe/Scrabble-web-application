import { Injectable } from '@angular/core';
import { Objective, OBJECTIVES, DEFAULT_OBJECTIVE, NUMBER_OF_OBJECTIVES, CORNER_POSITIONS, MIN_SIZE_FOR_BONUS } from '@app/classes/objectives';
import { WordValidationService } from './word-validation.service';
import { PlayerService } from './player.service';
import { INVALID_INDEX, PLAYER_ONE_INDEX } from '@app/classes/constants';

@Injectable({
    providedIn: 'root',
})
export class ObjectivesService {
    objectives: Objective[];
    privateObjectives: Objective[];
    publicObjectives: Objective[];

    constructor(private wordValidationService: WordValidationService, private playerService: PlayerService) {
        this.objectives = OBJECTIVES;
        this.privateObjectives = [DEFAULT_OBJECTIVE, DEFAULT_OBJECTIVE];
        this.publicObjectives = [DEFAULT_OBJECTIVE, DEFAULT_OBJECTIVE];
    }

    initializeObjectives(objectivesIndexes: number[]) {
        for (let i = 0; i < objectivesIndexes.length; i++) {
            if (i < NUMBER_OF_OBJECTIVES) {
                this.privateObjectives[i] = this.objectives[objectivesIndexes[i]];
            } else {
                this.publicObjectives[i - NUMBER_OF_OBJECTIVES] = this.objectives[objectivesIndexes[i]];
                this.publicObjectives[i - NUMBER_OF_OBJECTIVES].isActive = true;
            }
        }
        this.privateObjectives[0].isActive = true;
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
            case 1: {
                this.validateObjectiveOne(id);
                break;
            }
            case 2: {
                break;
            }
            case 3: {
                break;
            }
            case 4: {
                break;
            }
            case 5: {
                break;
            }
            case 6: {
                break;
            }
            case 7: {
                this.validateObjectiveSeven(id);
                break;
            }
            case 8: {
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

    validateObjectiveSeven(id: number) {
        for (const word of this.wordValidationService.lastPlayedWords.keys()) {
            if (word.length >= MIN_SIZE_FOR_BONUS) {
                this.playerService.addScore(OBJECTIVES[id - 1].score, PLAYER_ONE_INDEX);
                this.objectives[id - 1].isCompleted = true;
            }
        }
    }

    validateObjectiveEight(id: number) {
        for (const word of this.wordValidationService.lastPlayedWords.keys()) {
            for (const position of this.wordValidationService.lastPlayedWords.get(word) as string[]) {
                if (CORNER_POSITIONS.indexOf(position) > INVALID_INDEX) {
                    this.playerService.addScore(OBJECTIVES[id - 1].score, PLAYER_ONE_INDEX);
                    this.objectives[id - 1].isCompleted = true;
                }
            }
        }
    }
}
