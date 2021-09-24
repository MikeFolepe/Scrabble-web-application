import { Component, ViewChild } from '@angular/core';
import { BOARD_COLUMNS, BOARD_ROWS, CENTRAL_CASE_POSX, CENTRAL_CASE_POSY } from '@app/classes/constants';
import { Vec2 } from '@app/classes/vec2';
import { LetterEaselComponent } from '../letter-easel/letter-easel.component';


@Component({
    selector: 'app-place-letter',
    templateUrl: './place-letter.component.html',
    styleUrls: ['./place-letter.component.scss'],
})
export class PlaceLetterComponent {
    @ViewChild(LetterEaselComponent) letterEaselComponent: LetterEaselComponent;

    scrabbleBoard: string[][];     // Matrice 15x15

    letterEmpty: string = '';
    isFirstRound: boolean = true;


    constructor() {
        this.scrabbleBoard = [];   // Initialise la matrice avec des lettres vides
        for (let i = 0; i < BOARD_ROWS; i++) {
            this.scrabbleBoard[i] = [];
            for (let j = 0; j < BOARD_COLUMNS; j++) {
                this.scrabbleBoard[i][j] = this.letterEmpty;
            }
        }
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
            }
            else if (orientation === 'v') {
                y = i;
            }
            // Si la case est vide, on utilise une lettre de la réserve

            this.scrabbleBoard[position.x + x][position.y + y] = word.charAt(i);
            if (word.charAt(i) === word.charAt(i).toUpperCase()) {
                // Si on place une majuscule (lettre blanche)
                this.letterEaselComponent.removeLetter('*');
            }
            else {
                // Supprime la lettre du chevalet
                this.letterEaselComponent.removeLetter(word.charAt(i));
            }

        }
        console.log(this.scrabbleBoard);
        this.isFirstRound = false;
        // TODO Valider le mot sur le scrabbleboard
        this.letterEaselComponent.refillEasle();    // Remplie le chevalet avec de nouvelles lettres de la réserve
        return true;
    }

    isPossible(position: Vec2, orientation: string, word: string): boolean {
        //TODO valider si on peut placer le mot à partir de la position donné,
        //     si les lettres du mot sont dans le chevalet...
        //     si les lettres sont sur le plateau
        //     1er tour?
        let isPossible = false;

        // 1er Tour
        if (this.isFirstRound) {
            isPossible = (this.isFirstWordValid(position, orientation, word) &&
                this.isWordValid(position, orientation, word) &&
                this.isWordFitting(position, orientation, word));
        }
        // Les tours suivants
        else {
            isPossible = (this.isWordValid(position, orientation, word) && // Si les lettres du mots sont dans le chevalet ou le plateau du jeu
                this.isWordFitting(position, orientation, word)); // Si le mot n'est pas à l'extérieur de la grille
        }

        return isPossible;
    }

    isWordFitting(position: Vec2, orientation: string, word: string): boolean {
        if (orientation === 'h') {
            if (position.x + word.length > BOARD_ROWS) {
                return false;
            }
        }
        else if (orientation === 'v') {
            if (position.y + word.length > BOARD_COLUMNS) {
                return false;
            }
        }
        return true;
    }

    isWordValid(position: Vec2, orientation: string, word: string): boolean {
        for (let letter of word) {
            let isLetterExisting = false;
            // check le chevalet
            for (let letterEasel of this.letterEaselComponent.letterEaselTab) {
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
                    }
                    else if (orientation === 'v') {
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
}
