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
    reserve: Letter[] = RESERVE;
    messageSource = new BehaviorSubject('default message');
    // eslint-disable-next-line no-invalid-this
    currentMessage = this.messageSource.asObservable();
    private func: () => void;

    updateReserve(fn: () => void) {
        this.func = fn;
        // from now on, call myFunc wherever you want inside this service
    }

    newMessage(message: string) {
        this.messageSource.next(message);
        this.func();
    }

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
        let size = 0;
        for (const letter of RESERVE) {
            size += letter.quantity;
        }
        //  console.log(size);
        return size;
    }

    addLetterToReserve(letter: string): void {
        for (const letterReserve of RESERVE) {
            if (letter.toUpperCase() === letterReserve.value) {
                letterReserve.quantity++;
            }
        }
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
        let totalLetter = 0;
        // eslint-disable-next-line prefer-const
        for (let item of this.reserve) {
            totalLetter += item.quantity;
        }
        return totalLetter;
        // eslint-disable-next-line no-unreachable
    }

    // Method with returns if there are minimum letters inn reserve to play
    // checklistLetters(): boolean {
    //     if (this.totalLetter < EASEL_SIZE) {
    //         return false;
    //     } else return true;
    // }
}
