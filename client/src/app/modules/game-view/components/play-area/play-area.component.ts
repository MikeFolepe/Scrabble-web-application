import { Component } from '@angular/core';
import { PassTurnService } from '@app/services/pass-turn.service';

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent {
    // isTour: boolean = true;
    // timechoise: number = 60000;
    constructor(public passTurn: PassTurnService) {}
}
