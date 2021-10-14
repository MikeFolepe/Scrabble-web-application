import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { INDEX_PLAYER_AI, INDEX_REAL_PLAYER } from '@app/classes/constants';
import { GameSettings } from '@app/classes/game-settings';
import { PlayerAI } from '@app/models/player-ai.model';
import { Player } from '@app/models/player.model';
import { CountdownComponent } from '@app/modules/game-view/components/countdown/countdown.component';
import { PlayerAIComponent } from '@app/modules/game-view/components/player-ai/player-ai.component';
import { EndGameService } from '@app/services/end-game.service';
import { GameSettingsService } from '@app/services/game-settings.service';
import { LetterService } from '@app/services/letter.service';
import { PlayerService } from '@app/services/player.service';
import { TourService } from '@app/services/tour.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-information-panel',
    templateUrl: './information-panel.component.html',
    styleUrls: ['./information-panel.component.scss'],
})
export class InformationPanelComponent implements OnDestroy, OnInit {
    @ViewChild(CountdownComponent) countDown: CountdownComponent;
    @ViewChild(PlayerAIComponent) playerAI: PlayerAIComponent;
    players: Player[] = new Array<Player>();
    gameSettings: GameSettings;
    tour: boolean;
    reserveState: number;
    message: string;
    viewSubscription: Subscription = new Subscription();
    constructor(
        private gameSettingsService: GameSettingsService,
        public letterService: LetterService,
        private playerService: PlayerService,
        private tourService: TourService,
        public endGameService: EndGameService,
    ) {}
    ngOnInit(): void {
        this.gameSettings = this.gameSettingsService.getSettings();
        this.initializePlayers();
        this.players = this.playerService.getPlayers();
        this.initializeFirstTour();
        this.tour = this.tourService.getTour();
        this.reserveState = this.letterService.getReserveSize();
        this.viewSubscription = this.letterService.currentMessage.subscribe((message) => (this.message = message));
        this.letterService.updateView(this.updateView.bind(this));
    }

    // initializing players to playersService
    initializePlayers() {
        let player = new Player(1, this.gameSettings.playersName[0], this.letterService.getRandomLetters());
        this.playerService.addPlayer(player);
        player = new PlayerAI(2, this.gameSettings.playersName[1], this.letterService.getRandomLetters());
        this.playerService.addPlayer(player);
    }

    // function to initialize the boolean specifying which player will start first
    initializeFirstTour(): void {
        this.tourService.initializeTour(Boolean(this.gameSettings.startingPlayer.valueOf()));
    }

    reAssignTour(tour: boolean): void {
        this.tourService.initializeTour(tour);
    }

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
    ngOnDestroy(): void {
        this.playerService.clearPlayers();
        this.viewSubscription.unsubscribe();
    }
}
