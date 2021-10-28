import { Component, OnDestroy, OnInit } from '@angular/core';
import { INDEX_PLAYER_AI, INDEX_REAL_PLAYER } from '@app/classes/constants';
import { GameSettings } from '@app/classes/game-settings';
import { PlayerAI } from '@app/models/player-ai.model';
import { Player } from '@app/models/player.model';
import { EndGameService } from '@app/services/end-game.service';
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
    constructor(
        public gameSettingsService: GameSettingsService,
        public letterService: LetterService,
        public playerService: PlayerService,
        public skipTurnService: SkipTurnService,
        public endGameService: EndGameService,
    ) {
        this.gameSettings = gameSettingsService.gameSettings;
    }

    ngOnInit(): void {
        this.initializePlayers();
        this.initializeFirstTurn();
        this.skipTurnService.startTimer();
    }

    initializePlayers(): void {
        let player = new Player(1, this.gameSettings.playersName[INDEX_REAL_PLAYER], this.letterService.getRandomLetters());
        this.playerService.addPlayer(player);
<<<<<<< HEAD
        player = new PlayerAI(2, this.gameSettings.playersName[1], this.letterService.getRandomLetters());
        // TODO: Resoudre en fonction du mode
=======
        player = new PlayerAI(2, this.gameSettings.playersName[INDEX_PLAYER_AI], this.letterService.getRandomLetters());
>>>>>>> 9fef5b9307a31a22229ab27da685083c2eef4485
        this.playerService.addPlayer(player);
    }

    initializeFirstTurn(): void {
        this.skipTurnService.isTurn = Boolean(this.gameSettings.startingPlayer.valueOf());
    }

<<<<<<< HEAD
    switchTour(counter: number): void {
        if (this.endGameService.isEndGame) return;
        this.tour = this.tourService.getTour();
        if (counter === 0) {
            if (this.tour === false) {
                this.tour = true;
                this.reAssignTour(this.tour);
                this.countDown.setTimer();
            } else if (this.tour === true) {
                this.tour = false;
                this.reAssignTour(this.tour);
                this.countDown.setTimer();
                this.playerAI.play();
                // TODO: Resoudre en fonction du mode
            }
        }
    }

    updateView() {
        if (this.message === 'mise a jour') {
            this.reserveState = this.letterService.getReserveSize();
            this.players[INDEX_REAL_PLAYER].letterTable = this.playerService.getLettersEasel(INDEX_REAL_PLAYER);
            this.players[INDEX_PLAYER_AI].letterTable = this.playerService.getLettersEasel(INDEX_PLAYER_AI);
            this.players[INDEX_REAL_PLAYER].score = this.playerService.getScore(INDEX_REAL_PLAYER);
            this.players[INDEX_PLAYER_AI].score = this.playerService.getScore(INDEX_PLAYER_AI);
        }
    }
=======
>>>>>>> 9fef5b9307a31a22229ab27da685083c2eef4485
    ngOnDestroy(): void {
        this.playerService.clearPlayers();
        this.skipTurnService.stopTimer();
    }
}
