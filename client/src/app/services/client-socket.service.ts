/* eslint-disable @typescript-eslint/no-explicit-any */
// Explication: Afin d'avoir le type any associé à la variable socket
import { Injectable } from '@angular/core';
import { io } from 'node_modules/socket.io-client/build/esm';
import { GameSettingsService } from './game-settings.service';

@Injectable({
    providedIn: 'root',
})
export class ClientSocketService {
    isConnected: boolean;
    isStartedWaiting: boolean;
    private urlString: string;
    private socket: any;
    message: string;
    constructor(private gameSettingsService: GameSettingsService) {
        this.urlString = `http://${window.location.hostname}:3000`;
        this.socket = io(this.urlString);
    }

    socketHandler(): void {
        this.socket.on('connect', () => {
            // this.message = 'Connexion au serveur...';

            setTimeout(() => {
                if (!this.socket.connected) {
                    this.message = 'Echec de connexion...veuillez réessayer';
                    return;
                }
            }, 3000);

            this.message = 'Connexion réussie';

            setTimeout(() => {
                this.socket.emit('createRoom', this.gameSettingsService.gameSettings);
                this.message = "En attente d'un joueur...";
                this.isStartedWaiting = true;
            }, 3000);

            // console.log(this.socket.id);
        });
    }
}
