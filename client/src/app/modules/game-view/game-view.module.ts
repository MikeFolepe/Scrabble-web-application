import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { ChatboxComponent } from '@app/modules/game-view/components/chatbox/chatbox.component';
import { InformationPanelComponent } from '@app/modules/game-view/components/information-panel/information-panel.component';
import { PlayAreaComponent } from '@app/modules/game-view/components/play-area/play-area.component';
import { SidebarComponent } from '@app/modules/game-view/components/sidebar/sidebar.component';
import { AppMaterialModule } from '@app/modules/material.module';
<<<<<<< HEAD
// eslint-disable-next-line no-restricted-imports
import { SharedModule } from '../shared/shared/shared.module';
import { CountdownComponent } from './components/countdown/countdown.component';
import { FontSizeComponent } from './components/font-size/font-size.component';
import { GameViewComponent } from './components/game-view/game-view.component';
import { LetterEaselComponent } from './components/letter-easel/letter-easel.component';
import { PassTourComponent } from './components/pass-tour/pass-tour.component';
import { PlayerAIComponent } from './components/player-ai/player-ai.component';
import { ScrabbleBoardComponent } from './components/scrabble-board/scrabble-board.component';
import { WordValidationComponent } from './components/word-validation/word-validation.component';

=======
import { SharedModule } from '@app/modules/shared/shared/shared.module';
import { FontSizeComponent } from './components/font-size/font-size.component';
import { GameViewComponent } from './components/game-view/game-view.component';
import { LetterEaselComponent } from './components/letter-easel/letter-easel.component';
// eslint-disable-next-line no-restricted-imports
import { PlayerAIComponent } from './components/player-ai/player-ai.component';
import { ScrabbleBoardComponent } from './components/scrabble-board/scrabble-board.component';
>>>>>>> 9fef5b9307a31a22229ab27da685083c2eef4485
@NgModule({
    declarations: [
        GameViewComponent,
        ScrabbleBoardComponent,
        InformationPanelComponent,
        LetterEaselComponent,
        PlayAreaComponent,
        SidebarComponent,
        PlayerAIComponent,
        FontSizeComponent,
        ChatboxComponent,
    ],
    imports: [CommonModule, AppMaterialModule, AppRoutingModule, FormsModule, SharedModule],
    exports: [GameViewComponent, PlayerAIComponent],
    bootstrap: [GameViewComponent],
})
export class GameViewModule {}
