import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlayerIA } from '@app/models/player-ia.model';
import { Player } from '@app/models/player.model';
import { LetterService } from '@app/services/letter.service';
import { PlayerService } from '@app/services/player.service';

@Component({
    selector: 'app-player-ia',
    templateUrl: './player-ia.component.html',
    styleUrls: ['./player-ia.component.scss'],
})
export class PlayerIAComponent implements OnInit {
    // Pour dire à la boite que j'ai passé mon tour.
    @Output() iaSkipped: EventEmitter<string> = new EventEmitter();
    // Pour dire à la boite que j'ai echanger des lettres ( je sais pas si c'est une information
    // requise dans le flux de la BC ??).
    @Output() iaSwapped: EventEmitter<string> = new EventEmitter();
    // Pour dire à la boite que j'ai placer des lettres.
    @Output() iaPlaced: EventEmitter<string> = new EventEmitter();

    @Input() isPlacementValid: boolean = false;

    iaPlayer: PlayerIA;

    constructor(public letterService: LetterService, public playerService: PlayerService) {}

    ngOnInit(): void {
        // Subscribe to get access to IA Player
        this.playerService.playerSubject.subscribe((playersFromSubject: Player[]) => {
            // Downcasting forcé par Mike
            this.iaPlayer = playersFromSubject[1] as PlayerIA;
        });
        this.playerService.emitPlayers();
        // Set the playerIA context so that the player can lunch event
        this.iaPlayer.setContext(this);
    }

    skip() {
        this.iaSkipped.emit('!passer');
    }

    swap() {
        this.iaSwapped.emit('!echanger<>');
    }
}
