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

    private myFunc: () => void;

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

    updateLettersEasel(fn: () => void) {
        this.myFunc = fn;
        // from now on, call myFunc wherever you want inside this service
    }

    getLettersEasel(indexPlayer: number): Letter[] {
        return this.players[indexPlayer].letterTable;
    }

    getPlayers(): Player[] {
        return this.players;
    }

    removeLetter(letterToRemove: string, indexPlayer: number): void {
        // Remove one letter from easel

        for (let i = 0; i < this.players[indexPlayer].letterTable.length; i++) {
            if (this.players[indexPlayer].letterTable[i].value === letterToRemove.toUpperCase()) {
                this.players[indexPlayer].letterTable.splice(i, 1);
                this.myFunc();
                break;
            }
        }
    }

    refillEasel(indexPlayer: number): void {
        let letterToInsert: Letter;
        for (let i = this.players[indexPlayer].letterTable.length; i < EASEL_SIZE; i++) {
            letterToInsert = this.letterService.getRandomLetter();
            if (letterToInsert.value === '') {
                break;
            }
            this.players[indexPlayer].letterTable[i] = letterToInsert;
        }
        this.myFunc();
    }

    swap(letter: string, indexPlayer: number): void {
        this.removeLetter(letter, indexPlayer);
        this.letterService.addLetterToReserve(letter);
        this.refillEasel(indexPlayer);
    }

    easelContainsLetter(letter: string, indexPlayer: number): boolean {
        for (const letterEasel of this.players[indexPlayer].letterTable) {
            if (letter.toUpperCase() === letterEasel.value) {
                return true;
            }
        }
        return false;
    }
}
