import { Injectable } from '@angular/core';
import { EASEL_SIZE } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { Player } from '@app/models/player.model';
import { Subject } from 'rxjs';
import { LetterService } from './letter.service';


@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    playerSubject = new Subject<Player[]>();
    private players: Player[] = new Array<Player>();

    constructor(private letterService: LetterService) {}

    emitPlayers() {
        this.playerSubject.next(this.players.slice());
    }

    addPlayer(user: Player) {
        this.players.push(user);
        this.emitPlayers();
    }

    clearPlayers() {
        this.players = [];
    }

    private myFunc: () => void;
    updateLettersEasel(fn: () => void) {
        this.myFunc = fn;
        // from now on, call myFunc wherever you want inside this service
    }

    getLettersEasel(): Array<Letter> {
        return this.players[0].letterTable;
    }

    removeLetter(letterToRemove: string): void {   // Remove one letter from easel

        for (let i = 0; i < this.players[0].letterTable.length; i++) {
            if (this.players[0].letterTable[i].value === letterToRemove.toUpperCase()) {
                this.players[0].letterTable.splice(i, 1);
                this.myFunc();
                break;
            }
        }
    }

    refillEasel(): void {
        let letterToInsert: Letter;
        for (let i = this.players[0].letterTable.length; i < EASEL_SIZE; i++) {
            letterToInsert = this.letterService.getRandomLetter();
            if (letterToInsert.value === '') {
                break;
            }
            this.players[0].letterTable[i] = letterToInsert;
        }
        this.myFunc();
    }
}
