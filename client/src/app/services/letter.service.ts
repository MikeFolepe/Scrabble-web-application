import { Injectable } from '@angular/core';
import { EASEL_SIZE, RESERVE } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
@Injectable({
    providedIn: 'root',
})
export class LetterService {
    // Méthode pour prendre des lettres dans la réserve
    totalLetters: number;

    constructor() {
        for (const item of RESERVE) {
            this.totalLetters += item.quantity;
        }
    }
    getRandomLetter(): Letter {
        let randomElement = Math.floor(Math.random() * RESERVE.length);
        let letter: Letter = RESERVE[randomElement];
        const letterEmpty: Letter = {
            value: '',
            quantity: 0,
            points: 0,
        };

        if (this.isReserveEmpty()) {
            // Si la réserve est vide
            return letterEmpty;
        }

        while (RESERVE[randomElement].quantity === 0 && !this.isReserveEmpty()) {
            randomElement = Math.floor(Math.random() * RESERVE.length);
            letter = RESERVE[randomElement];
        }

        // Mise à jour de la réserve
        RESERVE[randomElement].quantity--;
        return letter;
    }

    isReserveEmpty(): boolean {
        for (const letter of RESERVE) {
            if (letter.quantity > 0) {
                return false;
            }
        }
        return true;
    }
    // Shuffle  at the initialization of a player seven letters
    getRandomLetters(): Letter[] {
        const tab: Letter[] = [];
        for (let i = 0; i < EASEL_SIZE; i++) {
            const letter = this.getRandomLetter();
            tab[i] = {
                value: letter.value,
                quantity: letter.quantity,
                points: letter.points,
            };
        }
        return tab;
    }

    // Methods witch return the numbers of available letters in the reserve
    getNumbersLetterAvailable(): number {
        return this.totalLetters;
    }

    // Method with returns if there are minimum letters inn reserve to play
    checklistLetters(): boolean {
        if (this.totalLetters < EASEL_SIZE) {
            return false;
        } else return true;
    }
}
