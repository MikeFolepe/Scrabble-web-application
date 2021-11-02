import { ChatboxService } from '@app/services/chatbox.service';
import { Component } from '@angular/core';
import { EndGameService } from '@app/services/end-game.service';
import { SkipTurnService } from '@app/services/skip-turn.service';

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent {
    // isTour: boolean = true;
    // timechoise: number = 60000;
    constructor(public chatBox: ChatboxService, public skipTurn: SkipTurnService, public endGameService: EndGameService) {}
}
