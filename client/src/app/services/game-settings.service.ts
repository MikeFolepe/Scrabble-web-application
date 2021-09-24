/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { GameSettings, StartingPlayer } from '@app/classes/game-settings';
import { IA_NAME_DATABASE } from '@app/classes/constants';
import { Player } from '@app/classes/player';
@Injectable({
    providedIn: 'root',
})
export class GameSettingsService {
    gameSettings: GameSettings;
    initRandomIAName() {
        return IA_NAME_DATABASE[(Math.random() * Math.random()) % IA_NAME_DATABASE.length];
    }

    initStartingPlayer() {
        const enumLength = Object.keys(StartingPlayer).length;
        return (Math.random() * Math.random()) % enumLength;
    }

    setGameSettingsSolo(
        playerName: string,
        minute: string,
        second: string,
        level: string,
        randomBonus: boolean | undefined,
        dictionaryLanguage: string | undefined,
    ) {
        this.gameSettings.playersName = [playerName, this.initRandomIAName()];
        this.gameSettings.startingPlayer = this.initStartingPlayer();
        this.gameSettings.timeMinute = minute;
        this.gameSettings.timeSecond = second;
        this.gameSettings.level = level;
        this.gameSettings.randomBonus = randomBonus;
        this.gameSettings.dictionary = dictionaryLanguage;
    }

    set players(players: Player[]) {
        this.players = players;
    }

    startCountDown(){
        
    }
}
