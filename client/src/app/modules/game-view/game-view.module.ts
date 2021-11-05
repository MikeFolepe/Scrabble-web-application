import { AppMaterialModule } from '@app/modules/material.module';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { ChatboxComponent } from '@app/modules/game-view/chatbox/chatbox.component';
import { CommonModule } from '@angular/common';
import { FontSizeComponent } from '@app/modules/game-view/font-size/font-size.component';
import { FormsModule } from '@angular/forms';
import { GameViewComponent } from '@app/modules/game-view/game-view/game-view.component';
import { InformationPanelComponent } from '@app/modules/game-view/information-panel/information-panel.component';
import { LetterEaselComponent } from '@app/modules/game-view/letter-easel/letter-easel.component';
import { NgModule } from '@angular/core';
import { PlayAreaComponent } from '@app/modules/game-view/play-area/play-area.component';
import { PlayerAIComponent } from '@app/modules/game-view/player-ai/player-ai.component';
import { ScrabbleBoardComponent } from '@app/modules/game-view/scrabble-board/scrabble-board.component';
import { SharedModule } from '@app/modules/shared/shared.module';

@NgModule({
    declarations: [
        GameViewComponent,
        ScrabbleBoardComponent,
        InformationPanelComponent,
        LetterEaselComponent,
        PlayAreaComponent,
        PlayerAIComponent,
        FontSizeComponent,
        ChatboxComponent,
    ],
    imports: [CommonModule, AppMaterialModule, AppRoutingModule, FormsModule, SharedModule],
    exports: [GameViewComponent, PlayerAIComponent],
    bootstrap: [GameViewComponent],
})
export class GameViewModule {}
