/* eslint-disable import/namespace */
/* eslint-disable import/no-deprecated */
/* eslint-disable sort-imports */
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GiveUpGameDialogComponent } from '@app/modules/initialize-solo-game/give-up-game-dialog/give-up-game-dialog.component';
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
        public chatBox: ChatboxService,
        public gamesettingsService: GameSettingsService,
        public skipTurn: SkipTurnService,
        public endGameService: EndGameService,
        public dialog: MatDialog,
        private clientSocketService: ClientSocketService,
    ) {}

    giveUpGame(): void {
        const ref = this.dialog.open(GiveUpGameDialogComponent, { disableClose: true });

        ref.afterClosed().subscribe((decision: boolean) => {
            // if user closes the dialog box without input nothing
            if (!decision) return;
            // if decision is true the EndGame occures
            this.clientSocketService.socket.emit('sendEndGamebyGiveUp', decision, this.clientSocketService.roomId);
        });
    }
}
