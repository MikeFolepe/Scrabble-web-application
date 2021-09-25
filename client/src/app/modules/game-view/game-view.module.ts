import { FormsModule } from '@angular/forms';
import { ChatboxComponent } from '@app/modules/game-view/components/chatbox/chatbox.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { PlayAreaComponent } from '@app/modules/game-view/components/play-area/play-area.component';
import { SidebarComponent } from '@app/modules/game-view/components/sidebar/sidebar.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameViewComponent } from './components/game-view/game-view.component';
import { InformationPanelComponent } from './components/information-panel/information-panel.component';
import { LetterEaselComponent } from './components/letter-easel/letter-easel.component';
import { ScrabbleBoardComponent } from './components/scrabble-board/scrabble-board.component';
import { FontSizeComponent } from './components/font-size/font-size.component';
import { CountdownComponent } from './components/countdown/countdown.component';
// eslint-disable-next-line no-restricted-imports
import { SharedModule } from '../shared/shared/shared.module';

@NgModule({
    declarations: [
        GameViewComponent,
        ScrabbleBoardComponent,
        InformationPanelComponent,
        LetterEaselComponent,
        PlayAreaComponent,
        SidebarComponent,
        ChatboxComponent,
        FontSizeComponent,
        CountdownComponent,
    ],
    imports: [CommonModule, AppMaterialModule, AppRoutingModule, FormsModule, SharedModule],
    exports: [GameViewComponent],
    bootstrap: [GameViewComponent],
})
export class GameViewModule {}
