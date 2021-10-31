import { Component } from '@angular/core';
import { DEFAULT_FONT_SIZE } from '@app/classes/constants';
<<<<<<< HEAD:client/src/app/modules/game-view/components/letter-easel/letter-easel.component.ts
// import { Letter } from '@app/classes/letter';
// eslint-disable-next-line import/no-deprecated
=======
>>>>>>> b7bc76bb223ef4674011ed696c8d797922f78013:client/src/app/modules/game-view/letter-easel/letter-easel.component.ts
import { PlayerService } from '@app/services/player.service';

@Component({
    selector: 'app-letter-easel',
    templateUrl: './letter-easel.component.html',
    styleUrls: ['./letter-easel.component.scss'],
})
export class LetterEaselComponent {
<<<<<<< HEAD:client/src/app/modules/game-view/components/letter-easel/letter-easel.component.ts
    // letterEaselTab: Letter[];

=======
>>>>>>> b7bc76bb223ef4674011ed696c8d797922f78013:client/src/app/modules/game-view/letter-easel/letter-easel.component.ts
    fontSize: number = DEFAULT_FONT_SIZE;

    constructor(public playerService: PlayerService) {}

    handleFontSizeEvent(fontSizeEvent: number) {
        this.fontSize = fontSizeEvent;
        this.playerService.updateFontSize(this.fontSize);
    }
}
