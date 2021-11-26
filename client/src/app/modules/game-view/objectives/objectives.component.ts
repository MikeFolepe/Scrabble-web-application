import { Component, OnInit } from '@angular/core';
import { GameSettingsService } from '@app/services/game-settings.service';
import { ObjectivesService } from '@app/services/objectives.service';
import { SkipTurnService } from '@app/services/skip-turn.service';
import { Objective } from '@common/objectives';

@Component({
    selector: 'app-objectives',
    templateUrl: './objectives.component.html',
    styleUrls: ['./objectives.component.scss'],
})
export class ObjectivesComponent implements OnInit {
    objectives: Objective[][];
    activeTimeRemaining: number;

    constructor(
        public objectivesService: ObjectivesService,
        public gameSettingsService: GameSettingsService,
        private skipTurnService: SkipTurnService,
    ) {
        this.objectives = [[], []];
    }

    resolveByTurn(): number {
        if (this.gameSettingsService.isSoloMode) return this.skipTurnService.isTurn ? 0 : 1;

        return 0;
    }

    ngOnInit() {
        this.objectives = this.objectivesService.objectives;
    }
}
