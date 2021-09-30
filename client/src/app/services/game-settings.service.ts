import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GameSettings } from '@app/classes/game-settings';

@Injectable({
    providedIn: 'root',
})
export class GameSettingsService {
    gameSettingsSubject = new Subject<GameSettings>();
    private gameSettings: GameSettings;

    constructor(){}

    emitGameSettings() {
        this.gameSettingsSubject.next(this.gameSettings);
    }
    
    initializeSettings(settings: GameSettings) {
        this.gameSettings = settings;
        this.emitGameSettings();
    }
}
