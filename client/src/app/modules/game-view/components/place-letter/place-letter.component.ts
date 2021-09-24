import { Component } from '@angular/core';
import { BOARD_COLUMNS, BOARD_ROWS } from '@app/classes/constants';

@Component({
    selector: 'app-place-letter',
    templateUrl: './place-letter.component.html',
    styleUrls: ['./place-letter.component.scss'],
})
export class PlaceLetterComponent {

    letterEmpty: string = '';

    scrabbleBoard: string[][];                    // Matrice 15x15
    letterToPlace: string = this.letterEmpty;     // Lettre à ajouter dans la matrice

    constructor() {  // Initialise la matrice avec des lettres vides
        this.scrabbleBoard = [];
        for (let i = 0; i < BOARD_ROWS; i++) {
            this.scrabbleBoard[i] = [];
            for (let j = 0; j < BOARD_COLUMNS; j++) {
                this.scrabbleBoard[i][j] = this.letterEmpty;
            }
        }
    }

    place(positionX: number, positionY: number, orientation: string, word: string): boolean {
        if (this.isPossible()) {               // Si la commande est possible selon les paramètres
            console.log(positionX, positionY);

            for (let i = 0; i < word.length; i++) {

                // Ajoute la lettre à la position respective de la matrice selon l'orientation
                if (orientation === 'h') {
                    this.scrabbleBoard[positionX + i][positionY] = word.charAt(i);
                }
                else if (orientation === 'v') {
                    this.scrabbleBoard[positionX][positionY + i] = word.charAt(i);
                }
                this.letterToPlace = this.letterEmpty;       // Clear le contenu de letterToPlace
            }
            console.log(this.scrabbleBoard);
            return true;
        }
        else {
            return false;
        }

    }

    isPossible(): boolean {
        //TODO valider si on peut placer le mot à partir de la position donné,
        //     si les lettres du mot sont dans le chevalet...
        //     si les lettres sont sur le plateau
        //     1er tour?
        return true;
    }

}
