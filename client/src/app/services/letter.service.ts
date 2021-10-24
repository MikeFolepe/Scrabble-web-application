import { Injectable } from '@angular/core';
import { EASEL_SIZE, RESERVE } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LetterService {
    // Property witch return total number of letters available
    randomElement: number;
    // Deep copy
    reserve: Letter[] = JSON.parse(JSON.stringify(RESERVE));
    messageSource = new BehaviorSubject('default message');
    // eslint-disable-next-line no-invalid-this
    currentMessage = this.messageSource.asObservable();
    private func: () => void;

    updateView(fn: () => void) {
        this.func = fn;
        // from now on, call func wherever you want inside this service
    }

    writeMessage(message: string) {
        this.messageSource.next(message);
        this.func();
    }

    // Returns a random letter from the reserve if reserve is not empty
    getRandomLetter(): Letter {
        const letterEmpty: Letter = {
            value: '',
            quantity: 0,
            points: 0,
            isSelectedForSwap: false,
            isSelectedForManipulation: false,
        };
        let letter: Letter;

        if (this.isReserveEmpty()) {
            return letterEmpty;
        }
        do {
            this.randomElement = Math.floor(Math.random() * this.reserve.length);
            letter = this.reserve[this.randomElement];
        } while (letter.quantity === 0);

        // Update reserve
        letter.quantity--;
        return letter;
    }

    isReserveEmpty(): boolean {
        for (const letter of this.reserve) {
            if (letter.quantity > 0) {
                return false;
            }
        }
        return true;
    }

    getReserveSize(): number {
        let size = 0;
        for (const letter of this.reserve) {
            size += letter.quantity;
        }
        return size;
    }

    addLetterToReserve(letter: string): void {
        const letterReserve = this.reserve.find((letterSearched) => letter.toUpperCase() === letterSearched.value);
        if (letterReserve) {
            letterReserve.quantity++;
        }
    }

    // Draw seven letters from the reserve
    // Useful for initialize player's easel
    getRandomLetters(): Letter[] {
        const tab: Letter[] = [];
        for (let i = 0; i < EASEL_SIZE; i++) {
            const letter = this.getRandomLetter();
            tab[i] = {
                value: letter.value,
                quantity: letter.quantity,
                points: letter.points,
                isSelectedForSwap: letter.isSelectedForSwap,
                isSelectedForManipulation: letter.isSelectedForManipulation,
            };
        }
        return tab;
    }
}
