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

    constructor(private objectivesService: ObjectivesService) {}

    ngOnInit() {
        this.privateObjectives = this.objectivesService.privateObjectives;
        this.publicObjectives = this.objectivesService.publicObjectives;
    }

    onUpdate(): void {
        // TODO regarder les nombres magic ici
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const indexes: number[] = [3, 0, 7, 4];
        this.objectivesService.initializeObjectives(indexes);
        this.privateObjectives[1].isCompleted = true;
    }
}
