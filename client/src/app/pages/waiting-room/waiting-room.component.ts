/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-useless-constructor */
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
    constructor(private router: Router, public gameSettingsService: GameSettingsService, public clientSocket: ClientSocketService) {
        this.clientSocket.socketHandler();
    }

    ngOnInit() {
        return;
    }

    route() {
        this.gameSettingsService.isSoloMode = true;
        this.gameSettingsService.isRedirectedFromMultiplayerGame = true;
        this.router.navigate(['solo-game-ai']);
    }
}
