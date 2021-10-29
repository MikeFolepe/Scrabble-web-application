import { Injectable } from '@angular/core';
import { GameSettings, StartingPlayer } from '@common/game-settings';

@Injectable({
    providedIn: 'root',
})
export class GameSettingsService {
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
}
