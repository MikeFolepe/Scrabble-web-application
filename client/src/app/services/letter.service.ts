import { Injectable } from '@angular/core';
import { EASEL_SIZE, RESERVE } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
@Injectable({
    providedIn: 'root',
})
export class LetterService {
    randomElement: number;

    // Méthode pour prendre des lettres dans la réserve
    getRandomLetter(): Letter {
        const letterEmpty: Letter = {
            value: '',
            quantity: 0,
            points: 0,
        };

        if (this.isReserveEmpty()) {
            // Si la réserve est vide
            return letterEmpty;
        }

        this.randomElement = Math.floor(Math.random() * RESERVE.length);
        let letter: Letter = RESERVE[this.randomElement];

        while (RESERVE[this.randomElement].quantity === 0 && !this.isReserveEmpty()) {
            this.randomElement = Math.floor(Math.random() * RESERVE.length);
            letter = RESERVE[this.randomElement];
        }

        // Mise à jour de la réserve
        RESERVE[this.randomElement].quantity--;
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

    reserveSize(): number {
        let size: number = 0;
        for (const letter of RESERVE) {
            size += letter.quantity;
        }
        console.log(size);
        return size;
    }

    addLetterToReserve(letter: string): void {
        for (const letterReserve of RESERVE) {
            if (letter.toUpperCase() === letterReserve.value) {
                letterReserve.quantity++;
            }
        }
    }

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
}
