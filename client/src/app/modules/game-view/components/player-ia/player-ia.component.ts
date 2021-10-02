import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { PlayerIA } from '@app/models/player-ia.model';
import { Player } from '@app/models/player.model';
import { LetterService } from '@app/services/letter.service';
import { PassTourService } from '@app/services/pass-tour.service';
// eslint-disable-next-line import/no-deprecated
import { PlayerService } from '@app/services/player.service';
import { TourService } from '@app/services/tour.service';
import { Subscription } from 'rxjs';
import { PassTourComponent } from '../pass-tour/pass-tour.component';

@Component({
    selector: 'app-player-ia',
    templateUrl: './player-ia.component.html',
    styleUrls: ['./player-ia.component.scss'],
})
export class PlayerIAComponent implements OnInit {
    @ViewChild(PassTourComponent) passTurn: PassTourComponent;
    // Pour dire à la boite que j'ai passé mon tour.
    @Output() iaSkipped = new EventEmitter();
    // Pour dire à la boite que j'ai echanger des lettres ( je sais pas si c'est une information
    // requise dans le flux de la BC ??).
    @Output() iaSwapped = new EventEmitter();
    // Pour dire à la boite que j'ai placer des lettres.
    @Output() iaPlaced = new EventEmitter();
    // Pour le mode debug
    @Output() iaPossibility = new EventEmitter();

    @Input() isPlacementValid: boolean = false;

    @Input() scrabbleBoard: string[][];

    @Input() isFirstRound: boolean;
    message: string;
    passSubscription: Subscription = new Subscription();
    iaPlayer: PlayerIA;
    tourSubscription: Subscription = new Subscription();
    tour: boolean;
    constructor(
        public letterService: LetterService,
        public playerService: PlayerService,
        public tourService: TourService,
        public passTourService: PassTourService,
    ) {}

    ngOnInit(): void {
        // Subscribe to get access to IA Player
        this.playerService.playerSubject.subscribe((playersFromSubject: Player[]) => {
            // Downcasting forcé par Mike
            this.iaPlayer = playersFromSubject[1] as PlayerIA;
        });
        this.playerService.emitPlayers();
        // Set the playerIA context so that the player can lunch event
        this.iaPlayer.setContext(this);
        // this.passSubscription = this.passTourService.currentMessage.subscribe((message) => (this.message = message));
        this.tourSubscription = this.tourService.tourSubject.subscribe((tourSubject: boolean) => {
            this.tour = tourSubject;
        });
        this.tourService.emitTour();

        if (this.tour === false) {
            setTimeout(() => {
                this.play();
            }, 5000);
        }
    }

    play() {
        // debugger;
        if (this.tourService.getTour() === false) {
            setTimeout(() => {
                this.iaPlayer.play();
            }, 5000);
        }
    }

    skip() {
        this.iaSkipped.emit();
        if (this.tourService.getTour() === false) {
            setTimeout(() => {
                this.passTurn.toggleTour();
            }, 5000);
        }
    }

    swap() {
        this.iaSwapped.emit();
        if (this.tourService.getTour() === false) {
            setTimeout(() => {
                this.passTurn.toggleTour();
            }, 5000);
        }
    }

    place(object: { start: Vec2; orientation: string; word: string }, possibility: { word: string; nbPt: number }[]) {
        this.iaPlaced.emit(object);
        this.iaPossibility.emit(possibility);
        setTimeout(() => {
            this.passTurn.toggleTour();
        }, 5000);
    }

    ngOndestroy() {
        this.tourSubscription.unsubscribe();
        // this.passSubscription.unsubscribe();
    }
}
