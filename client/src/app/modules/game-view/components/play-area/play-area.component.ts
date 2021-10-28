import { Component } from '@angular/core';
import { ChatboxService } from '@app/services/chatbox.service';
import { EndGameService } from '@app/services/end-game.service';
import { SkipTurnService } from '@app/services/skip-turn.service';

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent {
    constructor(public chatBox: ChatboxService, public skipTurn: SkipTurnService, public endGameService: EndGameService) {}
}
