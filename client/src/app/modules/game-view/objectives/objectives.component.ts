import { Component, OnInit } from '@angular/core';
import { GameSettingsService } from '@app/services/game-settings.service';
import { ObjectivesService } from '@app/services/objectives.service';
import { Objective } from '@common/objectives';

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
