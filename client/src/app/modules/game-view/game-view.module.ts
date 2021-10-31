/* eslint-disable import/namespace */
/* eslint-disable import/no-deprecated */
/* eslint-disable sort-imports */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { ChatboxComponent } from '@app/modules/game-view/chatbox/chatbox.component';
import { FontSizeComponent } from '@app/modules/game-view/font-size/font-size.component';
import { GameViewComponent } from '@app/modules/game-view/game-view/game-view.component';
import { InformationPanelComponent } from '@app/modules/game-view/information-panel/information-panel.component';
import { LetterEaselComponent } from '@app/modules/game-view/letter-easel/letter-easel.component';
import { PlayAreaComponent } from '@app/modules/game-view/play-area/play-area.component';
import { PlayerAIComponent } from '@app/modules/game-view/player-ai/player-ai.component';
import { ScrabbleBoardComponent } from '@app/modules/game-view/scrabble-board/scrabble-board.component';
import { SidebarComponent } from '@app/modules/game-view/sidebar/sidebar.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { SharedModule } from '@app/modules/shared/shared/shared.module';
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
