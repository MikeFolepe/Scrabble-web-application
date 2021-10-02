import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DELAY_TO_PLAY } from '@app/classes/constants';
import { Vec2 } from '@app/classes/vec2';
import { PlayerIA } from '@app/models/player-ia.model';
import { Player } from '@app/models/player.model';
import { PassTurnComponent } from '@app/modules/game-view/components/pass-turn/pass-turn.component';
import { LetterService } from '@app/services/letter.service';
import { PassTurnService } from '@app/services/pass-turn.service';
import { PlayerService } from '@app/services/player.service';
import { TourService } from '@app/services/tour.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-player-ia',
    templateUrl: './player-ia.component.html',
    styleUrls: ['./player-ia.component.scss'],
})
export class PlayerAIComponent implements OnInit {
    @ViewChild(PassTurnComponent) passTurn: PassTurnComponent;
    @Output() iaSkipped = new EventEmitter();
    @Output() iaSwapped = new EventEmitter();
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
        public passTurnService: PassTurnService,
    ) {}

    ngOnInit(): void {
        // Subscribe to get access to IA Player
        this.playerService.playerSubject.subscribe((playersFromSubject: Player[]) => {
            this.iaPlayer = playersFromSubject[1] as PlayerIA;
        });
        this.playerService.emitPlayers();
        // Set the playerIA context so that the player can lunch event
        this.iaPlayer.setContext(this);
        if (!this.tourService.getTour()) {
            setTimeout(() => {
                this.iaPlayer.play();
            }, DELAY_TO_PLAY);
        }
    }

    play() {
        if (!this.tourService.getTour()) {
            setTimeout(() => {
                this.iaPlayer.play();
            }, DELAY_TO_PLAY);
        }
    }

    skip() {
        this.iaSkipped.emit();
        if (!this.tourService.getTour()) {
            setTimeout(() => {
                this.passTurn.toggleTurn();
            }, DELAY_TO_PLAY);
        }
    }

    swap() {
        this.iaSwapped.emit();
        if (!this.tourService.getTour()) {
            setTimeout(() => {
                this.passTurn.toggleTurn();
            }, DELAY_TO_PLAY);
        }
    }

    place(object: { start: Vec2; orientation: string; word: string }, possibility: { word: string; nbPt: number }[]) {
        this.iaPlaced.emit(object);
        this.iaPossibility.emit(possibility);
        setTimeout(() => {
            this.passTurn.toggleTurn();
        }, DELAY_TO_PLAY);
    }
}
