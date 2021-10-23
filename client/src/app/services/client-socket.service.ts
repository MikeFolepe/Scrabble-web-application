/* eslint-disable no-restricted-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Explication: Afin d'avoir le type any associé à la variable socket
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { io } from 'node_modules/socket.io-client/build/esm';
import { GameSettings } from '../classes/game-settings';
import { Room } from '../classes/room';
import { GameSettingsService } from './game-settings.service';

@Injectable({
    providedIn: 'root',
})
export class ClientSocketService {
    socket: any;
    rooms: Room[] = [];
    private urlString: string;

    constructor(private router: Router, private gameSettingsService: GameSettingsService) {
        this.urlString = `http://${window.location.hostname}:3000`;
        this.socket = io(this.urlString);
    }

    route() {
        this.socket.on('goToGameView', (gameSettings: GameSettings) => {
            this.gameSettingsService.gameSettings = gameSettings;
            this.router.navigate(['game']);
        });
    }
}
