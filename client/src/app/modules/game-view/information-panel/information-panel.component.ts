/* eslint-disable sort-imports */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DELAY_BEFORE_PLAY, INDEX_PLAYER_AI, INDEX_PLAYER_ONE, INDEX_PLAYER_TWO } from '@app/classes/constants';
import { Letter } from '@common/letter';
import { PlayerAI } from '@app/models/player-ai.model';
import { Player } from '@app/models/player.model';
import { ClientSocketService } from '@app/services/client-socket.service';
import { EndGameService } from '@app/services/end-game.service';
import { GameSettingsService } from '@app/services/game-settings.service';
import { LetterService } from '@app/services/letter.service';
import { PlayerAIService } from '@app/services/player-ia.service';
import { PlayerService } from '@app/services/player.service';
import { SkipTurnService } from '@app/services/skip-turn.service';
import { GameSettings } from '@common/game-settings';

@Component({
    selector: 'app-information-panel',
    templateUrl: './information-panel.component.html',
    styleUrls: ['./information-panel.component.scss'],
})
export class InformationPanelComponent implements OnInit, OnDestroy {
    private gameSettings: GameSettings;
    constructor(
        public gameSettingsService: GameSettingsService,
        public letterService: LetterService,
        public playerService: PlayerService,
        public skipTurnService: SkipTurnService,
        public endGameService: EndGameService,
        private clientSocketService: ClientSocketService,
        public playerAiService: PlayerAIService,
    ) {
        this.gameSettings = gameSettingsService.gameSettings;
    }

    ngOnInit(): void {
        this.initializePlayers();
        this.receivePlayerTwo();
        this.initializeFirstTurn();
        this.skipTurnService.startTimer();

        if (!this.skipTurnService.isTurn) {
            const playerAi = this.playerService.players[INDEX_PLAYER_AI] as PlayerAI;
            setTimeout(() => {
                playerAi.play();
            }, DELAY_BEFORE_PLAY);
        }
    }

    receivePlayerTwo(): void {
        this.clientSocketService.socket.on('receivePlayerTwo', (letterTable: Letter[]) => {
            const player = new Player(2, this.gameSettings.playersName[INDEX_PLAYER_TWO], letterTable);
            this.playerService.addPlayer(player);
            this.letterService.removeLettersFromReserve(this.playerService.players[INDEX_PLAYER_ONE].letterTable);
        });
    }

    initializePlayers(): void {
        let player = new Player(1, this.gameSettings.playersName[INDEX_PLAYER_ONE], this.letterService.getRandomLetters());
        this.playerService.addPlayer(player);
        if (this.gameSettingsService.isSoloMode) {
            player = new PlayerAI(2, this.gameSettings.playersName[INDEX_PLAYER_TWO], this.letterService.getRandomLetters(), this.playerAiService);
            this.playerService.addPlayer(player);
            return;
        }

        this.clientSocketService.socket.emit('sendPlayerTwo', player.letterTable, this.clientSocketService.roomId);
    }

    initializeFirstTurn(): void {
        this.skipTurnService.isTurn = Boolean(this.gameSettings.startingPlayer.valueOf());
    }

    ngOnDestroy(): void {
        this.playerService.clearPlayers();
        this.skipTurnService.stopTimer();
    }
}
