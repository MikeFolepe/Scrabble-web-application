import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameSettingsService } from '@app/services/game-settings.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    selectedGameIndex: number;
    selectedMode?: string;
    readonly games: string[];
    readonly modes: string[];

    constructor(public gameSettingsService: GameSettingsService, private routing: Router) {
        this.selectedGameIndex = 0;
        this.games = ['Scrabble classique', 'Scrabble LOG2990'];
        this.modes = ['Jouer une partie en solo', 'Créer une partie multijoueur', 'Joindre une partie multijoueur'];
    }

    setGameMode() {
        if (this.selectedMode === this.modes[0]) {
            this.gameSettingsService.isSoloMode = true;
            this.routing.navigate(['solo-game-ai']);
        }
        if (this.selectedMode === this.modes[1]) {
            this.gameSettingsService.isSoloMode = false;
            this.routing.navigate(['multiplayer-mode']);
        }
        if (this.selectedMode === this.modes[2]) {
            this.routing.navigate(['join-room']);
        }
    }
    resetRadios() {
        this.selectedMode = undefined;
    }
}
