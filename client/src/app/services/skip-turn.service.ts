import { Injectable } from '@angular/core';
import { ONE_SECOND_DELAY, THREE_SECONDS_DELAY } from '@app/classes/constants';
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
    // JUSTIFICATION : Next line is mandatory, it is an eslint issue
    // eslint-disable-next-line no-undef
    intervalID: NodeJS.Timeout;
    private playAiTurn: () => void;

    constructor(public gameSettingsService: GameSettingsService, public endGameService: EndGameService, private clientSocket: ClientSocketService) {
        this.clientSocket.socket.on('turnSwitched', (turn: boolean) => {
            this.isTurn = turn;
        });
        this.clientSocket.socket.on('startTimer', () => {
            this.stopTimer();
            this.startTimer();
        });
    }
    bindAiTurn(fn: () => void) {
        this.playAiTurn = fn;
    }

    switchTurn(): void {
        // console.log('Switching TURN');
        if (this.endGameService.isEndGame) {
            return;
        }
        this.stopTimer();
        setTimeout(() => {
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
                }, ONE_SECOND_DELAY);
            } else {
                this.clientSocket.socket.emit('switchTurn', this.isTurn, this.clientSocket.roomId);
                this.isTurn = false;
            }
        }, THREE_SECONDS_DELAY);
    }

    startTimer(): void {
        if (this.endGameService.isEndGame) {
            this.stopTimer();
            return;
        }
        this.minutes = parseInt(this.gameSettingsService.gameSettings.timeMinute, 10);
        this.seconds = parseInt(this.gameSettingsService.gameSettings.timeSecond, 10);
        clearInterval(this.intervalID);
        this.intervalID = setInterval(() => {
            if (this.seconds === 0 && this.minutes !== 0) {
                this.minutes = this.minutes - 1;
                this.seconds = 59;
            } else if (this.seconds === 0 && this.minutes === 0) {
                if (this.isTurn) {
                    this.switchTurn();
                }
            } else {
                this.seconds = this.seconds - 1;
            }
        }, ONE_SECOND_DELAY);
    }

    stopTimer(): void {
        clearInterval(this.intervalID);
        this.minutes = 0;
        this.seconds = 0;
    }
}
