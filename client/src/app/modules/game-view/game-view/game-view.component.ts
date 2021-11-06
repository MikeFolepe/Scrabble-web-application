import { Component, OnInit } from '@angular/core';
import { ClientSocketService } from '@app/services/client-socket.service';
import { GameSettingsService } from '@app/services/game-settings.service';
import { GridService } from '@app/services/grid.service';
import { EndGameService } from '@app/services/end-game.service';
import { ChatboxService } from '@app/services/chatbox.service';
import { BoardHandlerService } from '@app/services/board-handler.service';
import { SkipTurnService } from '@app/services/skip-turn.service';
import { DEFAULT_FONT_SIZE } from '@app/classes/constants';
import { PlayerService } from '@app/services/player.service';
import { GiveUpGameDialogComponent } from '@app/modules/initialize-solo-game/give-up-game-dialog/give-up-game-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-game-view',
    templateUrl: './game-view.component.html',
    styleUrls: ['./game-view.component.scss'],
})
export class GameViewComponent implements OnInit {
    fontSize: number = DEFAULT_FONT_SIZE;

    constructor(
        public endGameService: EndGameService,
        public clientSocketService: ClientSocketService,
        private gridService: GridService,
        public gameSettingsService: GameSettingsService,
        public chatBoxService: ChatboxService,
        public boardHandlerService: BoardHandlerService,
        public skipTurnService: SkipTurnService,
        private playerService: PlayerService,
        public dialog: MatDialog,
    ) {}

    ngOnInit() {
        const mapBonus = new Map<string, string>();
        JSON.parse(this.gameSettingsService.gameSettings.bonusPositions).map((element: string[]) => {
            mapBonus.set(element[0], element[1]);
        });
        this.gridService.bonusPositions = mapBonus;
    }

    handleFontSizeEvent(fontSizeEvent: number) {
        this.fontSize = fontSizeEvent;
        this.playerService.updateFontSize(this.fontSize);
    }

    giveUpGame(): void {
        const ref = this.dialog.open(GiveUpGameDialogComponent, { disableClose: true });

        ref.afterClosed().subscribe((decision: boolean) => {
            // if user closes the dialog box without input nothing
            if (!decision) return;
            // if decision is true the EndGame occurres
            this.clientSocketService.socket.emit('sendEndGameByGiveUp', decision, this.clientSocketService.roomId);
        });
    }
}
