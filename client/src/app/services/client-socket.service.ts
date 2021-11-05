import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GameSettingsService } from '@app/services/game-settings.service';
import { GameSettings } from '@common/game-settings';
import { Room } from '@common/room';
<<<<<<< HEAD
import { io, Socket } from 'socket.io-client';
// import { io, Socket } from 'node_modules/socket.io-client/build/esm';
=======
import { io, Socket } from 'node_modules/socket.io-client/build/esm';
>>>>>>> dcdd8de46b7e9c43ea2110be7ccda1e398e71373
@Injectable({
    providedIn: 'root',
})

// All methods for recepting the game commands from the server are defined here
export class ClientSocketService {
    socket: Socket;
    rooms: Room[] = [];
    roomId: string;
    private urlString: string;

    constructor(private gameSettingsService: GameSettingsService, private router: Router) {
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
}
