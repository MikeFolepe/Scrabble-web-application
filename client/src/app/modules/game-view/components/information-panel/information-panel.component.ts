import { Component, OnDestroy, OnInit } from '@angular/core';
import { INDEX_PLAYER_IA, INDEX_REAL_PLAYER } from '@app/classes/constants';
import { GameSettings } from '@app/classes/game-settings';
import { PlayerIA } from '@app/models/player-ia.model';
import { Player } from '@app/models/player.model';
import { GameSettingsService } from '@app/services/game-settings.service';
import { LetterService } from '@app/services/letter.service';
import { PassTurnService } from '@app/services/pass-turn.service';
import { PlayerService } from '@app/services/player.service';

@Component({
    selector: 'app-information-panel',
    templateUrl: './information-panel.component.html',
    styleUrls: ['./information-panel.component.scss'],
})
export class InformationPanelComponent implements OnInit, OnDestroy {
    gameSettings: GameSettings;
    constructor(
        public gameSettingsService: GameSettingsService,
        public letterService: LetterService,
        public playerService: PlayerService,
        public passTurn: PassTurnService,
    ) {
        this.gameSettings = gameSettingsService.gameSettings;
    }

    ngOnInit(): void {
        this.initializePlayers();
        this.initializeFirstTurn();
        this.passTurn.startTimer();
    }

    initializePlayers(): void {
        let player = new Player(1, this.gameSettings.playersName[INDEX_REAL_PLAYER], this.letterService.getRandomLetters());
        this.playerService.addPlayer(player);
        player = new PlayerIA(2, this.gameSettings.playersName[INDEX_PLAYER_IA], this.letterService.getRandomLetters());
        this.playerService.addPlayer(player);
    }

    initializeFirstTurn(): void {
        this.passTurn.isTurn = Boolean(this.gameSettings.startingPlayer.valueOf());
    }

    ngOnDestroy(): void {
        this.playerService.clearPlayers();
    }
}
