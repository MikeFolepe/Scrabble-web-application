import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { PlayAreaComponent } from '@app/modules/game-view/components/play-area/play-area.component';
import { SidebarComponent } from '@app/modules/game-view/components/sidebar/sidebar.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameViewComponent } from './components/game-view/game-view.component';
import { InformationPannelComponent } from './components/information-pannel/information-pannel.component';
import { LetterEaselComponent } from './components/letter-easel/letter-easel.component';
import { ScrabbleBoardComponent } from './components/scrabble-board/scrabble-board.component';
@NgModule({
    declarations: [GameViewComponent, ScrabbleBoardComponent, InformationPannelComponent, LetterEaselComponent, PlayAreaComponent, SidebarComponent],
    imports: [CommonModule, AppMaterialModule, AppRoutingModule],
    exports: [GameViewComponent],
    bootstrap: [GameViewComponent],
})
export class GameViewModule {}
