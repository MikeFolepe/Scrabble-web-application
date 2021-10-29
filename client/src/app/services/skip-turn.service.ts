/* eslint-disable no-invalid-this */
import { Injectable } from '@angular/core';
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

    constructor(public gameSettingsService: GameSettingsService, public endGameService: EndGameService, private clientSocket: ClientSocketService) {
        this.switchTurn();
    }

    bindAiTurn(fn: () => void) {
        this.playAiTurn = fn;
    }

    switchTurn(): void {
        if (this.endGameService.isEndGame) {
            return;
        }
        this.stopTimer();
        this.clientSocket.socket.emit('switchTurn', this.clientSocket.roomId);
        setTimeout(() => {
            this.clientSocket.socket.on('turnSwitched', () => {
                this.isTurn = !this.isTurn;
            });
            this.startTimer();
            this.playAiTurn();
        }, 500);
    }

    startTimer(): void {
        if (this.endGameService.isEndGame) {
            this.stopTimer();
            return;
        }
        this.clientSocket.socket.emit('startTimer', this.clientSocket.roomId);
        this.minutes = parseInt(this.gameSettingsService.gameSettings.timeMinute, 10);
        this.seconds = parseInt(this.gameSettingsService.gameSettings.timeSecond, 10);
        console.log(this.minutes);
        console.log(this.seconds);

        this.clientSocket.socket.on('startClock', () => {
            if (this.seconds === 0 && this.minutes !== 0) {
                this.minutes = this.minutes - 1;
                this.seconds = 59;
            } else if (this.seconds === 0 && this.minutes === 0) {
                this.switchTurn();
            } else {
                this.seconds = this.seconds - 1;
            }
        });
    }

    stopTimer(): void {
        this.minutes = 0;
        this.seconds = 0;
    }
}
