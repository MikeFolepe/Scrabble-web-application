import { Injectable } from '@angular/core';
import { Objective, OBJECTIVES, DEFAULT_OBJECTIVE, NUMBER_OF_OBJECTIVES } from '@app/classes/objectives';
import { WordValidationService } from './word-validation.service';
import { PlayerService } from './player.service';
import { PLAYER_ONE_INDEX } from '@app/classes/constants';

@Injectable({
    providedIn: 'root',
})
export class ObjectivesService {
    privateObjectives: Objective[];
    publicObjectives: Objective[];

    constructor(private wordValidationService: WordValidationService, private playerService: PlayerService) {
        this.privateObjectives = [DEFAULT_OBJECTIVE, DEFAULT_OBJECTIVE];
        this.publicObjectives = [DEFAULT_OBJECTIVE, DEFAULT_OBJECTIVE];
    }

    initializeObjectives(objectivesIndexes: number[]) {
        for (let i = 0; i < objectivesIndexes.length; i++) {
            if (i < NUMBER_OF_OBJECTIVES) {
                this.privateObjectives[i] = OBJECTIVES[objectivesIndexes[i]];
            } else {
                this.publicObjectives[i - NUMBER_OF_OBJECTIVES] = OBJECTIVES[objectivesIndexes[i]];
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
                this.validateObjectiveOne();
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
                this.validateObjectiveSeven();
                break;
            }
            case 8: {
                break;
            }
            default: {
                break;
            }
        }
    }

    validateObjectiveOne() {
        return;
    }

    validateObjectiveSeven() {
        console.log(this.wordValidationService.lastPlayedWords.keys());
        for (const word of this.wordValidationService.lastPlayedWords.keys()) {
            console.log(word);
            if (word.length > 7) this.playerService.addScore(OBJECTIVES[6].score, PLAYER_ONE_INDEX);
        }
    }
}
