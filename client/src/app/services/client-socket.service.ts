/* eslint-disable no-restricted-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Explication: Afin d'avoir le type any associé à la variable socket
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { io } from 'node_modules/socket.io-client/build/esm';
//import { GameSettings } from '../classes/game-settings';
//import { GameSettingsService } from './game-settings.service';
import { SkipTurnService } from './skip-turn.service';

@Injectable({
    providedIn: 'root',
})
export class ClientSocketService{
    socket: any;
    roomId: string;
    time: string;
    private urlString: string;

    constructor(private router: Router, /*private gameSettingsService: GameSettingsService,*/ private skipTurnService: SkipTurnService) {
        this.urlString = `http://${window.location.hostname}:3000`;
        this.socket = io(this.urlString);
    }

    route() {
        this.socket.on('goToGameView', () => {
            console.log("gone to game view client");
            //this.gameSettingsService.gameSettings = gameSettings;
            this.router.navigate(['game']); 
        });

        this.socket.on('switchTurn', () => {
            console.log("client has switched turn");
            this.skipTurnService.switchTurn();
        });
    }
}
