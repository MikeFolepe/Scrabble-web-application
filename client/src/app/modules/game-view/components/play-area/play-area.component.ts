import { Component } from '@angular/core';
import { SkipTurnService } from '@app/services/skip-turn.service';

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent {
    // isTour: boolean = true;
    // timechoise: number = 60000;
    constructor(public skipTurn: SkipTurnService) {}
}
