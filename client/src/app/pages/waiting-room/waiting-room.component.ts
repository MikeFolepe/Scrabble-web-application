/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Component, OnInit } from '@angular/core';
import { ClientSocketService } from '@app/services/client-socket.service';
import { GameSettingsService } from '@app/services/game-settings.service';
import { PlayerIndex } from '@common/PlayerIndex';
import { Router } from '@angular/router';

// TODO: enlever tout les string et les temps
@Component({
    selector: 'app-waiting-room',
    templateUrl: './waiting-room.component.html',
    styleUrls: ['./waiting-room.component.scss'],
})
export class WaitingRoomComponent implements OnInit {
    status: string;
    isWaiting: boolean;

    constructor(private router: Router, private gameSettingsService: GameSettingsService, private clientSocket: ClientSocketService) {
        this.status = '';
        this.isWaiting = false;
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
        if (this.gameSettingsService.gameSettings.playersName[PlayerIndex.OWNER] === '') {
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

    delete() {
        this.clientSocket.socket.emit('deleteGame', this.clientSocket.roomId);
    }

    route() {
        this.gameSettingsService.isSoloMode = true;
        this.gameSettingsService.isRedirectedFromMultiplayerGame = true;
        this.delete();
        this.router.navigate(['solo-game-ai']);
    }
}
