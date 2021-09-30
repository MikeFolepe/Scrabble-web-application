/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BOARD_COLUMNS, BOARD_ROWS, CASE_SIZE, CENTRAL_CASE_POSX, CENTRAL_CASE_POSY, DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/classes/constants';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from '@app/services/grid.service';
import { LetterService } from '@app/services/letter.service';
import { PlayerService } from '@app/services/player.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-place-letter',
    templateUrl: './place-letter.component.html',
    styleUrls: ['./place-letter.component.scss'],
})
export class PlaceLetterComponent implements OnInit, OnDestroy {
    scrabbleBoard: string[][]; // Matrice 15x15

    letterEmpty: string = '';
    isFirstRound: boolean = true;
    message: string;
    reserveSubsciption: Subscription = new Subscription();

    constructor(private playerService: PlayerService, private gridService: GridService, private letterService: LetterService) {
        this.scrabbleBoard = []; // Initialise la matrice avec des lettres vides
        for (let i = 0; i < BOARD_ROWS; i++) {
            this.scrabbleBoard[i] = [];
            for (let j = 0; j < BOARD_COLUMNS; j++) {
                this.scrabbleBoard[i][j] = this.letterEmpty;
            }
        }
    }

    ngOnInit() {
        this.reserveSubsciption = this.letterService.currentMessage.subscribe((message) => (this.message = message));
    }

    place(position: Vec2, orientation: string, word: string): boolean {
        // Si la commande est possible selon les paramètres
        if (!this.isPossible(position, orientation, word)) {
            return false;
        }

        for (let i = 0; i < word.length; i++) {
            // Ajoute la lettre à la position respective de la matrice selon l'orientation
            let x = 0;
            let y = 0;
            if (orientation === 'h') {
                x = i;
            } else if (orientation === 'v') {
                y = i;
            }

            // Si la case est vide, on utilise une lettre de la réserve
            if (this.scrabbleBoard[position.x + x][position.y + y] === '') {
                this.scrabbleBoard[position.x + x][position.y + y] = word.charAt(i);

                // Display the letter on the scrabble board
                const positionGrid = this.posTabToPosGrid(position.x + x, position.y + y);
                this.gridService.drawLetter(this.gridService.gridContext, word.charAt(i), positionGrid);

                if (word.charAt(i) === word.charAt(i).toUpperCase()) {
                    // Si on place une majuscule (lettre blanche), on supprime un '*'
                    this.playerService.removeLetter('*');
                } else {
                    // Sinon supprime la lettre du chevalet
                    this.playerService.removeLetter(word.charAt(i));
                }
            }
        }

        // console.log(this.scrabbleBoard);
        this.isFirstRound = false;
        // TODO Valider le mot sur le scrabbleboard
        this.playerService.refillEasel(); // Remplie le chevalet avec de nouvelles lettres de la réserve
        this.letterService.newMessage('mise a jour');
        return true;
    }

    isPossible(position: Vec2, orientation: string, word: string): boolean {
        let isPossible = false;

        // 1er Tour
        if (this.isFirstRound) {
            isPossible =
                this.isItMyTurn() &&
                this.isFirstWordValid(position, orientation, word) &&
                this.isWordValid(position, orientation, word) &&
                this.isWordFitting(position, orientation, word);
        }
        // Les tours suivants
        else {
            isPossible =
                this.isItMyTurn() &&
                this.isWordValid(position, orientation, word) && // Si les lettres du mots sont dans le chevalet ou le plateau du jeu
                this.isWordFitting(position, orientation, word) && // Si le mot n'est pas à l'extérieur de la grille
                this.isWordTouchingOthers(position, orientation, word); // Si le mot est en contact avec d'autres lettres du plateau
        }

        return isPossible;
    }

    isWordFitting(position: Vec2, orientation: string, word: string): boolean {
        if (orientation === 'h') {
            if (position.x + word.length > BOARD_ROWS) {
                return false;
            }
        } else if (orientation === 'v') {
            if (position.y + word.length > BOARD_COLUMNS) {
                return false;
            }
        }
        return true;
    }

    isWordValid(position: Vec2, orientation: string, word: string): boolean {
        for (const letter of word) {
            let isLetterExisting = false;
            // check le chevalet
            for (const letterEasel of this.playerService.getLettersEasel()) {
                if (letter === letterEasel.value.toLowerCase()) {
                    isLetterExisting = true;
                }
                // Si c'est une lettre blanche
                else if (letter === letter.toUpperCase()) {
                    if (letterEasel.value === '*') {
                        isLetterExisting = true;
                    }
                }
            }
            // Si elle n'est pas dans le chevalet, check le plateau
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
            // Si la lettre n'est pas dans le chevalet et le plateau -> invalide
            if (isLetterExisting === false) {
                return false;
            }
        }
        return true;
    }

    isFirstWordValid(position: Vec2, orientation: string, word: string): boolean {
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
            for (let i = 0; i < word.length; i++) {
                let x = 0;
                let y = 0;
                if (orientation === 'h') {
                    x = i;
                } else if (orientation === 'v') {
                    y = i;
                }

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

    posTabToPosGrid(positionTabX: number, positionTabY: number): Vec2 {
        const positionGrid: Vec2 = {
            x: positionTabX * CASE_SIZE + CASE_SIZE - DEFAULT_WIDTH / 2,
            y: positionTabY * CASE_SIZE + CASE_SIZE - DEFAULT_HEIGHT / 2,
        };
        return positionGrid;
    }

    isItMyTurn(): boolean {
        // TODO
        return true;
    }

    ngOnDestroy() {
        this.reserveSubsciption.unsubscribe();
    }
}
