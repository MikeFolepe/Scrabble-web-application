/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
    BOARD_COLUMNS,
    BOARD_ROWS,
    CENTRAL_CASE_POSX,
    CENTRAL_CASE_POSY,
    EASEL_SIZE,
    INDEX_INVALID,
    INDEX_PLAYER_IA,
    THREE_SECONDS_DELAY,
} from '@app/classes/constants';
import { ScoreValidation } from '@app/classes/validation-score';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from '@app/services/grid.service';
import { LetterService } from '@app/services/letter.service';
import { PlayerService } from '@app/services/player.service';
import { Subscription } from 'rxjs';
// eslint-disable-next-line no-restricted-imports
import { WordValidationComponent } from '../word-validation/word-validation.component';

@Component({
    selector: 'app-place-letter',
    templateUrl: './place-letter.component.html',
    styleUrls: ['./place-letter.component.scss'],
})
export class PlaceLetterComponent implements OnInit, OnDestroy {
    @ViewChild(WordValidationComponent) wordValidator: WordValidationComponent;
    viewSubscription: Subscription = new Subscription();

    scrabbleBoard: string[][]; // 15x15 array
    invalidLetters: boolean[] = []; // Array of the size of the word to place that tells which letter is invalid

    letterEmpty: string = '';
    isFirstRound: boolean = true;
    isIAPlacementValid: boolean = false;
    message: string;

    constructor(private playerService: PlayerService, private gridService: GridService, private letterService: LetterService) {
        this.scrabbleBoard = []; // Initializes the array with empty letters
        for (let i = 0; i < BOARD_ROWS; i++) {
            this.scrabbleBoard[i] = [];
            for (let j = 0; j < BOARD_COLUMNS; j++) {
                this.scrabbleBoard[i][j] = this.letterEmpty;
            }
        }
    }

    ngOnInit(): void {
        this.playerService.updateScrabbleBoard(this.scrabbleBoard);
        this.viewSubscription = this.letterService.currentMessage.subscribe((message) => (this.message = message));
    }

    placeMethodAdapter(object: { start: Vec2; orientation: string; word: string }) {
        this.place(object.start, object.orientation, object.word, INDEX_PLAYER_IA);
    }

    place(position: Vec2, orientation: string, word: string, indexPlayer = INDEX_PLAYER_IA): boolean {
        // Remove accents from the word to place
        const wordNoAccents = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        // If the command is possible according to the parameters
        if (!this.isPossible(position, orientation, wordNoAccents, indexPlayer)) {
            return false;
        }
        let isEaselSize = false;
        if (word.length === EASEL_SIZE) {
            isEaselSize = true;
        }
        const isRow = false;
        this.invalidLetters = []; // Reset the array containing the invalid letters

        // Placing all letters of the word
        if (!this.placeAllLetters(position, orientation, wordNoAccents, indexPlayer)) {
            this.placementIsInvalid(position, orientation, wordNoAccents, indexPlayer);
            return false;
        }
        this.isIAPlacementValid = true;

        // Validation of the placement
        const finalResult: ScoreValidation = this.wordValidator.validateAllWordsOnBoard(this.scrabbleBoard, isEaselSize, isRow);
        if (finalResult.validation === false) {
            this.placementIsInvalid(position, orientation, wordNoAccents, indexPlayer);
            return false;
        } else {
            this.placementIsValid(finalResult, indexPlayer);
            return true;
        }
    }

    placeAllLetters(position: Vec2, orientation: string, word: string, indexPlayer: number): boolean {
        let areAllLettersValid = true;
        for (let i = 0; i < word.length; i++) {
            // Adds the letter to the respective position of the array based on the orientation
            let x = 0;
            let y = 0;
            if (orientation === 'v') {
                x = i;
            } else if (orientation === 'h') {
                y = i;
            }
            this.invalidLetters[i] = false;

            // If the position is empty, we use a letter from the reserve
            if (this.scrabbleBoard[position.x + x][position.y + y] === '') {
                this.scrabbleBoard[position.x + x][position.y + y] = word[i];
                this.invalidLetters[i] = true;
                if (word[i] === word[i].toUpperCase()) {
                    // If we put a capital letter (white letter), we remove a '*' from the easel
                    this.playerService.removeLetter('*', indexPlayer);
                } else {
                    // Otherwise we remove the respective letter from the easel
                    this.playerService.removeLetter(word[i], indexPlayer);
                }
                // Display the letter on the scrabble board grid
                const positionGrid = this.playerService.posTabToPosGrid(position.y + y, position.x + x);
                this.gridService.drawLetter(this.gridService.gridContextLayer, word[i], positionGrid, this.playerService.fontSize);
            }
            // If there's already a letter at this position, we verify that it's the same as the one we want to place
            else {
                if (this.scrabbleBoard[position.x + x][position.y + y] !== word[i]) {
                    // If it's not the same, the placement is invalid
                    areAllLettersValid = false;
                }
            }
        }
        return areAllLettersValid;
    }

    placementIsInvalid(position: Vec2, orientation: string, word: string, indexPlayer: number): void {
        setTimeout(() => {
            for (let i = 0; i < this.invalidLetters.length; i++) {
                let x = 0;
                let y = 0;
                if (orientation === 'v') {
                    x = i;
                } else if (orientation === 'h') {
                    y = i;
                }
                // If the word is invalid, we remove only the letters that we just placed on the grid
                // and add them back to the easel.
                if (this.invalidLetters[i]) {
                    this.scrabbleBoard[position.x + x][position.y + y] = '';
                    const positionGrid = this.playerService.posTabToPosGrid(position.y + y, position.x + x);
                    this.gridService.eraseLetter(this.gridService.gridContextLayer, positionGrid);
                    this.playerService.addLetterToEasel(word[i], indexPlayer);
                }
            }
        }, THREE_SECONDS_DELAY); // Waiting 3 seconds to erase the letters on the grid
    }

    placementIsValid(finalResult: ScoreValidation, indexPlayer: number): void {
        this.playerService.addScore(finalResult.score, indexPlayer);
        this.playerService.updateScrabbleBoard(this.scrabbleBoard);
        this.playerService.refillEasel(indexPlayer); // Fill the easel with new letters from the reserve
        this.letterService.writeMessage('mise a jour');
        this.isFirstRound = false;
    }

    isPossible(position: Vec2, orientation: string, word: string, indexPlayer: number): boolean {
        let isPossible = false;

        // 1st Round
        if (this.isFirstRound) {
            isPossible =
                this.isFirstWordValid(position, orientation, word) && // If the 1st word is placed onto the central position
                this.isWordValid(position, orientation, word, indexPlayer) && // If the letters of the word are in the easel or the scrabble board
                this.isWordFitting(position, orientation, word); // If the word is fitting inside the scrabble board
        }
        // The following rounds
        else {
            isPossible =
                this.isWordValid(position, orientation, word, indexPlayer) &&
                this.isWordFitting(position, orientation, word) &&
                this.isWordTouchingOthers(position, orientation, word); // If the word is in contact with other letters on the board
        }

        return isPossible;
    }

    isWordFitting(position: Vec2, orientation: string, word: string): boolean {
        if (orientation === 'v') {
            if (position.x + word.length > BOARD_ROWS) {
                // Out of bounds on x axis
                return false;
            }
        } else if (orientation === 'h') {
            if (position.y + word.length > BOARD_COLUMNS) {
                // Out of bounds on y axis
                return false;
            }
        }
        return true;
    }

    isWordValid(position: Vec2, orientation: string, word: string, indexPlayer: number): boolean {
        let isLetterExisting = false;
        const indexLetters: number[] = []; // Array containing indexes of the easel that are used by the word we want to place.
        let currentLetterIndex = 0;

        for (let i = 0; i < word.length; i++) {
            isLetterExisting = false; // Reset to false so we can search the next letter properly
            // Search the letter on the board
            if (orientation === 'v') {
                if (word[i].toUpperCase() === this.scrabbleBoard[position.x + i][position.y].toUpperCase()) {
                    isLetterExisting = true;
                }
            } else if (orientation === 'h') {
                if (word[i].toUpperCase() === this.scrabbleBoard[position.x][position.y + i].toUpperCase()) {
                    isLetterExisting = true;
                }
            }
            // If the letter isn't on the board, we look into the easel
            if (!isLetterExisting) {
                currentLetterIndex = this.playerService.easelContainsLetter(word[i], 0, indexPlayer);
                if (currentLetterIndex !== INDEX_INVALID) {
                    isLetterExisting = true;
                }
                for (const index of indexLetters) {
                    while (currentLetterIndex === index) {
                        currentLetterIndex = this.playerService.easelContainsLetter(word[i], currentLetterIndex + 1, indexPlayer);
                        if (currentLetterIndex === INDEX_INVALID) {
                            isLetterExisting = false;
                        }
                    }
                }
                if (isLetterExisting) {
                    // If the letter exists in the easel
                    indexLetters.push(currentLetterIndex); // We push the index so we know it is used
                } else {
                    // If the letter isn't on the board or present in the easel, we can't place the word
                    return false;
                }
            }
        }
        return true;
    }

    isFirstWordValid(position: Vec2, orientation: string, word: string): boolean {
        // If one letter of the word is placed on the central case (H8)
        if (orientation === 'v') {
            for (let i = 0; i < word.length; i++) {
                if (position.x + i === CENTRAL_CASE_POSX && position.y === CENTRAL_CASE_POSY) {
                    return true;
                }
            }
        }
        if (orientation === 'h') {
            for (let i = 0; i < word.length; i++) {
                if (position.x === CENTRAL_CASE_POSX && position.y + i === CENTRAL_CASE_POSY) {
                    return true;
                }
            }
        }
        return false;
    }

    isWordTouchingOthers(position: Vec2, orientation: string, word: string): boolean {
        let isWordTouching = false;

        for (let i = 0; i < word.length; i++) {
            let x = 0;
            let y = 0;
            if (orientation === 'v') {
                x = i;
            } else if (orientation === 'h') {
                y = i;
            }
            // Search each position around the word that are in bounds of the board
            if (this.isPosInBounds(position.x + x + 1)) {
                if (this.scrabbleBoard[position.x + x + 1][position.y + y] !== '') isWordTouching = true;
            }
            if (this.isPosInBounds(position.x + x - 1)) {
                if (this.scrabbleBoard[position.x + x - 1][position.y + y] !== '') isWordTouching = true;
            }
            if (this.isPosInBounds(position.y + y + 1)) {
                if (this.scrabbleBoard[position.x + x][position.y + y + 1]) isWordTouching = true;
            }
            if (this.isPosInBounds(position.y + y - 1)) {
                if (this.scrabbleBoard[position.x + x][position.y + y - 1]) isWordTouching = true;
            }
        }
        return isWordTouching;
    }

    isPosInBounds(position: number): boolean {
        if (position >= 0 && position < BOARD_ROWS) {
            // Position in between [0-14]
            return true;
        }
        return false;
    }

    ngOnDestroy() {
        this.viewSubscription.unsubscribe();
    }
}
