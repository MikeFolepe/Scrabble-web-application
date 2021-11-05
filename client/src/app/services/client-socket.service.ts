import { Socket, io } from 'node_modules/socket.io-client/build/esm';
import { GameSettings } from '@common/game-settings';
import { GameSettingsService } from '@app/services/game-settings.service';
import { Injectable } from '@angular/core';
import { Room } from '@common/room';
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root',
})

// All methods for recepting the game commands from the server are defined here
export class ClientSocketService {
    socket: Socket;
    rooms: Room[] = [];
    roomId: string;
    private urlString: string;

    constructor(private router: Router, private gameSettingsService: GameSettingsService) {
        this.urlString = `http://${window.location.hostname}:3000`;
        this.socket = io(this.urlString);
        this.initializeRoomId();
        this.initializeGameSettings();
        this.route();
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
}
