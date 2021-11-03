import { Component } from '@angular/core';
import { GameSettingsService } from '@app/services/game-settings.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    selectedGameTypeIndex = 0;
    selectedGameMode?: string;
    readonly gameTypes = ['Scrabble classique', 'Scrabble LOG2990'];
    readonly gameModes = ['Jouer une partie en solo', 'Créer une partie multijoueur', 'Joindre une partie multijoueur'];

    constructor(public gameSettingsService: GameSettingsService, private router: Router) {}

    route(): void {
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
