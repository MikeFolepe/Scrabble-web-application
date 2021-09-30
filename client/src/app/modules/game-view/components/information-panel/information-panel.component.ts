import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GameSettings } from '@app/classes/game-settings';
import { PlayerIA } from '@app/models/player-ia.model';
import { Player } from '@app/models/player.model';
import { CountdownComponent } from '@app/modules/game-view/components/countdown/countdown.component';
import { GameSettingsService } from '@app/services/game-settings.service';
import { LetterService } from '@app/services/letter.service';
// eslint-disable-next-line import/no-deprecated
import { PlayerService } from '@app/services/player.service';
import { TourService } from '@app/services/tour.service';
import { Subscription } from 'rxjs';
import { PlayerIAComponent } from '../player-ia/player-ia.component';

@Component({
    selector: 'app-information-panel',
    templateUrl: './information-panel.component.html',
    styleUrls: ['./information-panel.component.scss'],
})
export class InformationPanelComponent implements OnInit, OnDestroy {
    @ViewChild(CountdownComponent) countDown: CountdownComponent;
    @ViewChild(PlayerIAComponent) playerIA: PlayerIAComponent;
    players: Player[] = new Array<Player>();
    gameSettings: GameSettings;
    tour: boolean;
    reservestate: number;
    settingsSubscription: Subscription = new Subscription();
    playerSubscription: Subscription = new Subscription();
    tourSubscription: Subscription = new Subscription();
    message: string;
    reserveSubsciption: Subscription = new Subscription();
    constructor(
        private gameSettingsService: GameSettingsService,
        public letterService: LetterService,
        private playerService: PlayerService,
        private tourService: TourService,
    ) {}
    ngOnInit(): void {
        this.subscribeToGameSettings();
        this.initializePlayers();
        this.subscribeToPlayers();
        this.initializeFirstTour();
        this.subscribeToTourSubject();
        this.reservestate = this.letterService.getNumbersLetterAvailable();
        this.reserveSubsciption = this.letterService.currentMessage.subscribe((message) => (this.message = message));
        this.letterService.updateReserve(this.updateReserve.bind(this));
    }

    // initializing players to playersService
    initializePlayers() {
        let player = new Player(1, this.gameSettings.playersName[0], this.letterService.getRandomLetters());
        this.playerService.addPlayer(player);
        player = new PlayerIA(2, this.gameSettings.playersName[1], this.letterService.getRandomLetters());
        this.playerService.addPlayer(player);
    }
    //  function to subscribe to Tour subject
    subscribeToTourSubject(): void {
        this.tourSubscription = this.tourService.tourSubject.subscribe((tourSubject: boolean) => {
            this.tour = tourSubject;
        });
        this.tourService.emitTour();
    }

    // function to initialize the boolean specifying which player will start first
    initializeFirstTour(): void {
        this.tourService.initializeTour(Boolean(this.gameSettings.startingPlayer.valueOf()));
    }
    //  function to subscribe to gameSettings subject
    subscribeToGameSettings(): void {
        this.settingsSubscription = this.gameSettingsService.gameSettingsSubject.subscribe((gameSettingsFromSubject: GameSettings) => {
            this.gameSettings = gameSettingsFromSubject;
        });
        this.gameSettingsService.emitGameSettings();
    }
    //  function to subscribe to players subject
    subscribeToPlayers(): void {
        this.playerSubscription = this.playerService.playerSubject.subscribe((playersFromSubject: Player[]) => {
            this.players = playersFromSubject;
        });
        this.playerService.emitPlayers();
    }

    reAssignTour(tour: boolean): void {
        this.tourService.initializeTour(tour);
    }

    switchTour(counter: number): void {
        this.subscribeToTourSubject();
        if (counter === 0) {
            if (this.tour === false) {
                this.tour = true;
                this.reAssignTour(this.tour);
                this.countDown.setTimer();
            } else if (this.tour === true) {
                this.tour = false;
                this.reAssignTour(this.tour);
                this.countDown.setTimer();
                this.playerIA.play();
            }
        }
    }
    updateReserve() {
        if (this.message === 'mise a jour') {
            this.reservestate = this.letterService.getNumbersLetterAvailable();
        }
    }
    ngOnDestroy(): void {
        // unsubscription to subjects
        this.settingsSubscription.unsubscribe();
        this.playerSubscription.unsubscribe();
        // Se desabonner de la sousciption dans le tour
        this.tourSubscription.unsubscribe();
        this.playerService.clearPlayers();
        this.reserveSubsciption.unsubscribe();
    }
}
