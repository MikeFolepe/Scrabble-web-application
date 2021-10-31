/* eslint-disable import/namespace */
/* eslint-disable import/no-deprecated */
/* eslint-disable sort-imports */
import { Component } from '@angular/core';
import { ChatboxService } from '@app/services/chatbox.service';
import { EndGameService } from '@app/services/end-game.service';
import { GameSettingsService } from '@app/services/game-settings.service';
import { SkipTurnService } from '@app/services/skip-turn.service';

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent {
    // isTour: boolean = true;
    // timechoise: number = 60000;
    constructor(
        public chatBox: ChatboxService,
        public gamesettingsService: GameSettingsService,
        public skipTurn: SkipTurnService,
        public endGameService: EndGameService,
    ) {}
}
