import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DELAY_TO_PLAY, INDEX_PLAYER_IA } from '@app/classes/constants';
import { Vec2 } from '@app/classes/vec2';
import { PlayerIA } from '@app/models/player-ia.model';
// import { Player } from '@app/models/player.model';
import { LetterService } from '@app/services/letter.service';
import { PlayerService } from '@app/services/player.service';
import { SkipTurnService } from '@app/services/skip-turn.service';
// import { TourService } from '@app/services/tour.service';
// import { Subscription } from 'rxjs';

@Component({
    selector: 'app-player-ia',
    templateUrl: './player-ia.component.html',
    styleUrls: ['./player-ia.component.scss'],
})
export class PlayerAIComponent implements OnInit {
    @Output() iaSkipped = new EventEmitter();
    @Output() iaSwapped = new EventEmitter();
    @Output() iaPlaced = new EventEmitter();
    @Output() iaPossibility = new EventEmitter();

    @Input() isPlacementValid: boolean = false;
    @Input() scrabbleBoard: string[][];
    @Input() isFirstRound: boolean;

    message: string;
    // passSubscription: Subscription = new Subscription();
    iaPlayer: PlayerIA;
    // tourSubscription: Subscription = new Subscription();
    tour: boolean;

    constructor(public letterService: LetterService, public playerService: PlayerService, public skipTurn: SkipTurnService) {}

    ngOnInit(): void {
        // Subscribe to get access to IA Player
        this.iaPlayer = this.playerService.players[INDEX_PLAYER_IA] as PlayerIA;

        // Set the playerIA context so that the player can lunch event
        this.iaPlayer.setContext(this);

        if (!this.skipTurn.isTurn) {
            setTimeout(() => {
                this.iaPlayer.play();
            }, DELAY_TO_PLAY);
        }
    }

    // play() {
    //     if (!this.skipTurn.isTurn) {
    //         setTimeout(() => {
    //             this.iaPlayer.play();
    //         }, DELAY_TO_PLAY);
    //     }
    // }

    skip() {
        this.iaSkipped.emit();
        if (!this.skipTurn.isTurn) {
            setTimeout(() => {
                this.skipTurn.switchTurn();
            }, DELAY_TO_PLAY);
        }
    }

    swap() {
        this.iaSwapped.emit();
        if (!this.skipTurn.isTurn) {
            setTimeout(() => {
                this.skipTurn.switchTurn();
            }, DELAY_TO_PLAY);
        }
    }

    place(object: { start: Vec2; orientation: string; word: string }, possibility: { word: string; nbPt: number }[]) {
        this.iaPlaced.emit(object);
        this.iaPossibility.emit(possibility);
        if (!this.skipTurn.isTurn) {
            setTimeout(() => {
                this.skipTurn.switchTurn();
            }, DELAY_TO_PLAY);
        }
    }
}
