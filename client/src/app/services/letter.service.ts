import { Injectable } from '@angular/core';
import { EASEL_SIZE, RESERVE } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
@Injectable({
    providedIn: 'root',
})
export class LetterService {
    // Property witch return total number of letters available
    totalLetter: number;
    // Method for take a letter form reserve

    constructor() {
        for (const item of RESERVE) {
            this.totalLetter += item.quantity;
        }
    }
    getRandomLetter(): Letter {
        const randomElement = Math.floor(Math.random() * RESERVE.length);
        const letter: Letter = RESERVE[randomElement];
        // Update the reserve
        for (const item of RESERVE) {
            if (item.value === letter.value) {
                item.quantity--;
            }
        }
        return letter;
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
        return this.totalLetter;
    }

    // Method with returns if there are minimum letters inn reserve to play
    checklistLetters(): boolean {
        if (this.totalLetter < EASEL_SIZE) {
            return false;
        } else return true;
    }
}
