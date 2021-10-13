import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { PlayerAI } from '@app/models/player-ai.model';
import { Player } from '@app/models/player.model';
import { ChatboxService } from '@app/services/chatbox.service';
import { DELAY_TO_PLAY } from '@app/classes/constants';
import { DebugService } from '@app/services/debug.service';
import { LetterService } from '@app/services/letter.service';
import { PassTourService } from '@app/services/pass-tour.service';
import { PlaceLetterService } from '@app/services/place-letter.service';
import { PlayerService } from '@app/services/player.service';
import { TourService } from '@app/services/tour.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-player-ai',
    templateUrl: './player-ai.component.html',
    styleUrls: ['./player-ai.component.scss'],
})
export class PlayerAIComponent implements OnInit {
    // Pour dire à la boite que j'ai passé mon tour.
    @Output() aiSkipped = new EventEmitter();
    @Output() aiSwapped = new EventEmitter();
    // Pour le mode debug
    @Output() aiPossibility = new EventEmitter();

    message: string;
    passSubscription: Subscription = new Subscription();
    aiPlayer: PlayerAI;
    tourSubscription: Subscription = new Subscription();
    tour: boolean;

    constructor(
        public letterService: LetterService,
        public playerService: PlayerService,
        public tourService: TourService,
        public passtourService: PassTourService,
        public placeLetterService: PlaceLetterService,
        public chatBoxService: ChatboxService,
        public debugService: DebugService,
    ) {}

    ngOnInit(): void {
        // Subscribe to get access to AI Player
        this.playerService.playerSubject.subscribe((playersFromSubject: Player[]) => {
            this.aiPlayer = playersFromSubject[1] as PlayerAI;
        });
        this.playerService.emitPlayers();
        // Set the playerAI context so that the player can lunch event
        this.aiPlayer.setContext(this);
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
                this.aiPlayer.play();
            }, DELAY_TO_PLAY);
        }
    }

    skip() {
        this.aiSkipped.emit();
        if (this.tourService.getTour() === false) {
            setTimeout(() => {
                this.passtourService.writeMessage();
            }, DELAY_TO_PLAY);
        }
    }

    swap() {
        this.aiSwapped.emit();
        if (this.tourService.getTour() === false) {
            setTimeout(() => {
                this.passtourService.writeMessage();
            }, DELAY_TO_PLAY);
        }
    }

    place(object: { start: Vec2; orientation: string; word: string }, possibility: { word: string; nbPt: number }[]) {
        this.placeLetterService.placeMethodAdapter(object);
        this.debugService.receiveAIDebugPossibilities(possibility);
        //  this.endGameService.playerServiceActions.push('placer par AI');
        setTimeout(() => {
            this.passtourService.writeMessage();
        }, DELAY_TO_PLAY);
    }

    ngOndestroy() {
        this.tourSubscription.unsubscribe();
        // this.passSubscription.unsubscribe();
    }
}
