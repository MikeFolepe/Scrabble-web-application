/* eslint-disable @typescript-eslint/no-magic-numbers */
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
    router: Router;

    constructor(public gameSettingsService: GameSettingsService, public clientSocket: ClientSocketService) {
        this.clientSocket.route();
    }

    ngOnInit() {
        this.playAnimation();
    }

    playAnimation() {
        const startMessage = 'Connexion au serveur...';
        this.waitBeforeChangeStatus(500, startMessage);
        this.clientSocket.socket.connect();
        setTimeout(() => {
            this.handleReloadErrors();

            if (this.clientSocket.socket.connected) {
                const connexionSuccess = 'Connexion réussie';
                this.isWaiting = true;
                this.waitBeforeChangeStatus(0, connexionSuccess);
                const waitingMessage = 'En attente de joueur...';
                this.waitBeforeChangeStatus(2000, waitingMessage);
                this.clientSocket.socket.emit('createRoom', this.gameSettingsService.gameSettings);
            } else {
                this.status = 'Erreur de connexion...veuillez réessayer';
                this.isWaiting = false;
            }
        }, 2000);
    }

    handleReloadErrors() {
        if (this.gameSettingsService.gameSettings.playersName[0] === '') {
            const errorMessage = 'Une erreur est survenue';
            this.waitBeforeChangeStatus(1000, errorMessage);
            this.router.navigate(['home']);
            return;
        }
    }

    waitBeforeChangeStatus(waitingTime: number, message: string) {
        setTimeout(() => {
            this.status = message;
        }, waitingTime);
    }

    delete(): void {
        this.clientSocket.socket.emit('cancelMultiplayerparty', this.gameSettingsService.gameSettings);
        console.log(this.clientSocket.socket.id);
    }

    route() {
        this.gameSettingsService.isSoloMode = true;
        this.gameSettingsService.isRedirectedFromMultiplayerGame = true;
        this.router.navigate(['solo-game-ai']);
        this.clientSocket.socket.emit('cancelMultiplayerparty', this.clientSocket.roomId);
    }
}
