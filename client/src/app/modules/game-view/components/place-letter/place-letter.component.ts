/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BOARD_COLUMNS, BOARD_ROWS, CENTRAL_CASE_POSX, CENTRAL_CASE_POSY, EASEL_SIZE } from '@app/classes/constants';
import { ScoreValidation } from '@app/classes/validation-score';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from '@app/services/grid.service';
import { LetterService } from '@app/services/letter.service';
import { PlayerService } from '@app/services/player.service';
import { TourService } from '@app/services/tour.service';
import { Subscription } from 'rxjs';
import { WordValidationComponent } from '../word-validation/word-validation.component';

@Component({
    selector: 'app-place-letter',
    templateUrl: './place-letter.component.html',
    styleUrls: ['./place-letter.component.scss'],
})
export class PlaceLetterComponent implements OnInit, OnDestroy {
    @ViewChild(WordValidationComponent) wordValidator: WordValidationComponent;
    tour: boolean;
    tourSubscription: Subscription = new Subscription();
    viewSubscription: Subscription = new Subscription();

    scrabbleBoard: string[][]; // 15x15 array

    letterEmpty: string = '';
    isFirstRound: boolean = true;
    isIAPlacementValid: boolean = false;
    message: string;

    constructor(
        private playerService: PlayerService,
        private gridService: GridService,
        private tourService: TourService,
        private letterService: LetterService,
    ) {
        this.scrabbleBoard = []; // Initializes the array with empty letters
        for (let i = 0; i < BOARD_ROWS; i++) {
            this.scrabbleBoard[i] = [];
            for (let j = 0; j < BOARD_COLUMNS; j++) {
                this.scrabbleBoard[i][j] = this.letterEmpty;
            }
        }
    }

    ngOnInit(): void {
        this.initializeTour();
        this.playerService.updateScrabbleBoard(this.scrabbleBoard);
        this.viewSubscription = this.letterService.currentMessage.subscribe((message) => (this.message = message));
    }

    initializeTour(): void {
        this.tourSubscription = this.tourService.tourSubject.subscribe((tourSubject: boolean) => {
            this.tour = tourSubject;
        });
        this.tourService.emitTour();
    }

    placeMethodAdapter(object: { start: Vec2; orientation: string; word: string; indexPlayer: number }) {
        this.place(object.start, object.orientation, object.word, object.indexPlayer);
    }

    place(position: Vec2, orientation: string, word: string, indexPlayer: number): boolean {
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
        console.log(this.gridService.gridContext);
        console.log('placing retourne true');
        for (let i = 0; i < word.length; i++) {
            // Adds the letter to the respective position of the array based on the orientation
            let x = 0;
            let y = 0;
            if (orientation === 'v') {
                x = i;
            } else if (orientation === 'h') {
                y = i;
            }

            // If the position is empty, we use a letter from the reserve
            if (this.scrabbleBoard[position.x + x][position.y + y] === '') {
                this.scrabbleBoard[position.x + x][position.y + y] = wordNoAccents.charAt(i);

                // Display the letter on the scrabble board grid
                const positionGrid = this.playerService.posTabToPosGrid(position.y + y, position.x + x);
                this.gridService.drawLetter(this.gridService.gridContext, wordNoAccents.charAt(i), positionGrid, this.playerService.fontSize);
            }
        }
        console.log(this.scrabbleBoard);

        this.isIAPlacementValid = true;
        console.log('IA placement is valid' + this.isIAPlacementValid);
        // TODO Valider le mot sur le scrabbleboard

        // INVALID
        /*
        setTimeout(() => {
            for (let i = 0; i < word.length; i++) {
                let x = 0;
                let y = 0;
                if (orientation === 'v') {
                    x = i;
                } else if (orientation === 'h') {
                    y = i;
                }
                // If the word is invalid, we remove the letters placed on the grid
                this.scrabbleBoard[position.x + x][position.y + y] = '';
                const positionGrid = this.posTabToPosGrid(position.y + y, position.x + x);
                this.gridService.eraseLetter(this.gridService.gridContext, positionGrid);
            }
            return false;
        }, 3000); // Waiting 3 seconds to erase the letters on the grid
        */
        // VALID
        for (let i = 0; i < word.length; i++) {
            if (wordNoAccents.charAt(i) === wordNoAccents.charAt(i).toUpperCase()) {
                // If we put a capital letter (white letter), we remove a '*' from the easel
                this.playerService.removeLetter('*', indexPlayer);
            } else {
                // Otherwise we remove the respective letter from the easel
                this.playerService.removeLetter(wordNoAccents.charAt(i), indexPlayer);
            }
        }
        const finalResult: ScoreValidation = this.wordValidator.validateAllWordsOnBoard(this.scrabbleBoard, isEaselSize);
        this.isFirstRound = false;
        if (finalResult.validation === false) {
            return false;
        } else {
            this.playerService.addScore(finalResult.score, indexPlayer);
            this.playerService.updateScrabbleBoard(this.scrabbleBoard);
            this.playerService.refillEasel(indexPlayer); // Fill the easel with new letters from the reserve
            this.letterService.newMessage('mise a jour');
            return true;
        }

    }

    isPossible(position: Vec2, orientation: string, word: string, indexPlayer: number): boolean {
        let isPossible = false;

        // 1st Round
        if (this.isFirstRound) {
            isPossible =
                this.isItMyTurn() &&
                this.isFirstWordValid(position, orientation, word) && // If the 1st word is placed onto the central position
                this.isWordValid(position, orientation, word, indexPlayer) && // If the letters of the word are in the easel or the scrabble board
                this.isWordFitting(position, orientation, word); // If the word is fitting inside the scrabble board
        }
        // The following rounds
        else {
            isPossible =
                this.isItMyTurn() &&
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
        for (const letter of word) {
            let isLetterExisting = false;

            // Search the letter in the easel
            for (const letterEasel of this.playerService.getLettersEasel(indexPlayer)) {
                if (letter === letterEasel.value.toLowerCase()) {
                    isLetterExisting = true;
                }
                // If it's a white letter
                else if (letter === letter.toUpperCase()) {
                    if (letterEasel.value === '*') {
                        isLetterExisting = true;
                    }
                }
            }
            // Search the scrabble board if the letter isn't in the easel
            if (isLetterExisting === false) {
                for (let i = 0; i < word.length; i++) {
                    if (orientation === 'v') {
                        if (letter.toUpperCase() === this.scrabbleBoard[position.x + i][position.y].toUpperCase()) {
                            isLetterExisting = true;
                        }
                    } else if (orientation === 'h') {
                        if (letter.toUpperCase() === this.scrabbleBoard[position.x][position.y + i].toUpperCase()) {
                            isLetterExisting = true;
                        }
                    }
                }
            }
            // The command is impossible if the letter isn't present in the easel or the scrabble board
            if (isLetterExisting === false) {
                return false;
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

    isItMyTurn(): boolean {
        if (this.tour) {
            return true;
        }
        return true;
    }

    ngOnDestroy() {
        this.viewSubscription.unsubscribe();
        this.tourSubscription.unsubscribe();
    }
}
