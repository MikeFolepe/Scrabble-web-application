import { Component, OnDestroy, OnInit } from '@angular/core';
import { INDEX_PLAYER_AI, INDEX_PLAYER_ONE, INDEX_PLAYER_TWO } from '@app/classes/constants';
import { EndGameService } from '@app/services/end-game.service';
import { GameSettings } from '@common/game-settings';
import { Letter } from '@app/classes/letter';
import { PlayerAI } from '@app/models/player-ai.model';
import { Player } from '@app/models/player.model';
import { ClientSocketService } from '@app/services/client-socket.service';
import { GameSettingsService } from '@app/services/game-settings.service';
import { LetterService } from '@app/services/letter.service';
import { PlayerService } from '@app/services/player.service';
import { SkipTurnService } from '@app/services/skip-turn.service';

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
        public skipTurn: SkipTurnService,
        public endGameService: EndGameService,
        private clientSocketService: ClientSocketService,
    ) {
        this.gameSettings = gameSettingsService.gameSettings;
    }

    ngOnInit(): void {
        this.initializePlayers();
        this.receivePlayerTwo();
        this.initializeFirstTurn();
        if (this.gameSettingsService.isSoloMode) this.skipTurn.startTimer();
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
            player = new PlayerAI(2, this.gameSettings.playersName[INDEX_PLAYER_AI], this.letterService.getRandomLetters());
            this.playerService.addPlayer(player);
        } else {
            this.clientSocketService.socket.emit('sendPlayerTwo', player.letterTable, this.clientSocketService.roomId);
        }
    }

    initializeFirstTurn(): void {
        this.skipTurn.isTurn = Boolean(this.gameSettings.startingPlayer.valueOf());
    }

    ngOnDestroy(): void {
        this.playerService.clearPlayers();
        this.skipTurn.stopTimer();
    }
}
