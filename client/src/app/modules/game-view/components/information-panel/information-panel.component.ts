import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PLAYERS_NUMBER } from '@app/classes/constants';
import { GameSettings } from '@app/classes/game-settings';
import { Player } from '@app/models/player.model';
import { CountdownComponent } from '@app/modules/game-view/components/countdown/countdown.component';
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
export class InformationPanelComponent implements OnInit, OnDestroy {
    @ViewChild(CountdownComponent) countDown: CountdownComponent;
    players: Player[] = new Array<Player>();
    gameSettings: GameSettings;
    tour: boolean;
    settingsSubscription: Subscription = new Subscription();
    playerSubscription: Subscription = new Subscription();
    tourSubscription: Subscription = new Subscription();

    constructor(
        private gameSettingsService: GameSettingsService,
        private letterService: LetterService,
        private playerService: PlayerService,
        private tourService: TourService,
    ) {}
    ngOnInit(): void {
        this.subscribeToGameSettings();
        this.initializePlayers();
        this.subscribeToPlayers();
        this.initializeFirstTour();
        this.subscribeToTourSubject();
    }

    // initializing players to playersService
    initializePlayers() {
        let id = 0;
        for (let i = 0; i < PLAYERS_NUMBER; i++) {
            const player = new Player(++id, this.gameSettings.playersName[i], 0, this.letterService.getRandomLetters());
            this.playerService.addPlayer(player);
        }
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
            } else if (this.tour === true) {
                this.tour = false;
                this.reAssignTour(this.tour);
            }
        }
        this.countDown.setTimer();
        // setTimeout(() => {
        // }, 3000);
    }

    ngOnDestroy(): void {
        this.players = [];
        // unsubscription to subjects
        this.settingsSubscription.unsubscribe();
        this.playerSubscription.unsubscribe();
        // Se desabonner de la sousciption dans le tour
        this.tourSubscription.unsubscribe();
    }
}
