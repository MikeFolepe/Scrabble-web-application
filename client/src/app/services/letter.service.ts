import { Injectable } from '@angular/core';
import { EASEL_SIZE, RESERVE } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { BehaviorSubject } from 'rxjs';
import { ClientSocketService } from '@app/services/client-socket.service';

@Injectable({
    providedIn: 'root',
})
export class LetterService {
    // Property witch return total number of letters available
    randomElement: number;
    // Deep copy
    reserve: Letter[] = JSON.parse(JSON.stringify(RESERVE));
    reserveSize: number;
    messageSource = new BehaviorSubject('default message');

    constructor(private clientSocketService: ClientSocketService) {
        this.clientSocketService.socket.on('receiveReserve', (reserve: Letter[], reserveSize: number) => {
            this.reserve = reserve;
            this.reserveSize = reserveSize;
        });
        let size = 0;
        for (const letter of this.reserve) {
            size += letter.quantity;
        }
        this.reserveSize = size;
    }

    // Returns a random letter from the reserve if reserve is not empty
    getRandomLetter(): Letter {
        if (this.reserveSize === 0) {
            // Return an empty letter
            return {
                value: '',
                quantity: 0,
                points: 0,
                isSelectedForSwap: false,
                isSelectedForManipulation: false,
            };
        }
        let letter: Letter;
        do {
            this.randomElement = Math.floor(Math.random() * this.reserve.length);
            letter = this.reserve[this.randomElement];
        } while (letter.quantity === 0);

        // Update reserve
        letter.quantity--;
        this.reserveSize--;
        this.clientSocketService.socket.emit('sendReserve', this.reserve, this.reserveSize, this.clientSocketService.roomId);
        return letter;
    }

    addLetterToReserve(letter: string): void {
        for (const letterReserve of this.reserve) {
            if (letter.toUpperCase() === letterReserve.value) {
                letterReserve.quantity++;
                this.reserveSize++;
                this.clientSocketService.socket.emit('sendReserve', this.reserve, this.reserveSize, this.clientSocketService.roomId);
                return;
            }
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
