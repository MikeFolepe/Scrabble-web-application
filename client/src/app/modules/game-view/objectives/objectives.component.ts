import { Component, OnInit } from '@angular/core';
import { ObjectivesService } from '@app/services/objectives.service';
import { Objective } from '@common/objectives';

@Component({
    selector: 'app-objectives',
    templateUrl: './objectives.component.html',
    styleUrls: ['./objectives.component.scss'],
})
export class ObjectivesComponent implements OnInit {
    privateObjectives: Objective[];
    publicObjectives: Objective[];
    activeTimeRemaining: number;

    constructor(public objectivesService: ObjectivesService) {}

    ngOnInit() {
        this.privateObjectives = this.objectivesService.privateObjectives;
        this.publicObjectives = this.objectivesService.publicObjectives;
    }

    onupdate() {
        const indexes: number[] = [4, 0, 2, 1];
        this.objectivesService.initializeObjectives(indexes);
        this.privateObjectives[1].isCompleted = true;
    }
}
