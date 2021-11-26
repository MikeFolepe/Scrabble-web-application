import { Component, OnInit } from '@angular/core';
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

    constructor(public objectivesService: ObjectivesService) {
        this.objectives = [[], []];
    }

    ngOnInit() {
        this.objectives = this.objectivesService.objectives;
    }
}
