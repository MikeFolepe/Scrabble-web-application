import { GameSettings, StartingPlayer } from '@common/game-settings';
import { Injectable } from '@angular/core';

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
