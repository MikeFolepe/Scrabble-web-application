/* eslint-disable no-invalid-this */
import { Injectable } from '@angular/core';
import { ONE_SECOND_TIME } from '@app/classes/constants';
import { ClientSocketService } from '@app/services/client-socket.service';
import { EndGameService } from '@app/services/end-game.service';
import { GameSettingsService } from './game-settings.service';

@Injectable({
    providedIn: 'root',
})
export class SkipTurnService {
    isTurn: boolean;
    minutes: number;
    seconds: number;
    // eslint-disable-next-line no-undef
    intervalID: NodeJS.Timeout;
    private playAiTurn: () => void;

    constructor(public gameSettingsService: GameSettingsService, public endGameService: EndGameService, private clientSocket: ClientSocketService) {}

    bindAiTurn(fn: () => void) {
        this.playAiTurn = fn;
    }

    switchTurn(): void {
        if (this.endGameService.isEndGame) {
            return;
        }
        this.stopTimer();
        if (this.gameSettingsService.isSoloMode) {
            setTimeout(() => {
                if (this.isTurn) {
                    this.isTurn = false;
                    this.startTimer();
                    this.playAiTurn();
                } else {
                    this.isTurn = true;
                    this.startTimer();
                }
            }, ONE_SECOND_TIME);
        } else {
            this.clientSocket.socket.emit('switchTurn', this.isTurn, this.clientSocket.roomId);
            setTimeout(() => {
                this.clientSocket.socket.on('turnSwitched', (turn: boolean) => {
                    this.isTurn = turn;
                });
            }, 500);
        }
    }

    startTimer(): void {
        if (this.endGameService.isEndGame) {
            this.stopTimer();
            return;
        }
        this.minutes = parseInt(this.gameSettingsService.gameSettings.timeMinute, 10);
        this.seconds = parseInt(this.gameSettingsService.gameSettings.timeSecond, 10);
        this.intervalID = setInterval(() => {
            if (this.seconds === 0 && this.minutes !== 0) {
                this.minutes = this.minutes - 1;
                this.seconds = 59;
            } else if (this.seconds === 0 && this.minutes === 0) {
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
        this.minutes = 0;
        this.seconds = 0;
    }
}
