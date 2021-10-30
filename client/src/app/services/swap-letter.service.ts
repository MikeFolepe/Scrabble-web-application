/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { INDEX_INVALID, MIN_RESERVE_SIZE_TO_SWAP } from '@app/classes/constants';
import { LetterService } from '@app/services/letter.service';
import { PlayerService } from '@app/services/player.service';

@Injectable({
    providedIn: 'root',
})
export class SwapLetterService {
    constructor(private playerService: PlayerService, private letterService: LetterService) {}

    // Swap all the letters selected from the easel with new ones from the reserve
    swap(lettersToSwap: string, indexPlayer: number): boolean {
        if (!this.isPossible(lettersToSwap, indexPlayer)) {
            return false;
        }

        for (const letterToSwap of lettersToSwap) {
            this.playerService.swap(letterToSwap, indexPlayer);
        }
        return true;
    }

    isPossible(lettersToSwap: string, indexPlayer: number): boolean {
        return this.reserveHasEnoughLetters() && this.areLettersInEasel(lettersToSwap, indexPlayer);
    }

    areLettersInEasel(lettersToSwap: string, indexPlayer: number): boolean {
        const indexLetters: number[] = [];
        let currentLetterIndex = 0;
        for (const letterToSwap of lettersToSwap) {
            // If the letter isn't in the easel, return false
            currentLetterIndex = this.playerService.easelContainsLetter(letterToSwap, 0, indexPlayer);
            if (currentLetterIndex === INDEX_INVALID) {
                return false;
            }
            for (const index of indexLetters) {
                while (currentLetterIndex === index) {
                    currentLetterIndex = this.playerService.easelContainsLetter(letterToSwap, currentLetterIndex + 1, indexPlayer);
                    if (currentLetterIndex === INDEX_INVALID) {
                        return false;
                    }
                }
            }
            indexLetters.push(currentLetterIndex);
        }
        return true;
    }

    // Reserve needs to have at least 7 letters to perform a swap
    reserveHasEnoughLetters(): boolean {
        if (this.letterService.reserveSize >= MIN_RESERVE_SIZE_TO_SWAP) {
            return true;
        }
        return false;
    }
}
