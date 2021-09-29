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

    updateLettersEasel(fn: () => void) {
        this.myFunc = fn;
        // from now on, call myFunc wherever you want inside this service
    }
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

    getLettersEasel(): Letter[] {
        return this.players[0].letterTable;
    }

    // Service pour cheker le chevalier du IA
    getLettersEaselIA(): Letter[] {
        return this.players[1].letterTable;
    }

    getPlayers(): Player[] {
        return this.players;
    }

    removeLetter(letterToRemove: string): void {
        // Remove one letter from easel

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

    swap(letter: string): void {
        this.removeLetter(letter);
        this.letterService.addLetterToReserve(letter);
        this.refillEasel();
    }

    easelContainsLetter(letter: string): boolean {
        for (const letterEasel of this.players[0].letterTable) {
            if (letter.toUpperCase() === letterEasel.value) {
                return true;
            }
        }
        return false;
    }
}
