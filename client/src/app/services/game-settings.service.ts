import { GameSettings, StartingPlayer } from '@common/game-settings';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class GameSettingsService {
<<<<<<< HEAD
    gameSettings: GameSettings;

    // initializeSettings(settings: GameSettings) {
    //     this.gameSettings = settings;
    // }

    // getSettings(): GameSettings {
    //     return this.gameSettings;
    // }
=======
    gameSettings: GameSettings = {
        playersName: ['', ''],
        startingPlayer: StartingPlayer.Player1,
        timeMinute: '01',
        timeSecond: '00',
        level: 'Facile',
        randomBonus: 'Non',
        dictionary: '',
    };
    isSoloMode: boolean;
    isRedirectedFromMultiplayerGame: boolean;
>>>>>>> b7bc76bb223ef4674011ed696c8d797922f78013
}
