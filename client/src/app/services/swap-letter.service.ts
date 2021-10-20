import { Injectable } from '@angular/core';
import { INDEX_INVALID, MIN_RESERVE_SIZE_TOSWAP } from '@app/classes/constants';
import { LetterService } from '@app/services/letter.service';
import { PlayerService } from '@app/services/player.service';
import { SendMessageService } from './send-message.service';

@Injectable({
    providedIn: 'root',
})
export class SwapLetterService {
    constructor(private playerService: PlayerService, private letterService: LetterService, private sendMessageService: SendMessageService) {}

    // Swap all the letters selected from the easel with new ones from the reserve
    swapCommand(lettersToSwap: string, indexPlayer: number): boolean {
        if (!this.isPossible(lettersToSwap, indexPlayer)) {
            this.sendMessageService.displayMessageByType('ERREUR : La commande est impossible à réaliser', 'error');
            return false;
        }

        const lettersToSwapIndexes: number[] = this.lettersToSwapIntoIndexes(lettersToSwap, indexPlayer);
        for (const indexLetter of lettersToSwapIndexes) {
            this.swap(indexLetter, indexPlayer);
        }
        return true;
    }

    swap(indexLetter: number, indexPlayer: number) {
        this.playerService.addEaselLetterToReserve(indexLetter, indexPlayer);
        this.playerService.swap(indexLetter, indexPlayer);
    }

    lettersToSwapIntoIndexes(lettersToSwap: string, indexPlayer: number): number[] {
        const usedLetterIndexes: number[] = [];
        let indexCurrentLetter = 0;
        for (const letterToSwap of lettersToSwap) {
            indexCurrentLetter = this.playerService.indexLetterInEasel(letterToSwap, 0, indexPlayer);
            // If we swap multiple times the same letter, we verify that we're not using the same index in the easel
            for (const index of usedLetterIndexes) {
                while (indexCurrentLetter === index && indexCurrentLetter !== INDEX_INVALID) {
                    indexCurrentLetter = this.playerService.indexLetterInEasel(letterToSwap, indexCurrentLetter + 1, indexPlayer);
                }
            }
            usedLetterIndexes.push(indexCurrentLetter);
        }
        return usedLetterIndexes;
    }

    isPossible(lettersToSwap: string, indexPlayer: number): boolean {
        return this.reserveHasEnoughLetters() && this.areLettersInEasel(lettersToSwap, indexPlayer);
    }

    areLettersInEasel(lettersToSwap: string, indexPlayer: number): boolean {
        const lettersToSwapIndexes: number[] = this.lettersToSwapIntoIndexes(lettersToSwap, indexPlayer);
        for (const indexLetter of lettersToSwapIndexes) {
            if (indexLetter === INDEX_INVALID) {
                return false;
            }
        }
        return true;
    }

    // Reserve needs to have at least 7 letters to perform a swap
    reserveHasEnoughLetters(): boolean {
        if (this.letterService.getReserveSize() >= MIN_RESERVE_SIZE_TOSWAP) {
            return true;
        }
        return false;
    }
}
