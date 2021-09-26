import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { EASEL_SIZE, RESERVE } from '@app/classes/constants';
@Injectable({
    providedIn: 'root',
})
export class LetterService {
    randomElement: number;
    // Méthode pour prendre des lettres dans la réserve
    getRandomLetter(): Letter {
        this.randomElement = Math.floor(Math.random() * RESERVE.length);
        const letter: Letter = RESERVE[this.randomElement];
        // Mise à jour de la réserve
        for (const item of RESERVE) {
            if (item.value === letter.value) {
                item.quantity--;
            }
        }
        return letter;
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
