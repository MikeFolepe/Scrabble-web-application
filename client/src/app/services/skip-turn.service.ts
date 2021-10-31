<<<<<<< HEAD
/* eslint-disable no-invalid-this */
import { Injectable } from '@angular/core';
import { ONE_SECOND_TIME } from '@app/classes/constants';
import { EndGameService } from '@app/services/end-game.service';
import { io } from 'node_modules/socket.io-client/build/esm';
import { GameSettingsService } from './game-settings.service';
//import { ClientSocketService } from './client-socket.service';
=======
/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { ONE_SECOND_TIME } from '@app/classes/constants';
import { EndGameService } from '@app/services/end-game.service';
import { GameSettingsService } from './game-settings.service';
>>>>>>> b7bc76bb223ef4674011ed696c8d797922f78013

@Injectable({
    providedIn: 'root',
})
export class SkipTurnService {
<<<<<<< HEAD
    socket: any;
    private urlString: string;
=======
>>>>>>> b7bc76bb223ef4674011ed696c8d797922f78013
    isTurn: boolean;
    minutes: number;
    seconds: number;
    // eslint-disable-next-line no-undef
    intervalID: NodeJS.Timeout;
    private playAiTurn: () => void;
<<<<<<< HEAD
    constructor(public gameSettingsService: GameSettingsService, public endGameService: EndGameService, /*public socketService: ClientSocketService*/) {
        this.urlString = `http://${window.location.hostname}:3000`;
        this.socket = io(this.urlString);

    }
=======

    constructor(public gameSettingsService: GameSettingsService, public endGameService: EndGameService) {}
>>>>>>> b7bc76bb223ef4674011ed696c8d797922f78013

    bindAiTurn(fn: () => void) {
        this.playAiTurn = fn;
    }

    switchTurn(): void {
        if (this.endGameService.isEndGame) {
            return;
        }
<<<<<<< HEAD
        //this.stopTimer();
        // this.minutes = parseInt(this.gameSettingsService.gameSettings.timeMinute, 10);
        // this.seconds = parseInt(this.gameSettingsService.gameSettings.timeSecond, 10);
        setTimeout(() => {
            if (this.isTurn) {
                this.isTurn = false;
                this.socket.emit('startTimer');
                this.playAiTurn();
            } else {
                this.isTurn = true;
                this.socket.emit('startTimer');
=======
        this.stopTimer();
        setTimeout(() => {
            if (this.isTurn) {
                this.isTurn = false;
                this.startTimer();
                this.playAiTurn();
            } else {
                this.isTurn = true;
                this.startTimer();
>>>>>>> b7bc76bb223ef4674011ed696c8d797922f78013
            }
        }, ONE_SECOND_TIME);
    }

    startTimer(): void {
<<<<<<< HEAD
        this.minutes = 0;
        this.seconds = 10;
        this.socket.emit('startTimer');
        // this.minutes = parseInt(this.gameSettingsService.gameSettings.timeMinute, 10);
        // this.seconds = parseInt(this.gameSettingsService.gameSettings.timeSecond, 10);
        this.socket.on('clock', ()=> {
            if (this.endGameService.isEndGame) {
                this.minutes = 0;
                this.seconds = 0;
                //this.stopTimer();
                return;
            }
            //this.intervalID = setInterval(() => {
=======
        if (this.endGameService.isEndGame) {
            this.stopTimer();
            return;
        }
        this.minutes = parseInt(this.gameSettingsService.gameSettings.timeMinute, 10);
        this.seconds = parseInt(this.gameSettingsService.gameSettings.timeSecond, 10);
        this.intervalID = setInterval(() => {
>>>>>>> b7bc76bb223ef4674011ed696c8d797922f78013
            if (this.seconds === 0 && this.minutes !== 0) {
                this.minutes = this.minutes - 1;
                this.seconds = 59;
            } else if (this.seconds === 0 && this.minutes === 0) {
<<<<<<< HEAD
                this.socket.emit('stopTimer');
                //this.stopTimer();
                // Do not touch to setTimeout, it's gonna break everything
            } else {
                this.seconds = this.seconds - 1;
            }
            //}, ONE_SECOND_TIME);
        });
        
        this.socket.on('switchTurn', () => {
            setTimeout(() => {
                this.switchTurn();
            }, ONE_SECOND_TIME);
        });
    }
    // stopTimer(): void {
        //     //this.socketService.socket.emit('stopTimer', this.minutes, this.seconds);
        //     this.minutes = 0;
        //     this.seconds = 0;
        //     this.socket.emit('stopTimer');
        //     //clearInterval(this.intervalID);
        // }

=======
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
        this.minutes = 0;
        this.seconds = 0;
    }
>>>>>>> b7bc76bb223ef4674011ed696c8d797922f78013
}
