import { Injectable } from '@angular/core';
import { GameSettings } from '@app/classes/game-settings';

@Injectable({
    providedIn: 'root',
})
export class GameSettingsService {
    gameSettings: GameSettings;
    isSoloMode: boolean;
    isRandomMode: boolean;

    initializeSettings(settings: GameSettings) {
        this.gameSettings = settings;
    }

    getSettings(): GameSettings {
        return this.gameSettings;
    }
}
