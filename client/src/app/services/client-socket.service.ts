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
    roomId: string;
    private urlString: string;

    constructor(private router: Router, private gameSettingsService: GameSettingsService) {
        this.urlString = `http://${window.location.hostname}:3000`;
        this.socket = io(this.urlString);
        this.initializeRoomId();
        this.initializeGameSettings();
    }

    route(): void {
        this.socket.on('goToGameView', () => {
            this.router.navigate(['game']);
        });
    }

    initializeRoomId(): void {
        this.socket.on('yourRoomId', (roomIdFromServer: string) => {
            this.roomId = roomIdFromServer;
        });
    }

    initializeGameSettings(): void {
        this.socket.on('yourGameSettings', (gameSettingsFromServer: GameSettings) => {
            this.gameSettingsService.gameSettings = gameSettingsFromServer;
        });
    }

    // les methodes de reception des commandes de jeu sont définies ici
}
