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
        // Dangereux car s'il y'a update de l'etat d'un objectif dans le service
        // je ne suis pas sure que ta vue va s'update dynamiquement
        // car tu as une copie des états des objectifs au moment de l'initialisation de la vue
        // solution: utiliser this.objectivesService.attribDuServiceAAfficher dans le html
        this.objectives = this.objectivesService.objectives;
        console.log(this);
    }

    onupdate() {
        this.ngOnInit();
        this.objectives[1][1].isCompleted = true;
    }
}
