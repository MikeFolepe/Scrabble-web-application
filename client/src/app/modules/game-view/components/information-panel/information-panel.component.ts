import { Component, OnInit } from '@angular/core';
import { Player } from '@app/classes/player';
import { GameSettingsService } from '@app/services/game-settings.service';
import { Tour } from '@app/classes/tour';
import { StartingPlayer } from '@app/classes/game-settings';
import { EASEL_SIZE } from '@app/classes/constants';
import { LetterService } from '@app/services/letter.service';

@Component({
    selector: 'app-information-panel',
    templateUrl: './information-panel.component.html',
    styleUrls: ['./information-panel.component.scss'],
})
export class InformationPanelComponent implements OnInit {
    players: Player[] = [];
    tour: Tour;
    timeSecondes: number;
    timeMinutes: number;
    duration: number;

    interval: any;
    constructor(private gameSettingsService: GameSettingsService, private letterService: LetterService) {}
    ngOnInit(): void {
        this.displayInfoPanel();
        this.gameSettingsService.players = this.players;
    }

    initializePlayersSolo() {
        let id = 0;
        for (let i = 0; i < 2; i++) {
            this.players[i].id = id++;
            this.players[i].name = this.gameSettingsService.gameSettings.playersName[i];
            this.players[i].score = 0;
            for (let j = 0; j < EASEL_SIZE; j++) {
                this.players[i].letterTable[j] = this.letterService.getRandomLetter();
            }
        }
    }

    initializeStartingPlayer() {
        if (this.gameSettingsService.gameSettings.startingPlayer === StartingPlayer.Player1) {
            this.players[StartingPlayer.Player1].isTour = true;
            this.tour.activePlayer = this.players[StartingPlayer.Player1];
        } else {
            this.players[StartingPlayer.Player2].isTour = true;
            this.tour.activePlayer = this.players[StartingPlayer.Player2];
        }
    }
    initializeTime() {
        this.timeMinutes = Number(this.gameSettingsService.gameSettings.timeMinute);
        this.timeSecondes = Number(this.gameSettingsService.gameSettings.timeSecond);
        if (this.timeSecondes > 0) {
            this.duration = this.timeMinutes * 60000 + this.timeSecondes * 1000;
        } else{
            this.duration = this.timeMinutes * 60000;
        }
    }

    setIAPlayer() {
        this.players[StartingPlayer.Player1].isIA = false;
        this.players[StartingPlayer.Player2].isIA = true;
    }

    displayInfoPanel() {
        this.initializePlayersSolo();
        this.initializeStartingPlayer();
        this.initializeTime();
        this.setIAPlayer();
        console.log(this.players);
    }

    startTimer() {
        this.interval = setInterval(() => {
            if (this.timeMinutes > 0) {
                this.timeMinutes--;
                if (this.timeSecondes > 0) {
                    this.timeSecondes--;
                } else {
                    this.timeSecondes = 60;
                    this.timeSecondes--;
                }
            }
        }, this.duration);
    }
}
