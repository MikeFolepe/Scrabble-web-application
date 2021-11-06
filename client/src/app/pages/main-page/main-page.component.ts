import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameSettingsService } from '@app/services/game-settings.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    selectedGameTypeIndex: number;
    selectedGameMode?: string;
    readonly gameTypes: string[];
    readonly gameModes: string[];

    constructor(public gameSettingsService: GameSettingsService, private router: Router) {
        this.selectedGameTypeIndex = 0;
        this.gameTypes = ['Scrabble classique', 'Scrabble LOG2990'];
        this.gameModes = ['Jouer une partie en solo', 'Créer une partie multijoueur', 'Joindre une partie multijoueur'];
    }

    routeToGameMode(): void {
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
