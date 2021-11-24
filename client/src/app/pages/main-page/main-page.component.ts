import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientSocketService } from '@app/services/client-socket.service';
import { EndGameService } from '@app/services/end-game.service';
import { GameSettingsService } from '@app/services/game-settings.service';
import { GameType } from '@common/game-type';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
    selectedGameTypeIndex: number;
    selectedGameType: string | GameType;
    selectedGameMode?: string;
    readonly gameType: GameType[];
    readonly gameModes: string[];

    constructor(
        public gameSettingsService: GameSettingsService,
        private router: Router,
        private clientSocketService: ClientSocketService,
        private endGameService: EndGameService,
    ) {
        this.selectedGameTypeIndex = 0;
        this.gameType = [GameType.Classic, GameType.Log2990];
        this.gameModes = ['Jouer une partie en solo', 'Créer une partie multijoueur', 'Joindre une partie multijoueur'];
    }

    ngOnInit() {
        this.clientSocketService.socket.disconnect();
        this.endGameService.clearAllData();
    }

    routeToGameMode(): void {
        // update game type and game mode, then route
        this.selectedGameType = this.gameType[this.selectedGameTypeIndex];
        this.gameSettingsService.gameType = this.selectedGameType as GameType;
        switch (this.selectedGameMode) {
            case this.gameModes[0]: {
                this.gameSettingsService.isSoloMode = true;
                this.router.navigate(['solo-game-ai']);
                break;
            }
            case this.gameModes[1]: {
                this.gameSettingsService.isSoloMode = false;
                this.router.navigate(['multiplayer-mode']);
                break;
            }
            case this.gameModes[2]: {
                this.router.navigate(['join-room']);
                break;
            }
        }
    }
}
