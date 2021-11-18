import { Component, OnInit } from '@angular/core';
import { Objective } from '@app/classes/objectives';

@Component({
    selector: 'app-objectives',
    templateUrl: './objectives.component.html',
    styleUrls: ['./objectives.component.scss'],
})
export class ObjectivesComponent implements OnInit {
    privateObjectives: Objective[];
    publicObjectives: Objective[];

    ngOnInit() {
        const objectif1: Objective = { name: 'test1', isCompleted: true, score: 20 };
        const objectif2: Objective = { name: 'test2', isCompleted: false, score: 56 };
        const objectif3: Objective = { name: 'test3', isCompleted: false, score: 99 };
        this.privateObjectives = [objectif1, objectif1];
        this.publicObjectives = [objectif2, objectif3];
        console.log(this.publicObjectives);
    }
}
