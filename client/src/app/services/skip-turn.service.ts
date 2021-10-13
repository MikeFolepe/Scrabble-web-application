/* eslint-disable no-invalid-this */
import { Injectable } from '@angular/core';
import { INDEX_PLAYER_IA, ONE_SECOND_TIME } from '@app/classes/constants';
import { PlayerIA } from '@app/models/player-ia.model';
import { GameSettingsService } from './game-settings.service';
import { PlayerService } from './player.service';

@Injectable({
    providedIn: 'root',
})
export class SkipTurnService {
    isTurn: boolean;
    minutes: number;
    seconds: number;
    // eslint-disable-next-line no-undef
    intervalID: NodeJS.Timeout;

    constructor(public gameSettingsService: GameSettingsService, private playerService: PlayerService) {}

    switchTurn(): void {
        this.stopTimer();
        setTimeout(() => {
            if (this.isTurn) {
                this.isTurn = false;
                this.startTimer();
                const aiPLayer = this.playerService.players[INDEX_PLAYER_IA] as PlayerIA;
                aiPLayer.play();
            } else {
                this.isTurn = true;
                this.startTimer();
            }
        }, ONE_SECOND_TIME);
    }

    startTimer(): void {
        this.minutes = parseInt(this.gameSettingsService.gameSettings.timeMinute, 10);
        this.seconds = parseInt(this.gameSettingsService.gameSettings.timeSecond, 10);
        this.intervalID = setInterval(() => {
            if (this.seconds === 0 && this.minutes !== 0) {
                this.minutes = this.minutes - 1;
                this.seconds = 59;
            } else if (this.seconds === 0 && this.minutes === 0) {
                this.stopTimer();
                // Do not touch to setTimeout, it's gonna break everything
                setTimeout(() => {
                    this.switchTurn();
                }, ONE_SECOND_TIME);
            } else {
                this.seconds = this.seconds - 1;
            }
        }, ONE_SECOND_TIME);
    }

    stopTimer(): void {
        clearInterval(this.intervalID);
    }
}
