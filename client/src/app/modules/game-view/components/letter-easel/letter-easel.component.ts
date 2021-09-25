import { Component, OnInit } from '@angular/core';
import { DEFAULT_FONT_SIZE } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { LetterEaselService } from '@app/services/letter-easel.service';

@Component({
    selector: 'app-letter-easel',
    templateUrl: './letter-easel.component.html',
    styleUrls: ['./letter-easel.component.scss'],
})
export class LetterEaselComponent implements OnInit {

    letterEaselTab: Array<Letter> = new Array<Letter>();
    service: LetterEaselService;

    fontSize: number = DEFAULT_FONT_SIZE;

    constructor(private letterEaselService: LetterEaselService) {
        this.service = letterEaselService;
    }

    ngOnInit(): void {
        this.service.updateLettersEasel(this.update.bind(this));
        this.update();
    }

    update(): void {
        this.letterEaselTab = this.letterEaselService.getAll();
    }
}
