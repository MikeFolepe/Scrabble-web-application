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
}
