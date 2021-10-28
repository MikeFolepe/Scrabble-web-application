import { Injectable } from '@angular/core';
import {
    BOARD_COLUMNS,
    BOARD_ROWS,
    CASE_SIZE,
    DEFAULT_FONT_SIZE,
    DEFAULT_HEIGHT,
    DEFAULT_WIDTH,
    EASEL_SIZE,
    FONT_SIZE_MAX,
    FONT_SIZE_MIN,
    INDEX_INVALID,
    RESERVE,
} from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { Player } from '@app/models/player.model';
import { GridService } from './grid.service';
import { LetterService } from './letter.service';

@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    scrabbleBoard: string[][];
    fontSize = DEFAULT_FONT_SIZE;
    players: Player[] = new Array<Player>();
    constructor(private letterService: LetterService, private gridService: GridService) {
        this.fontSize = DEFAULT_FONT_SIZE;
    }

    addPlayer(user: Player) {
        this.players.push(user);
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
        this.fontSize = fontSize;
        this.updateGridFontSize();
    }

    // Update the font size of the letters placed on the grid
    updateGridFontSize(): void {
        for (let i = 0; i < BOARD_ROWS; i++) {
            for (let j = 0; j < BOARD_COLUMNS; j++) {
                if (this.scrabbleBoard[i][j] !== '') {
                    const positionGrid = this.convertSizeFormat(j, i);
                    this.gridService.eraseLetter(this.gridService.gridContextLayer, positionGrid);
                    this.gridService.drawLetter(this.gridService.gridContextLayer, this.scrabbleBoard[i][j], positionGrid, this.fontSize);
                }
            }
        }
    }

    // Remove one letter from easel
    removeLetter(letterToRemove: string, indexPlayer: number): void {
        for (let i = 0; i < this.players[indexPlayer].letterTable.length; i++) {
            if (this.players[indexPlayer].letterTable[i].value === letterToRemove.toUpperCase()) {
                this.players[indexPlayer].letterTable.splice(i, 1);
                break;
            }
        }
    }

    addLetterToEasel(letterToAdd: string, indexPlayer: number): void {
        for (const letter of RESERVE) {
            if (letterToAdd.toUpperCase() === letter.value) {
                this.players[indexPlayer].letterTable.push(letter);
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
    }

    swap(letter: string, indexPlayer: number): void {
        this.removeLetter(letter, indexPlayer);
        this.letterService.addLetterToReserve(letter);
        this.refillEasel(indexPlayer);
    }

    easelContainsLetter(letter: string, startIndex: number, indexPlayer: number): number {
        for (let i = startIndex; i < this.players[indexPlayer].letterTable.length; i++) {
            if (letter === this.players[indexPlayer].letterTable[i].value.toLowerCase()) {
                return i;
            } else if (letter === letter.toUpperCase()) {
                // White letter
                if (this.players[indexPlayer].letterTable[i].value === '*') {
                    return i;
                }
            }
        }
        return INDEX_INVALID;
    }

    addScore(score: number, indexPlayer: number): void {
        this.players[indexPlayer].score += score;
    }

    // Convert the positions from 15x15 array to 750x750 grid
    convertSizeFormat(positionTabX: number, positionTabY: number): Vec2 {
        return {
            x: positionTabX * CASE_SIZE + CASE_SIZE - DEFAULT_WIDTH / 2,
            y: positionTabY * CASE_SIZE + CASE_SIZE - DEFAULT_HEIGHT / 2,
        };
    }

    getScore(indexPlayer: number): number {
        return this.players[indexPlayer].score;
    }
}
