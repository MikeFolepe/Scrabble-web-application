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
