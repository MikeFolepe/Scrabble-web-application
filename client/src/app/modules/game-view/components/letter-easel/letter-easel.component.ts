import { Component, OnInit } from '@angular/core';
import { LetterEasel } from '@app/classes/letter-easel';
import { EASEL_SIZE } from '@app/classes/constants';
import {LetterService} from '@app/services/letter.service'
import { GameSettingsService } from '@app/services/game-settings.service';
import { StartingPlayer } from '@app/classes/game-settings';
@Component({
    selector: 'app-letter-easel',
    templateUrl: './letter-easel.component.html',
    styleUrls: ['./letter-easel.component.scss'],
})
export class LetterEaselComponent implements OnInit {
    letterEaselTab: LetterEasel[] = [];
    fontSize: number;
   
    constructor(private gameSettings: GameSettingsService, private letterService: LetterService) {}

    ngOnInit(): void {
        this.initializeTab();
        this.fontSize= this.letterService.getFontSize();
    }

    initializeTab(): void {
        for (let i = 0; i < EASEL_SIZE; i++) {
            this.letterEaselTab[i] = this.gameSettings.players[StartingPlayer.Player1].letterTable[i];
        }
    }
    
    setFontSize(fontSize:number){
        this.letterService.setFontSize(fontSize);
    }
}
