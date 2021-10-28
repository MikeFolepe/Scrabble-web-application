import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientSocketService } from '@app/services/client-socket.service';
import { GameSettingsService } from '@app/services/game-settings.service';
@Component({
    selector: 'app-waiting-room',
    templateUrl: './waiting-room.component.html',
    styleUrls: ['./waiting-room.component.scss'],
})
export class WaitingRoomComponent implements OnInit {
    status: string;
    isWaiting: boolean;

    constructor(private router: Router, public gameSettingsService: GameSettingsService, public clientSocket: ClientSocketService) {
        this.status = '';
        this.isWaiting = false;
        this.clientSocket.route();
    }

    ngOnInit() {
        this.clientSocket.socket.connect();

        setTimeout(() => {
            this.status = 'Connexion au serveur...';
            this.isWaiting = true;
        }, 500);

        setTimeout(() => {
            if (this.gameSettingsService.gameSettings.playersName[0] === '') {
                setTimeout(() => {
                    this.status = 'Une erreur est survenu';
                }, 1000);
                this.router.navigate(['home']);
                return;
            }

            if (this.clientSocket.socket.connected) {
                this.status = 'Connexion réussie';
                this.isWaiting = true;
                setTimeout(() => {
                    this.status = 'En attente de joueur...';
                }, 3500);
                this.clientSocket.socket.emit('createRoom', this.gameSettingsService.gameSettings);
            } else {
                this.status = 'Erreur de connexion...veuillez réessayer';
                this.isWaiting = false;
            }
        }, 4000);
    }

    delete(roomId: string) {
        this.clientSocket.socket.emit('cancelMultiplayerparty', roomId);
    }

    route() {
        this.gameSettingsService.isSoloMode = true;
        this.gameSettingsService.isRedirectedFromMultiplayerGame = true;
        this.router.navigate(['solo-game-ai']);
    }
}
