import { Injectable } from '@angular/core';
import { GameSettings, StartingPlayer } from '@app/classes/game-settings';

@Injectable({
    providedIn: 'root',
})
export class GameSettingsService {
    gameSettings: GameSettings = new GameSettings(['player1', 'player2'], StartingPlayer.Player1, '00', '30', 'facile', false, 'français');

    initializeSettings(settings: GameSettings) {
        this.gameSettings = settings;
    }

    getSettings(): GameSettings {
        return this.gameSettings;
    }
}
