import { Component } from '@angular/core';
import { BOARD_COLUMNS, BOARD_ROWS, CASE_SIZE, CENTRAL_CASE_POSX, CENTRAL_CASE_POSY, DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/classes/constants';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from '@app/services/grid.service';
import { PlayerService } from '@app/services/player.service';
import { TourService } from '@app/services/tour.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-place-letter',
    templateUrl: './place-letter.component.html',
    styleUrls: ['./place-letter.component.scss'],
})
export class PlaceLetterComponent {
    tour: boolean;
    tourSubscription: Subscription = new Subscription();

    scrabbleBoard: string[][]; // 15x15 array

    letterEmpty: string = '';
    isFirstRound: boolean = true;

    constructor(private playerService: PlayerService, private gridService: GridService, private tourService: TourService) {
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
    }

    initializeTour(): void {
        this.tourSubscription = this.tourService.tourSubject.subscribe((tourSubject: boolean) => {
            this.tour = tourSubject;
        });
        this.tourService.emitTour();
    }

    place(position: Vec2, orientation: string, word: string, indexPlayer: number): boolean {
        // If the command is possible according to the parameters
        if (!this.isPossible(position, orientation, word, indexPlayer)) {
            return false;
        }

        for (let i = 0; i < word.length; i++) {
            // Adds the letter to the respective position of the array based on the orientation
            let x = 0;
            let y = 0;
            if (orientation === 'h') {
                x = i;
            } else if (orientation === 'v') {
                y = i;
            }

            // If the position is empty, we use a letter from the reserve
            if (this.scrabbleBoard[position.x + x][position.y + y] === '') {
                this.scrabbleBoard[position.x + x][position.y + y] = word.charAt(i);

                // Display the letter on the scrabble board grid
                const positionGrid = this.posTabToPosGrid(position.x + x, position.y + y);
                this.gridService.drawLetter(this.gridService.gridContext, word.charAt(i), positionGrid);

                if (word.charAt(i) === word.charAt(i).toUpperCase()) {
                    // If we put a capital letter (white letter), we remove a '*' from the easel
                    this.playerService.removeLetter('*', indexPlayer);
                } else {
                    // Otherwise we remove the respective letter from the easel
                    this.playerService.removeLetter(word.charAt(i), indexPlayer);
                }
            }
        }

        console.log(this.scrabbleBoard);
        this.isFirstRound = false;
        // TODO Valider le mot sur le scrabbleboard
        this.playerService.refillEasel(indexPlayer); // Fill the easel with new letters from the reserve
        return true;
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
        if (orientation === 'h') {
            if (position.x + word.length > BOARD_ROWS) {
                // Out of bounds on x axis
                return false;
            }
        } else if (orientation === 'v') {
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
                    if (orientation === 'h') {
                        if (letter.toUpperCase() === this.scrabbleBoard[position.x + i][position.y].toUpperCase()) {
                            isLetterExisting = true;
                        }
                    } else if (orientation === 'v') {
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
        if (orientation === 'h') {
            for (let i = 0; i < word.length; i++) {
                if (position.x + i === CENTRAL_CASE_POSX && position.y === CENTRAL_CASE_POSY) {
                    return true;
                }
            }
        }
        if (orientation === 'v') {
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
            if (orientation === 'h') {
                x = i;
            } else if (orientation === 'v') {
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

    // Transpose the positions from 15x15 array to 750x750 grid
    posTabToPosGrid(positionTabX: number, positionTabY: number): Vec2 {
        const positionGrid: Vec2 = {
            x: positionTabX * CASE_SIZE + CASE_SIZE - DEFAULT_WIDTH / 2,
            y: positionTabY * CASE_SIZE + CASE_SIZE - DEFAULT_HEIGHT / 2,
        };
        return positionGrid;
    }

    isItMyTurn(): boolean {
        if (this.tour) {
            return true;
        }
        return true;
    }
}
