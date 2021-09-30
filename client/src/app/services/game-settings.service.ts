import { Injectable } from '@angular/core';
import { GameSettings } from '@app/classes/game-settings';

@Injectable({
    providedIn: 'root',
})
export class GameSettingsService {
    gameSettings: GameSettings;

    initializeSettings(settings: GameSettings) {
        this.gameSettings = settings;
        // this.emitGameSettings();
    }

    getSettings(): GameSettings {
        return this.gameSettings;
    }
}
