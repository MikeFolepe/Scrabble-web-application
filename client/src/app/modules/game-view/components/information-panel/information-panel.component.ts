import { Component, OnDestroy, OnInit } from '@angular/core';
import { INDEX_PLAYER_AI, INDEX_REAL_PLAYER } from '@app/classes/constants';
import { GameSettings } from '@app/classes/game-settings';
import { PlayerAI } from '@app/models/player-ai.model';
import { Player } from '@app/models/player.model';
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
    gameSettings: GameSettings;
    skipTurnService: SkipTurnService;
    constructor(
        public gameSettingsService: GameSettingsService,
        public letterService: LetterService,
        public playerService: PlayerService,
        public skipTurn: SkipTurnService,
    ) {
        this.gameSettings = gameSettingsService.gameSettings;
    }

    ngOnInit(): void {
        this.initializePlayers();
        this.initializeFirstTurn();
        this.skipTurn.startTimer();
        console.log('info');
    }

    initializePlayers(): void {
        let player = new Player(1, this.gameSettings.playersName[INDEX_REAL_PLAYER], this.letterService.getRandomLetters());
        this.playerService.addPlayer(player);
        player = new PlayerAI(2, this.gameSettings.playersName[INDEX_PLAYER_AI], this.letterService.getRandomLetters());
        this.playerService.addPlayer(player);
    }

    initializeFirstTurn(): void {
        this.skipTurn.isTurn = Boolean(this.gameSettings.startingPlayer.valueOf());
    }

    ngOnDestroy(): void {
        this.playerService.clearPlayers();
    }
}
