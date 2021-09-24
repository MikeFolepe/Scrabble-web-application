import { Injectable } from '@angular/core';
import { GameSettings } from '@app/classes/game-settings';
import { Subject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class GameSettingsService {
    gameSettingsSubject = new Subject<GameSettings>();
    private gameSettings: GameSettings;
    emitGameSettings() {
        this.gameSettingsSubject.next(this.gameSettings);
    }
    initializeSettings(settings: GameSettings) {
        this.gameSettings = settings;
        this.emitGameSettings();
    }
}
