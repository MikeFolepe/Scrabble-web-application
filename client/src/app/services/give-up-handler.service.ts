import { Injectable } from '@angular/core';
import { ClientSocketService } from '@app/services/client-socket.service';
import { GameSettingsService } from './game-settings.service';
import { PlayerService } from './player.service';
import { SkipTurnService } from './skip-turn.service';

@Injectable({
    providedIn: 'root',
})
export class GiveUpHandlerService {
    constructor(
        public gameSettingsService: GameSettingsService,
        private clientSocket: ClientSocketService,
        public playerService: PlayerService,
        public skipturnService: SkipTurnService,
    ) {
        this.receiveEndGameByGiveUp();
    }

    receiveEndGameByGiveUp(): void {
        this.clientSocket.socket.on('receiveEndGameByGiveUp', (isEndGameByGiveUp: boolean, winnerName: string) => {
            this.gameSettingsService.gameSettings.playersNames[1] = 'Miis_Betty';
            this.playerService.players[1].name = 'Miss_Betty';
            if (winnerName === this.gameSettingsService.gameSettings.playersNames[0]) {
                this.gameSettingsService.isSoloMode = isEndGameByGiveUp;
            }
        });
    }
}
