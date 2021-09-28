import { Component, OnInit } from '@angular/core';
import { MIN_RESERVE_SIZE_TOSWAP } from '@app/classes/constants';
import { LetterService } from '@app/services/letter.service';
import { PlayerService } from '@app/services/player.service';
import { TourService } from '@app/services/tour.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-swap-letter',
    templateUrl: './swap-letter.component.html',
    styleUrls: ['./swap-letter.component.scss'],
})
export class SwapLetterComponent implements OnInit {
    tour: boolean;
    tourSubscription: Subscription = new Subscription();

    constructor(private playerService: PlayerService, private letterService: LetterService, private tourService: TourService) {}

    ngOnInit(): void {
        this.initializeTour();
    }

    initializeTour(): void {
        this.tourSubscription = this.tourService.tourSubject.subscribe((tourSubject: boolean) => {
            this.tour = tourSubject;
        });
        this.tourService.emitTour();
    }

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
        return this.isItMyTurn() && this.reserveHasEnoughLetters() && this.areLettersInEasel(lettersToSwap, indexPlayer);
    }

    areLettersInEasel(lettersToSwap: string, indexPlayer: number): boolean {
        for (const letterToSwap of lettersToSwap) {
            // If the letter isn't in the easel, return false
            if (!this.playerService.easelContainsLetter(letterToSwap, indexPlayer)) {
                return false;
            }
        }
        return true;
    }

    // Reserve needs to have at least 7 letters to perform a swap
    reserveHasEnoughLetters(): boolean {
        if (this.letterService.reserveSize() >= MIN_RESERVE_SIZE_TOSWAP) {
            return true;
        }
        return false;
    }

    isItMyTurn(): boolean {
        if (this.tour) {
            return true;
        }
        return true;
    }
}
