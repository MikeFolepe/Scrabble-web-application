import { Component } from '@angular/core';
import { MIN_RESERVE_SIZE_TOSWAP } from '@app/classes/constants';
import { LetterService } from '@app/services/letter.service';
// eslint-disable-next-line import/no-deprecated
import { PlayerService } from '@app/services/player.service';

@Component({
    selector: 'app-swap-letter',
    templateUrl: './swap-letter.component.html',
    styleUrls: ['./swap-letter.component.scss'],
})
export class SwapLetterComponent {
    constructor(private playerService: PlayerService, private letterService: LetterService) {}

    swap(lettersToSwap: string): boolean {
        if (!this.isPossible(lettersToSwap)) {
            return false;
        }

        for (const letterToSwap of lettersToSwap) {
            this.playerService.swap(letterToSwap);
        }
        return true;
    }

    // Pourquoi ne souscrirait tu aps au tour pour cheker si c'est ton tour ou pas ??
    isPossible(lettersToSwap: string): boolean {
        return this.isItMyTurn() && this.reserveHasEnoughLetters() && this.areLettersInEasel(lettersToSwap);
    }

    areLettersInEasel(lettersToSwap: string): boolean {
        for (const letterToSwap of lettersToSwap) {
            // If the letter isn't in the reserve, return false
            if (!this.playerService.easelContainsLetter(letterToSwap)) {
                return false;
            }
        }
        return true;
    }

    reserveHasEnoughLetters(): boolean {
        if (this.letterService.reserveSize() >= MIN_RESERVE_SIZE_TOSWAP) {
            return true;
        }
        return false;
    }

    isItMyTurn(): boolean {
        // TODO
        return true;
    }
}
