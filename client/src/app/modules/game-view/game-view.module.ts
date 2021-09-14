import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GameViewComponent } from './components/game-view/game-view.component';
import { InformationPannelComponent } from './components/information-pannel/information-pannel.component';
import { LetterEaselComponent } from './components/letter-easel/letter-easel.component';
import { ScrabbleBoardComponent } from './components/scrabble-board/scrabble-board.component';

@NgModule({
  declarations: [
    GameViewComponent,
    ScrabbleBoardComponent,
    InformationPannelComponent,
    LetterEaselComponent
  ],
  imports: [
    CommonModule
  ]
})
export class GameViewModule {}
