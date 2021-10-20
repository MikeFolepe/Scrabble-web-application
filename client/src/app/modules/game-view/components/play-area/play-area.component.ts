import { Component } from '@angular/core';
import { EndGameService } from '@app/services/end-game.service';

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent {
    constructor(public endGameService: EndGameService) {}
}
