import { Component, ViewChild } from '@angular/core';
import { BOARD_COLUMNS, BOARD_ROWS, CENTRAL_CASE_POSX, CENTRAL_CASE_POSY } from '@app/classes/constants';
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
    isFirstRound: boolean;


    constructor() {
        this.scrabbleBoard = [];   // Initialise la matrice avec des lettres vides
        for (let i = 0; i < BOARD_ROWS; i++) {
            this.scrabbleBoard[i] = [];
            for (let j = 0; j < BOARD_COLUMNS; j++) {
                this.scrabbleBoard[i][j] = this.letterEmpty;
            }
        }
        this.isFirstRound = true;
    }

    place(positionX: number, positionY: number, orientation: string, word: string): boolean {
        if (this.isPossible(positionX, positionY, orientation, word)) {      // Si la commande est possible selon les paramètres

            for (let i = 0; i < word.length; i++) {

                // Ajoute la lettre à la position respective de la matrice selon l'orientation
                if (orientation === 'h') {
                    this.scrabbleBoard[positionX + i][positionY] = word.charAt(i);
                    if (word.charAt(i) === word.charAt(i).toUpperCase()) {
                        this.letterEaselComponent.removeLetter('*');             // Si on place une majuscule (lettre blanche)
                    }
                    else {
                        this.letterEaselComponent.removeLetter(word.charAt(i));  // Supprime la lettre du chevalet
                    }
                }
                else if (orientation === 'v') {
                    this.scrabbleBoard[positionX][positionY + i] = word.charAt(i);
                    if (word.charAt(i) === word.charAt(i).toUpperCase()) {
                        this.letterEaselComponent.removeLetter('*');
                    }
                    else {
                        this.letterEaselComponent.removeLetter(word.charAt(i));
                    }
                }
            }
            console.log(this.scrabbleBoard);
            this.isFirstRound = false;
            // TODO Valider le mot sur le scrabbleboard
            this.letterEaselComponent.refillEasle();    // Remplie le chevalet avec de nouvelles lettres de la réserve
            return true;
        }
        else {
            return false;
        }

    }

    isPossible(positionX: number, positionY: number, orientation: string, word: string): boolean {
        //TODO valider si on peut placer le mot à partir de la position donné,
        //     si les lettres du mot sont dans le chevalet...
        //     si les lettres sont sur le plateau
        //     1er tour?
        let isPossible = false;

        // 1er Tour
        if (this.isFirstRound) {
            isPossible = (this.isFirstWordValid(positionX, positionY, orientation, word) &&
                this.areLettersValid(positionX, positionX, orientation, word) &&
                this.isWordFitting(positionX, positionX, orientation, word));
        }
        // Les tours suivant
        else {
            isPossible = (this.areLettersValid(positionX, positionY, orientation, word) && // Si les lettres du mots sont dans le chevalet ou le plateau du jeu
                this.isWordFitting(positionX, positionY, orientation, word)); // Si le mot n'est pas à l'extérieur de la grille
        }

        return isPossible;
    }

    isWordFitting(positionX: number, positionY: number, orientation: string, word: string): boolean {
        if (orientation === 'h') {
            if (positionX + word.length > BOARD_ROWS) {
                return false;
            }
        }
        else if (orientation === 'v') {
            if (positionY + word.length > BOARD_COLUMNS) {
                return false;
            }
        }
        return true;
    }

    areLettersValid(positionX: number, positionY: number, orientation: string, word: string): boolean {
        let areLettersValid = true;
        let isLetterExistant = false;

        for (let letter of word) {

            for (let letterEasel of this.letterEaselComponent.letterEaselTab) {   // check le chevalet

                if (letter === letterEasel.value.toLowerCase()) {
                    isLetterExistant = true;
                }
                else if (letter === letter.toUpperCase()) {   // Si c'est une lettre blanche
                    if (letterEasel.value === '*') {
                        isLetterExistant = true;
                    }
                }
            }
            if (isLetterExistant === false) { // Si elle n'est pas dans le chevalet, check le plateau
                for (let i = 0; i < word.length; i++) {
                    if (orientation === 'h') {
                        if (letter.toUpperCase() === this.scrabbleBoard[positionX + i][positionY].toUpperCase()) {
                            isLetterExistant = true;
                        }
                    }
                    else if (orientation === 'v') {
                        if (letter.toUpperCase() === this.scrabbleBoard[positionX][positionY + i].toUpperCase()) {
                            isLetterExistant = true;
                        }
                    }
                }
            }
            if (isLetterExistant === false) { // Si la lettre n'est pas dans le chevalet et le plateau -> invalide
                areLettersValid = false;
            }
            isLetterExistant = false;         // Reset la valeur du bool pour tester la prochaine lettre
        }
        return areLettersValid;
    }

    isFirstWordValid(positionX: number, positionY: number, orientation: string, word: string): boolean {

        if (orientation === 'h') {
            for (let i = 0; i < word.length; i++) {
                if (positionX + i === CENTRAL_CASE_POSX && positionY === CENTRAL_CASE_POSY) {
                    return true;
                }
            }
        }
        if (orientation === 'v') {
            for (let i = 0; i < word.length; i++) {
                if (positionX === CENTRAL_CASE_POSX && positionY++ === CENTRAL_CASE_POSY) {
                    return true;
                }
            }
        }
        return false;
    }
}

