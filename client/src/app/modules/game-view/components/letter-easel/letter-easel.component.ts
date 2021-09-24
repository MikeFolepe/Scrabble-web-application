import { Component, OnInit } from '@angular/core';
import { EASEL_SIZE } from '@app/classes/constants';
import { LetterEasel } from '@app/classes/letter-easel';
import { LetterService } from '@app/services/letter.service';
@Component({
    selector: 'app-letter-easel',
    templateUrl: './letter-easel.component.html',
    styleUrls: ['./letter-easel.component.scss'],
})
export class LetterEaselComponent implements OnInit {
    letterEaselTab: LetterEasel[] = [];
    constructor(private letterService: LetterService) {}

    ngOnInit(): void {
        this.initializeTab();
    }

    initializeTab(): void {
        for (let i = 0; i < EASEL_SIZE; i++) {
            this.letterEaselTab[i] = this.letterService.getRandomLetter();
        }
    }

    removeLetter(letterToRemove: string): void {   // Enlève une lettre du chevalet

        for (let i = 0; i < this.letterEaselTab.length; i++) {
            if (this.letterEaselTab[i].value === letterToRemove.toUpperCase()) {
                this.letterEaselTab.splice(i, 1);
                break;
            }
        }
    }

    refillEasle(): void {
        for (let i = this.letterEaselTab.length; i < EASEL_SIZE; i++) {
            this.letterEaselTab[i] = this.letterService.getRandomLetter();
        }
    }
}
