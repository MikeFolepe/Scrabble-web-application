import { Injectable } from '@angular/core';
import { BONUS_POSITIONS } from '@app/classes/constants';
import { GameSettings, StartingPlayer } from '@common/game-settings';
import { GameType } from '@common/game-type';

@Injectable({
    providedIn: 'root',
})
export class GameSettingsService {
    gameSettings: GameSettings = {
        playersNames: ['', ''],
        startingPlayer: StartingPlayer.Player1,
        timeMinute: '01',
        timeSecond: '00',
        level: 'Facile', // TODO changer partout pour Débutant / Expert voire faire enum directement
        randomBonus: 'Désactiver',
        bonusPositions: JSON.stringify(Array.from(BONUS_POSITIONS)),
        dictionary: '',
        objectiveIds: [],
    };
    isSoloMode: boolean;
    gameDictionary: string[];
    gameType: GameType;
    isRedirectedFromMultiplayerGame: boolean;
}
