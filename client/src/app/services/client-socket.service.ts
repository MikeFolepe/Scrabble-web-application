/* eslint-disable sort-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Explication: Afin d'avoir le type any associé à la variable socket
import { GameSettings } from '@common/game-settings';
import { Injectable } from '@angular/core';
import { io } from 'node_modules/socket.io-client/build/esm';
import { GameSettingsService } from '@app/services/game-settings.service';
import { Room } from '@common/room';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class ClientSocketService {
    // TODO À cheker pour le type de socket
    socket: any;
    rooms: Room[] = [];
    roomId: string;
    private router: Router;
    private urlString: string;

    constructor(private gameSettingsService: GameSettingsService) {
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

    delete() {
        this.socket.emit('deleteGame', this.roomId);
    }

    // les methodes de reception des commandes de jeu sont définies ici
}
