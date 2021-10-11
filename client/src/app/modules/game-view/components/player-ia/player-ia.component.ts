import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DELAY_TO_PLAY } from '@app/classes/constants';
import { Vec2 } from '@app/classes/vec2';
import { PlayerIA } from '@app/models/player-ia.model';
import { Player } from '@app/models/player.model';
import { PassTourComponent } from '@app/modules/game-view/components/pass-tour/pass-tour.component';
import { DebugService } from '@app/services/debug.service';
import { LetterService } from '@app/services/letter.service';
import { PassTourService } from '@app/services/pass-tour.service';
import { PlayerService } from '@app/services/player.service';
import { TourService } from '@app/services/tour.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-player-ia',
    templateUrl: './player-ia.component.html',
    styleUrls: ['./player-ia.component.scss'],
})
export class PlayerIAComponent implements OnInit {
    @ViewChild(PassTourComponent) passTurn: PassTourComponent;

    @Output() iaSkipped = new EventEmitter();
    @Output() iaSwappedr = new EventEmitter();
    @Output() iaPlaced = new EventEmitter();
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
        public passtourService: PassTourService,
        public debugService: DebugService,
    ) {}

    ngOnInit(): void {
        // Subscribe to get access to IA Player
        this.playerService.playerSubject.subscribe((playersFromSubject: Player[]) => {
            this.iaPlayer = playersFromSubject[1] as PlayerIA;
        });
        this.playerService.emitPlayers();
        // Set the playerIA context so that the player can lunch event
        this.iaPlayer.setContext(this);
        // this.passSubscription = this.passtourService.currentMessage.subscribe((message) => (this.message = message));
        this.tourSubscription = this.tourService.tourSubject.subscribe((tourSubject: boolean) => {
            this.tour = tourSubject;
        });
        this.tourService.emitTour();

        if (this.tour === false) {
            setTimeout(() => {
                this.play();
            }, DELAY_TO_PLAY);
        }
    }

    play() {
        if (this.tourService.getTour() === false) {
            setTimeout(() => {
                this.iaPlayer.play();
            }, DELAY_TO_PLAY);
        }
    }

    skip() {
        this.iaSkipped.emit();
        if (this.tourService.getTour() === false) {
            setTimeout(() => {
                this.passTurn.toogleTour();
            }, DELAY_TO_PLAY);
        }
    }

    swap() {
        this.iaSwappedr.emit();
        if (this.tourService.getTour() === false) {
            setTimeout(() => {
                this.passTurn.toogleTour();
            }, DELAY_TO_PLAY);
        }
    }

    place(object: { start: Vec2; orientation: string; word: string }, possibility: { word: string; nbPt: number }[]) {
        // console.log(this.iaPlayer.letterTable);
        // console.log('placer');
        this.iaPlaced.emit(object);
        this.debugService.receiveAIDebugPossibilities(possibility);
        //  this.endGameService.playerServiceActions.push('placer par IA');
        setTimeout(() => {
            this.passTurn.toogleTour();
        }, DELAY_TO_PLAY);
    }

    ngOndestroy() {
        this.tourSubscription.unsubscribe();
        // this.passSubscription.unsubscribe();
    }
}
