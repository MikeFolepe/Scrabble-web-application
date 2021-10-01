import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { PlayerIA } from '@app/models/player-ia.model';
import { Player } from '@app/models/player.model';
import { LetterService } from '@app/services/letter.service';
// eslint-disable-next-line import/no-deprecated
import { PlayerService } from '@app/services/player.service';
import { TourService } from '@app/services/tour.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-player-ia',
    templateUrl: './player-ia.component.html',
    styleUrls: ['./player-ia.component.scss'],
})
export class PlayerIAComponent implements OnInit {
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

    iaPlayer: PlayerIA;
    tourSubscription: Subscription = new Subscription();
    tour: boolean;
    constructor(public letterService: LetterService, public playerService: PlayerService, public tourService: TourService) {}

    ngOnInit(): void {
        // Subscribe to get access to IA Player
        this.playerService.playerSubject.subscribe((playersFromSubject: Player[]) => {
            // Downcasting forcé par Mike
            this.iaPlayer = playersFromSubject[1] as PlayerIA;
        });
        this.playerService.emitPlayers();
        // Set the playerIA context so that the player can lunch event
        this.iaPlayer.setContext(this);

        this.tourSubscription = this.tourService.tourSubject.subscribe((tourSubject: boolean) => {
            this.tour = tourSubject;
        });

        if (this.tour === false) {
            this.play();
        }
    }

    play() {
        this.iaPlayer.play();
    }

    skip() {
        this.iaSkipped.emit();
    }

    swap() {
        this.iaSwapped.emit();
    }

    place(object: { start: Vec2; orientation: string; word: string }, possibility: { word: string; nbPt: number }[]) {
        this.iaPlaced.emit(object);
        this.iaPossibility.emit(possibility);
    }

    ngOndestroy() {
        this.tourSubscription.unsubscribe();
    }
}
