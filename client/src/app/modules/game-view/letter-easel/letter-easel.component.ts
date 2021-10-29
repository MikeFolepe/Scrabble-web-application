import { Component } from '@angular/core';
import { DEFAULT_FONT_SIZE } from '@app/classes/constants';
import { PlayerService } from '@app/services/player.service';

@Component({
    selector: 'app-letter-easel',
    templateUrl: './letter-easel.component.html',
    styleUrls: ['./letter-easel.component.scss'],
})
export class LetterEaselComponent {
    fontSize: number = DEFAULT_FONT_SIZE;

    constructor(public playerService: PlayerService) {}

    handleFontSizeEvent(fontSizeEvent: number) {
        this.fontSize = fontSizeEvent;
        this.playerService.updateFontSize(this.fontSize);
    }
}
