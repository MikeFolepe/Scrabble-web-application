import { Component, OnInit } from '@angular/core';
// import { SkipTurnService } from '@app/services/skip-turn.service';
import { Objective } from '@app/classes/objectives';
import { GameSettingsService } from '@app/services/game-settings.service';
import { ObjectivesService } from '@app/services/objectives.service';

@Component({
    selector: 'app-objectives',
    templateUrl: './objectives.component.html',
    styleUrls: ['./objectives.component.scss'],
})
export class ObjectivesComponent implements OnInit {
    objectives: Objective[][];
    activeTimeRemaining: number;

    constructor(public objectivesService: ObjectivesService, public gameSettingsService: GameSettingsService) {
        this.objectives = [[], []];
    }

    ngOnInit() {
        this.objectives = this.objectivesService.objectives;
    }
}
