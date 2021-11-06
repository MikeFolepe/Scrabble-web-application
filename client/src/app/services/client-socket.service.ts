import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GameSettingsService } from '@app/services/game-settings.service';
import { GameSettings } from '@common/game-settings';
import { Room } from '@common/room';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root',
})
export class ClientSocketService {
    socket: Socket;
    rooms: Room[];
    roomId: string;
    private url: string;

    constructor(private gameSettingsService: GameSettingsService, private router: Router) {
        // the line below will connect the client to the deployed server
        this.url = environment.serverUrl;

        // Decomment the line below to connect on the local server
        // this.url = `http://${window.location.hostname}:3000`;
        this.socket = io(this.url);
        this.initializeRoomId();
        this.initializeGameSettings();
        this.routeToGameView();
    }

    routeToGameView(): void {
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
