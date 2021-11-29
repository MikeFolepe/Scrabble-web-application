import { Injectable } from '@angular/core';
import { PLAYER_TWO_INDEX } from '@app/classes/constants';
import { PlayerAI } from '@app/models/player-ai.model';
import { ClientSocketService } from '@app/services/client-socket.service';
import { AdministratorService } from './administrator.service';
import { GameSettingsService } from './game-settings.service';
import { PlayerAIService } from './player-ai.service';
import { PlayerService } from './player.service';
import { SkipTurnService } from './skip-turn.service';

@Injectable({
    providedIn: 'root',
})
export class GiveUpHandlerService {
    isGivenUp: boolean;
    constructor(
        public gameSettingsService: GameSettingsService,
        private clientSocket: ClientSocketService,
        public playerService: PlayerService,
        public skipTurnService: SkipTurnService,
        private playerAIservice: PlayerAIService,
        private administratorService: AdministratorService,
    ) {
        this.isGivenUp = false;
    }
    receiveEndGameByGiveUp(): void {
        this.clientSocket.socket.on('receiveEndGameByGiveUp', (isGiveUp: boolean, winnerName: string) => {
            if (winnerName === this.gameSettingsService.gameSettings.playersNames[0]) {
                this.gameSettingsService.isSoloMode = isGiveUp;
                this.isGivenUp = isGiveUp;
                this.gameSettingsService.gameSettings.playersNames[1] = this.administratorService.getAiBeginnerName();
                const playerAi = new PlayerAI(
                    2,
                    this.gameSettingsService.gameSettings.playersNames[1],
                    this.playerService.players[PLAYER_TWO_INDEX].letterTable,
                    this.playerAIservice,
                );
                this.playerService.players[PLAYER_TWO_INDEX] = playerAi;
                if (!this.skipTurnService.isTurn) playerAi.play();
            }
        });
    }
}
