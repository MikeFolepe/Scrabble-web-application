/* eslint-disable max-lines */
import { Injectable, OnDestroy } from '@angular/core';
import {
    BOARD_COLUMNS,
    BOARD_ROWS,
    CENTRAL_CASE_POSITION,
    EASEL_SIZE,
    INDEX_INVALID,
    INDEX_PLAYER_AI,
    THREE_SECONDS_DELAY,
} from '@app/classes/constants';
import { ScoreValidation } from '@app/classes/validation-score';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from '@app/services/grid.service';
import { LetterService } from '@app/services/letter.service';
import { PlayerService } from '@app/services/player.service';
import { WordValidationService } from '@app/services/word-validation.service';
import { Subscription } from 'rxjs';
import { SendMessageService } from './send-message.service';
import { PassTourService } from './pass-tour.service';

@Injectable({
    providedIn: 'root',
})
export class PlaceLetterService implements OnDestroy {
    viewSubscription: Subscription = new Subscription();
    message: string;

    scrabbleBoard: string[][]; // 15x15 array
    validLetters: boolean[] = []; // Array of the size of the word to place that tells which letter is valid

    emptyTile: string = '';
    isFirstRound: boolean = true;
    isAIPlacementValid: boolean = false;
    isEaselSize: boolean = false; // If the bonus to form a word with all the letters from the easel applies

    numLettersUsedFromEasel: number = 0; // Number of letters used from the easel to form the word

    constructor(
        private playerService: PlayerService,
        private gridService: GridService,
        private letterService: LetterService,
        private wordValidationService: WordValidationService,
        private sendMessageService: SendMessageService,
        private passTurnService: PassTourService,
    ) {
        this.scrabbleBoard = []; // Initializes the array with empty letters
        for (let i = 0; i < BOARD_ROWS; i++) {
            this.scrabbleBoard[i] = [];
            for (let j = 0; j < BOARD_COLUMNS; j++) {
                this.scrabbleBoard[i][j] = this.emptyTile;
            }
        }
        this.playerService.updateScrabbleBoard(this.scrabbleBoard);
        this.viewSubscription = this.letterService.currentMessage.subscribe((message) => (this.message = message));
    }

    placeMethodAdapter(object: { start: Vec2; orientation: string; word: string }) {
        this.placeCommand(object.start, object.orientation, object.word, INDEX_PLAYER_AI);
    }

    placeCommand(position: Vec2, orientation: string, word: string, indexPlayer = INDEX_PLAYER_AI): boolean {
        const currentPosition: Vec2 = { x: position.x, y: position.y };
        // Remove accents from the word to place
        const wordNoAccents = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        // Reset the array containing the valid letters by making them all valid
        for (let i = 0; i < word.length; i++) {
            this.validLetters[i] = true;
        }
        this.numLettersUsedFromEasel = 0; // Reset the number of letters used from the easel for next placement

        // If the command is possible according to the parameters
        if (!this.isPossible(position, orientation, wordNoAccents, indexPlayer)) {
            this.sendMessageService.displayMessageByType('ERREUR : Le placement est invalide', 'error');
            return false;
        }

        // Placing all letters of the word
        for (let i = 0; i < wordNoAccents.length; i++) {
            if (!this.placeLetter(currentPosition, wordNoAccents[i], orientation, i, indexPlayer)) {
                // If the placement of one letter is invalid, we erase all letters placed
                this.handleInvalidPlacement(position, orientation, wordNoAccents, indexPlayer);
                this.sendMessageService.displayMessageByType('ERREUR : Le placement est invalide', 'error');
                return false;
            }
            this.updatePosition(currentPosition, orientation);
        }
        this.isAIPlacementValid = true;
        if (this.numLettersUsedFromEasel === EASEL_SIZE) this.isEaselSize = true;

        // Validation of the placement
        return this.validatePlacement(position, orientation, wordNoAccents, indexPlayer);
    }

    placeWithKeyboard(position: Vec2, letter: string, orientation: string, indexLetterInWord: number, indexPlayer: number): boolean {
        // If we are placing the first letter of the word
        if (indexLetterInWord === 0) {
            // Reset the array containing the valid letters
            this.validLetters = [];
        }
        // If the letter isn't fitting or isn't in the easel, the placement is invalid
        if (this.playerService.indexLetterInEasel(letter, 0, indexPlayer) === INDEX_INVALID || !this.isWordFitting(position, orientation, letter)) {
            return false;
        }
        return this.placeLetter(position, letter, orientation, indexLetterInWord, indexPlayer);
    }

    placeLetter(position: Vec2, letter: string, orientation: string, indexLetterInWord: number, indexPlayer: number): boolean {
        // If there's already a letter at this position, we verify that it's the same as the one we want to place
        if (this.scrabbleBoard[position.y][position.x] !== '') {
            if (this.scrabbleBoard[position.y][position.x].toLowerCase() !== letter) {
                // If it's not the same, the placement is invalid
                return false;
            }
            return true;
        }
        // If the position is empty, we use a letter from the reserve
        this.scrabbleBoard[position.y][position.x] = letter;
        this.validLetters[indexLetterInWord] = false; // The letter is not yet validated
        this.numLettersUsedFromEasel++;

        if (letter === letter.toUpperCase()) {
            // If we put an upper-case letter (white letter), we remove a '*' from the easel
            this.playerService.removeLetter(this.playerService.indexLetterInEasel('*', 0, indexPlayer), indexPlayer);
        } else {
            // Otherwise we remove the respective letter from the easel
            this.playerService.removeLetter(this.playerService.indexLetterInEasel(letter, 0, indexPlayer), indexPlayer);
        }
        // Display the letter on the scrabble board grid
        this.gridService.drawLetter(this.gridService.gridContextLettersLayer, letter, position.x, position.y, this.playerService.fontSize);
        return true;
    }

    validatePlacement(position: Vec2, orientation: string, word: string, indexPlayer: number): boolean {
        // Validation of the placement
        const finalResult: ScoreValidation = this.wordValidationService.validateAllWordsOnBoard(this.scrabbleBoard, this.isEaselSize);
        if (finalResult.validation) {
            this.handleValidPlacement(finalResult, indexPlayer);
            this.passTurnService.writeMessage();
            return true;
        }
        this.handleInvalidPlacement(position, orientation, word, indexPlayer);
        this.sendMessageService.displayMessageByType('ERREUR : Un ou des mots formés sont invalides', 'error');
        setTimeout(() => {
            this.passTurnService.writeMessage();
        }, THREE_SECONDS_DELAY);
        return false;
    }

    validateKeyboardPlacement(position: Vec2, orientation: string, word: string, indexPlayer: number): boolean {
        // Placing the first word
        if (this.isFirstRound) {
            if (this.isFirstWordValid(position, orientation, word)) {
                return this.validatePlacement(position, orientation, word, indexPlayer);
            }
            this.handleInvalidPlacement(position, orientation, word, indexPlayer);
            this.sendMessageService.displayMessageByType('ERREUR : Le placement est invalide', 'error');
            return false;
        } // Placing the following words
        if (this.isWordTouchingOthers(position, orientation, word)) {
            return this.validatePlacement(position, orientation, word, indexPlayer);
        }
        this.handleInvalidPlacement(position, orientation, word, indexPlayer);
        this.sendMessageService.displayMessageByType('ERREUR : Le placement est invalide', 'error');
        return false;
    }

    handleInvalidPlacement(position: Vec2, orientation: string, word: string, indexPlayer: number): void {
        setTimeout(() => {
            const currentPosition = { x: position.x, y: position.y };
            for (let i = 0; i < this.validLetters.length; i++) {
                if (this.validLetters[i] === undefined) this.validLetters[i] = true;
                // If the word is invalid, we remove only the letters that we just placed on the grid and add them back to the easel.
                if (!this.validLetters[i]) {
                    this.removePlacedLetter(currentPosition, word[i], indexPlayer);
                }
                this.updatePosition(currentPosition, orientation);
            }
        }, THREE_SECONDS_DELAY); // Waiting 3 seconds to erase the letters on the grid
    }

    handleValidPlacement(finalResult: ScoreValidation, indexPlayer: number): void {
        this.playerService.addScore(finalResult.score, indexPlayer);
        this.playerService.updateScrabbleBoard(this.scrabbleBoard);
        this.playerService.refillEasel(indexPlayer); // Fill the easel with new letters from the reserve
        this.letterService.writeMessage('mise a jour');
        this.isFirstRound = false;
    }

    removePlacedLetter(position: Vec2, letter: string, indexPlayer: number) {
        this.scrabbleBoard[position.y][position.x] = '';
        this.gridService.eraseLetter(this.gridService.gridContextLettersLayer, position.x, position.y);
        this.playerService.addLetterToEasel(letter, indexPlayer);
    }

    isPossible(position: Vec2, orientation: string, word: string, indexPlayer: number): boolean {
        let isPossible = false;
        // 1st Round
        if (this.isFirstRound) {
            // If the word is fitting inside the scrabble board
            if (this.isWordFitting(position, orientation, word)) {
                isPossible =
                    this.isFirstWordValid(position, orientation, word) && // If the 1st word is placed onto the central position
                    this.isWordValid(position, orientation, word, indexPlayer); // If the letters of the word are in the easel or the scrabble board
            }
        }
        // The following rounds
        else {
            if (this.isWordFitting(position, orientation, word)) {
                isPossible =
                    this.isWordValid(position, orientation, word, indexPlayer) && // If the letters of the word are in the easel or the scrabble board
                    this.isWordTouchingOthers(position, orientation, word); // If the word is in contact with other letters on the board
            }
        }
        return isPossible;
    }

    isWordFitting(position: Vec2, orientation: string, word: string): boolean {
        if (orientation === 'h' && position.x + word.length > BOARD_ROWS) {
            return false;
        } else if (orientation === 'v' && position.y + word.length > BOARD_COLUMNS) {
            return false;
        }
        return true;
    }

    isWordValid(position: Vec2, orientation: string, word: string, indexPlayer: number): boolean {
        let isLetterExisting = false;
        const indexLetters: number[] = []; // Array containing indexes of the easel that are used by the word we want to place.
        const currentPosition = { x: position.x, y: position.y };

        for (const letter of word) {
            isLetterExisting = this.isLetterOnBoard(currentPosition, orientation, letter);
            this.updatePosition(currentPosition, orientation);

            // If the letter isn't on the board, we look into the easel
            if (!isLetterExisting) {
                isLetterExisting = this.isLetterInEasel(letter, indexPlayer, indexLetters);
                // If the letter isn't on the board or present in the easel, we can't place the word
                if (!isLetterExisting) return false;
            }
        }
        return true;
    }

    isLetterOnBoard(position: Vec2, orientation: string, letter: string): boolean {
        let isLetterExisting = false; // Reset to false so we can search the next letter properly
        // Search the letter on the board
        if (orientation === 'h') {
            if (letter.toUpperCase() === this.scrabbleBoard[position.y][position.x].toUpperCase()) {
                isLetterExisting = true;
            }
        } else if (orientation === 'v') {
            if (letter.toUpperCase() === this.scrabbleBoard[position.y][position.x].toUpperCase()) {
                isLetterExisting = true;
            }
        }
        return isLetterExisting;
    }

    isLetterInEasel(letter: string, indexPlayer: number, indexLetters: number[]): boolean {
        let isLetterExisting = false;
        let currentLetterIndex = this.playerService.indexLetterInEasel(letter, 0, indexPlayer);

        if (currentLetterIndex !== INDEX_INVALID) {
            isLetterExisting = true;
        }
        for (const index of indexLetters) {
            while (currentLetterIndex === index) {
                currentLetterIndex = this.playerService.indexLetterInEasel(letter, currentLetterIndex + 1, indexPlayer);
                if (currentLetterIndex === INDEX_INVALID) {
                    isLetterExisting = false;
                }
            }
        }
        if (isLetterExisting) {
            // If the letter exists in the easel
            indexLetters.push(currentLetterIndex); // We push the index so we know it is used
        }
        return isLetterExisting;
    }

    isFirstWordValid(position: Vec2, orientation: string, word: string): boolean {
        const currentPosition = { x: position.x, y: position.y };
        // Disable 'elint prefer-for-of' for this loop because we're not using the variable 'word' inside the loop
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < word.length; i++) {
            // If one letter of the word is placed on the central case (H8)
            if (currentPosition.x === CENTRAL_CASE_POSITION && currentPosition.y === CENTRAL_CASE_POSITION) {
                return true;
            }
            this.updatePosition(currentPosition, orientation);
        }
        return false;
    }

    isWordTouchingOthers(position: Vec2, orientation: string, word: string): boolean {
        let isWordTouching = false;
        const currentPosition = { x: position.x, y: position.y };
        let x = 0;
        let y = 0;
        if (orientation === 'h') {
            x = 1;
        } else if (orientation === 'v') {
            y = 1;
        }

        // Search each position around the word that are in bounds of the board
        for (let i = 0; i < word.length; i++) {
            if (this.isPositionFilled({ x: currentPosition.x + y, y: currentPosition.y + x })) {
                isWordTouching = true;
            }
            if (this.isPositionFilled({ x: currentPosition.x - y, y: currentPosition.y - x })) {
                isWordTouching = true;
            }
            if (this.isPositionFilled({ x: currentPosition.x + x, y: currentPosition.y + y })) {
                isWordTouching = true;
            }
            if (this.isPositionFilled({ x: currentPosition.x - x, y: currentPosition.y - y })) {
                if (this.validLetters[i + 1]) {
                    isWordTouching = true;
                }
            }
            this.updatePosition(currentPosition, orientation);
        }
        return isWordTouching;
    }

    isPositionFilled(position: Vec2): boolean {
        if (this.isPositionInBounds(position.x) && this.isPositionInBounds(position.y)) {
            return this.scrabbleBoard[position.y][position.x] !== '';
        }
        return false;
    }

    isPositionInBounds(position: number): boolean {
        if (position >= 0 && position < BOARD_ROWS) {
            // Position in between [0-14]
            return true;
        }
        return false;
    }

    updatePosition(position: Vec2, orientation: string) {
        if (orientation === 'h') {
            position.x++;
        } else {
            position.y++;
        }
    }

    ngOnDestroy() {
        this.viewSubscription.unsubscribe();
    }
}
