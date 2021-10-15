import { Component } from '@angular/core';
import { GameSettingsService } from '@app/services/game-settings.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    selectedGameIndex: number = 0;
    selectedMode?: string;
    readonly games: string[] = ['Scrabble classique', 'Scrabble LOG2990'];
    readonly modes: string[] = ['Jouer une partie en solo', 'Créer une partie multijoueur', 'Joindre une partie multijoueur'];

    constructor(public gameSettingsService: GameSettingsService) {}
    setGameMode() {
        if (this.selectedMode === this.modes[0]) {
            this.gameSettingsService.isSoloMode = true;
        }
        if (this.selectedMode === this.modes[1]) {
            this.gameSettingsService.isSoloMode = false;
        }
    }
    resetRadios() {
        this.selectedMode = undefined;
    }
}
