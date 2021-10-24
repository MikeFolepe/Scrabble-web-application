import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { ChatboxComponent } from '@app/modules/game-view/chatbox/chatbox.component';
import { InformationPanelComponent } from '@app/modules/game-view/information-panel/information-panel.component';
import { PlayAreaComponent } from '@app/modules/game-view/play-area/play-area.component';
import { SidebarComponent } from '@app/modules/game-view/sidebar/sidebar.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { SharedModule } from '@app/modules/shared/shared/shared.module';
import { FontSizeComponent } from './font-size/font-size.component';
import { GameViewComponent } from './game-view/game-view.component';
import { LetterEaselComponent } from './letter-easel/letter-easel.component';
// eslint-disable-next-line no-restricted-imports
import { PlayerAIComponent } from './player-ai/player-ai.component';
import { ScrabbleBoardComponent } from './scrabble-board/scrabble-board.component';

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
