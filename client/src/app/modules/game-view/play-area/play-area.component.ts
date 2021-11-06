import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GiveUpGameDialogComponent } from '@app/modules/game-view/give-up-game-dialog/give-up-game-dialog.component';
import { BoardHandlerService } from '@app/services/board-handler.service';
import { ChatboxService } from '@app/services/chatbox.service';
import { ClientSocketService } from '@app/services/client-socket.service';
import { EndGameService } from '@app/services/end-game.service';
import { GameSettingsService } from '@app/services/game-settings.service';
import { SkipTurnService } from '@app/services/skip-turn.service';

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent {
    constructor(
        public gamesettingsService: GameSettingsService,
        public endGameService: EndGameService,
        public chatBoxService: ChatboxService,
        public boardHandlerService: BoardHandlerService,
        public skipTurnService: SkipTurnService,
        private clientSocketService: ClientSocketService,
        public dialog: MatDialog,
    ) {}

    giveUpGame(): void {
        const ref = this.dialog.open(GiveUpGameDialogComponent, { disableClose: true });

        ref.afterClosed().subscribe((decision: boolean) => {
            // if user closes the dialog box without do nothing
            if (!decision) return;
            // if decision is true EndGame occures
            this.clientSocketService.socket.emit('sendEndGamebyGiveUp', decision, this.clientSocketService.roomId);
        });
    }
}
