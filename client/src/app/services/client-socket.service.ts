import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GameSettingsService } from '@app/services/game-settings.service';
import { GameSettings } from '@common/game-settings';
import { Room } from '@common/room';
import { io, Socket } from 'socket.io-client';
// import { io, Socket } from 'node_modules/socket.io-client/build/esm';
@Injectable({
    providedIn: 'root',
})

// All methods for recepting the game commands from the server are defined here
export class ClientSocketService {
    socket: Socket;
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

    goToMainMenu(): void {
        this.socket.on('goToMainMenu', () => {
            this.router.navigate(['home']);
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
}
