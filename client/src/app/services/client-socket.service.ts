import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GameSettingsService } from '@app/services/game-settings.service';
import { GameSettings } from '@common/game-settings';
import { Room } from '@common/room';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment.prod';
@Injectable({
    providedIn: 'root',
})
export class ClientSocketService {
    socket: Socket;
    rooms: Room[];
    roomId: string;
    private url: string;

    constructor(private gameSettingsService: GameSettingsService, private router: Router) {
        this.url = environment.serverUrl;
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
