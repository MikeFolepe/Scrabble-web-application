import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { ChatBoxComponent } from '@app/modules/game-view/components/chatbox/chatbox.component';
import { PlayAreaComponent } from '@app/modules/game-view/components/play-area/play-area.component';
import { SidebarComponent } from '@app/modules/game-view/components/sidebar/sidebar.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { SharedModule } from '@app/modules/shared/shared/shared.module';
import { FontSizeComponent } from './components/font-size/font-size.component';
import { GameViewComponent } from './components/game-view/game-view.component';
import { InformationPanelComponent } from './components/information-panel/information-panel.component';
import { LetterEaselComponent } from './components/letter-easel/letter-easel.component';
import { PlaceLetterComponent } from './components/place-letter/place-letter.component';
import { PlayerAIComponent } from './components/player-ia/player-ia.component';
import { ScrabbleBoardComponent } from './components/scrabble-board/scrabble-board.component';
import { SwapLetterComponent } from './components/swap-letter/swap-letter.component';
@NgModule({
    declarations: [
        GameViewComponent,
        ScrabbleBoardComponent,
        InformationPanelComponent,
        LetterEaselComponent,
        PlayAreaComponent,
        SidebarComponent,
        ChatBoxComponent,
        PlaceLetterComponent,
        FontSizeComponent,
        PlayerAIComponent,
        SwapLetterComponent,
    ],
    imports: [CommonModule, AppMaterialModule, AppRoutingModule, FormsModule, SharedModule],
    exports: [GameViewComponent],
    bootstrap: [GameViewComponent],
})
export class GameViewModule {}
