import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
@Injectable({
    providedIn: 'root',
})
export class LetterService {
    reserve: Letter[] = [
        {
            value: 'A',
            quantity: 9,
            points: 1,
        },
        {
            value: 'B',
            quantity: 2,
            points: 3,
        },
        {
            value: 'C',
            quantity: 2,
            points: 3,
        },
        {
            value: 'D',
            quantity: 3,
            points: 2,
        },
        {
            value: 'E',
            quantity: 15,
            points: 1,
        },
        {
            value: 'F',
            quantity: 2,
            points: 4,
        },
        {
            value: 'G',
            quantity: 2,
            points: 2,
        },
        {
            value: 'H',
            quantity: 2,
            points: 4,
        },
        {
            value: 'I',
            quantity: 8,
            points: 1,
        },
        {
            value: 'J',
            quantity: 1,
            points: 8,
        },
        {
            value: 'K',
            quantity: 1,
            points: 10,
        },
        {
            value: 'L',
            quantity: 5,
            points: 1,
        },
        {
            value: 'M',
            quantity: 3,
            points: 2,
        },
        {
            value: 'N',
            quantity: 6,
            points: 1,
        },
        {
            value: 'O',
            quantity: 6,
            points: 1,
        },
        {
            value: 'P',
            quantity: 2,
            points: 3,
        },
        {
            value: 'Q',
            quantity: 1,
            points: 8,
        },
        {
            value: 'R',
            quantity: 6,
            points: 1,
        },
        {
            value: 'S',
            quantity: 6,
            points: 1,
        },
        {
            value: 'T',
            quantity: 6,
            points: 1,
        },
        {
            value: 'U',
            quantity: 6,
            points: 1,
        },
        {
            value: 'V',
            quantity: 2,
            points: 4,
        },
        {
            value: 'W',
            quantity: 1,
            points: 10,
        },
        {
            value: 'X',
            quantity: 1,
            points: 10,
        },
        {
            value: 'Y',
            quantity: 1,
            points: 10,
        },
        {
            value: 'Z',
            quantity: 1,
            points: 10,
        },
        {
            value: '*',
            quantity: 2,
            points: 0,
        },
    ];

    randomElement: number;
    // Méthode pour prendre des lettres dans la réserve
    getRandomLetter(): Letter {
        this.randomElement = Math.floor(Math.random() * this.reserve.length);
        const letter: Letter = this.reserve[this.randomElement];
        // Mise à jour de la réserve
        for (const item of this.reserve) {
            if (item.value === letter.value) {
                item.quantity--;
            }
        }

        return letter;
    }
}
