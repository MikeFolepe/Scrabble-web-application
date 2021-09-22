/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { GameSettings, StartingPlayer } from '@app/classes/gameSettings';

@Injectable({
    providedIn: 'root',
})
export class GameSettingsService {
    gameSettings_: GameSettings;
    iaNameDatabase: string[] = ['Mister_Bucky', 'Mister_Samy', 'Miss_Betty'];

    initRandomIAName() {
        // Number of seconds since 1st january 1970
        let randomNumber = new Date().getTime();
        // Multiplication by a random number [0,1[, which we get the floor
        randomNumber = Math.floor(Math.random() * randomNumber);
        // Random value [0, iaNameDatabase.length[
        return this.iaNameDatabase[randomNumber % this.iaNameDatabase.length];
    }

    initStartingPlayer() {
        // Enum length
        const enumLength = Object.keys(StartingPlayer).length;
        // Number of seconds since 1st january 1970
        let randomNumber = new Date().getTime();
        // Multiplication by a random number [0,1[, which we get the floor
        randomNumber = Math.floor(Math.random() * randomNumber);
        // Random value [0, enum.length[
        return randomNumber % enumLength;
    }

    setGameSettings(playerNameEntry: string, minute: string, second: string, level: string, randomBonus: boolean, dictionaryLanguage: string) {
        let iaNameGenerated;
        do {
            iaNameGenerated = this.initRandomIAName();
        } while (playerNameEntry === iaNameGenerated);

        this.gameSettings_ = {
            playerName: playerNameEntry,
            iaName: iaNameGenerated,
            startingPlayer: this.initStartingPlayer(),
            timeMinute: minute,
            timeSecond: second,
            level,
            randomBonus,
            dictionary: dictionaryLanguage,
        };
    }
}
