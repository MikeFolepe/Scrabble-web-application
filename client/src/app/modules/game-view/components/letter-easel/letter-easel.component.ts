
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DEFAULT_FONT_SIZE, EASEL_SIZE } from '@app/classes/constants';
import { StartingPlayer } from '@app/classes/game-settings';
import { Letter } from '@app/classes/letter';
import { Player } from '@app/models/player.model';
import { LetterService } from '@app/services/letter.service';
import { PlayerService } from '@app/services/player.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-letter-easel',
    templateUrl: './letter-easel.component.html',
    styleUrls: ['./letter-easel.component.scss'],
})
export class LetterEaselComponent implements OnInit, OnDestroy {
    letterEaselTab: Letter[] = [];
    players: Player[] = new Array<Player>();
    playerSubscription: Subscription = new Subscription();

    fontSize: number = DEFAULT_FONT_SIZE;
    constructor(private playerService: PlayerService, private letterService: LetterService) {}

    ngOnInit(): void {
        this.initializeTab();
    }

    initializeTab(): void {
        this.playerSubscription = this.playerService.playerSubject.subscribe((playersFromSubject: Player[]) => {
            this.players = playersFromSubject;
        });
        this.playerService.emitPlayers();

        for (let i = 0; i < EASEL_SIZE; i++) {
            this.letterEaselTab[i] = {
                value: this.players[StartingPlayer.Player1].letterTable[i].value,
                quantity: this.players[StartingPlayer.Player1].letterTable[i].quantity,
                points: this.players[StartingPlayer.Player1].letterTable[i].points,
            };
        }
    }

    removeLetter(letterToRemove: string): void {   // Enlève une lettre du chevalet

        for (let i = 0; i < this.letterEaselTab.length; i++) {
            if (this.letterEaselTab[i].value === letterToRemove.toUpperCase()) {
                this.letterEaselTab.splice(i, 1);
                break;
            }
        }
    }

    refillEasle(): void {
        let letterToInsert: Letter;
        for (let i = this.letterEaselTab.length; i < EASEL_SIZE; i++) {
            letterToInsert = this.letterService.getRandomLetter();
            if (letterToInsert.value === '') {
                break;
            }
            this.letterEaselTab[i] = letterToInsert;
        }
    }

    ngOnDestroy() {
        this.playerSubscription.unsubscribe();
    }
}
