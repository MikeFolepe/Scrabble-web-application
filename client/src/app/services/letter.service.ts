import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { EASEL_SIZE, RESERVE, FONT_SIZE_MAX, FONT_SIZE_MIN, DEFAULT_FONT_SIZE } from '@app/classes/constants';
@Injectable({
    providedIn: 'root',
})
export class LetterService {

    randomElement: number;
    fontSize: number = DEFAULT_FONT_SIZE;
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

    getFontSize() {
        return this.fontSize;
    }

    setFontSize(fontSize: number) {
        if (fontSize > FONT_SIZE_MAX) {
            this.fontSize = FONT_SIZE_MAX;
        } else if (fontSize < FONT_SIZE_MIN) {
            this.fontSize = FONT_SIZE_MIN;
        } else {
            this.fontSize = fontSize;
        }
    }
}
