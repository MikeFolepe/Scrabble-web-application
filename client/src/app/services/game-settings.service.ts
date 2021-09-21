/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { GameSettings, StartingPlayer } from '@app/classes/gameSettings';

@Injectable({
    providedIn: 'root',
})
export class GameSettingsService {
    gameSettings_: GameSettings;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    IANameDatabase: string[] = ['Mister_Bucky', 'Mister_Samy', 'Miss_Betty'];
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor() {
        // do nothing
    }

    initRandomIAName() {
        return this.IANameDatabase[(Math.random() * Math.random()) % this.IANameDatabase.length];
    }

    initStartingPlayer() {
        const enumLength = Object.keys(StartingPlayer).length;
        return (Math.random() * Math.random()) % enumLength;
    }

    setGameSettings(playerName: string, minute: string, second: string, level: string, randomBonus: boolean, dictionaryLanguage: string) {
        this.gameSettings_.playerName = playerName;
        do {
            this.gameSettings_.IA_Name = this.initRandomIAName();
        } while (this.gameSettings_.playerName === this.gameSettings_.IA_Name);
        this.gameSettings_.startingPlayer = this.initStartingPlayer();
        this.gameSettings_.timeMinute = minute;
        this.gameSettings_.timeSecond = second;
        this.gameSettings_.level = level;
        this.gameSettings_.randomBonus = randomBonus;
        this.gameSettings_.dictionary = dictionaryLanguage;
    }
}
