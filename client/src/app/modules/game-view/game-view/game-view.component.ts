import { Component, OnInit } from '@angular/core';
import { ClientSocketService } from '@app/services/client-socket.service';
import { GameSettingsService } from '@app/services/game-settings.service';
import { GridService } from '@app/services/grid.service';
import { Router } from '@angular/router';
import { EndGameService } from '@app/services/end-game.service';
import { ChatboxService } from '@app/services/chatbox.service';
import { BoardHandlerService } from '@app/services/board-handler.service';
import { SkipTurnService } from '@app/services/skip-turn.service';

@Component({
    selector: 'app-game-view',
    templateUrl: './game-view.component.html',
    styleUrls: ['./game-view.component.scss'],
})
export class GameViewComponent implements OnInit {
    constructor(
        public endGameService: EndGameService,
        public clientSocketService: ClientSocketService,
        private router: Router,
        private gridService: GridService,
        private gameSettingsService: GameSettingsService,
        public chatBoxService: ChatboxService,
        public boardHandlerService: BoardHandlerService,
        public skipTurnService: SkipTurnService,
    ) {}

    ngOnInit() {
        const mapBonus = new Map<string, string>();
        JSON.parse(this.gameSettingsService.gameSettings.bonusPositions).map((element: string[]) => {
            mapBonus.set(element[0], element[1]);
        });
        this.gridService.bonusPositions = mapBonus;
        this.clientSocketService.socket.on('goToMainMenu', () => {
            this.router.navigate(['home']);
        });
    }
}
