import { Injectable } from '@angular/core';
import {
    BOARD_COLUMNS,
    BOARD_ROWS,
    CASE_SIZE,
    DEFAULT_HEIGHT,
    DEFAULT_WIDTH,
    EASEL_SIZE,
    DEFAULT_FONT_SIZE,
    FONT_SIZE_MAX,
    FONT_SIZE_MIN,
} from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { Player } from '@app/models/player.model';
import { Subject } from 'rxjs';
import { GridService } from './grid.service';
import { LetterService } from './letter.service';

@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    playerSubject = new Subject<Player[]>();
    scrabbleBoard: string[][];
    fontSize = DEFAULT_FONT_SIZE;

    private players: Player[] = new Array<Player>();
    private myFunc: () => void;
    constructor(private letterService: LetterService, private gridService: GridService) {
        this.fontSize = DEFAULT_FONT_SIZE * 2;
    }

    updateLettersEasel(fn: () => void) {
        this.myFunc = fn;
        // from now on, call myFunc wherever you want inside this service
    }

    emitPlayers(): void {
        this.playerSubject.next(this.players.slice());
    }

    addPlayer(user: Player) {
        this.players.push(user);
        this.emitPlayers();
    }

    clearPlayers(): void {
        this.players = [];
    }

    updateScrabbleBoard(scrabbleBoard: string[][]): void {
        this.scrabbleBoard = scrabbleBoard;
    }

    updateFontSize(fontSize: number): void {
        if (fontSize < FONT_SIZE_MIN) {
            fontSize = FONT_SIZE_MIN;
        } else if (fontSize > FONT_SIZE_MAX) {
            fontSize = FONT_SIZE_MAX;
        }
        this.fontSize = fontSize * 2;
        this.updateGridFontSize();
    }

    getLettersEasel(indexPlayer: number): Letter[] {
        return this.players[indexPlayer].letterTable;
    }

    getPlayers(): Player[] {
        return this.players;
    }

    // Update the font size of the letters placed on the grid
    updateGridFontSize(): void {
        for (let i = 0; i < BOARD_ROWS; i++) {
            for (let j = 0; j < BOARD_COLUMNS; j++) {
                if (this.scrabbleBoard[i][j] !== '') {
                    const positionGrid = this.posTabToPosGrid(j, i);
                    this.gridService.eraseLetter(this.gridService.gridContext, positionGrid);
                    this.gridService.drawLetter(this.gridService.gridContext, this.scrabbleBoard[i][j], positionGrid, this.fontSize);
                }
            }
        }
    }

    // Remove one letter from easel
    removeLetter(letterToRemove: string, indexPlayer: number): void {
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

    // Transpose the positions from 15x15 array to 750x750 grid
    posTabToPosGrid(positionTabX: number, positionTabY: number): Vec2 {
        return {
            x: positionTabX * CASE_SIZE + CASE_SIZE - DEFAULT_WIDTH / 2,
            y: positionTabY * CASE_SIZE + CASE_SIZE - DEFAULT_HEIGHT / 2,
        };
    }
}
