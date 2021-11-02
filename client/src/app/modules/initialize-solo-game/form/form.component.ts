/* eslint-disable sort-imports */
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AI_NAME_DATABASE, BONUS_POSITIONS } from '@app/classes/constants';
import { GameSettingsService } from '@app/services/game-settings.service';
import { GameSettings, StartingPlayer } from '@common/game-settings';
import { RandomBonusesService } from '@app/services/random-bonuses.service';
@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnDestroy {
    form: FormGroup;

    constructor(public gameSettingsService: GameSettingsService, private router: Router, private randomBonusService: RandomBonusesService) {
        this.form = new FormGroup({
            playerName: new FormControl(this.gameSettingsService.gameSettings.playersName[0]),
            minuteInput: new FormControl(this.gameSettingsService.gameSettings.timeMinute),
            secondInput: new FormControl(this.gameSettingsService.gameSettings.timeSecond),
            levelInput: new FormControl(this.gameSettingsService.gameSettings.level),
            randomBonus: new FormControl(this.gameSettingsService.gameSettings.randomBonus),
        });
    }

    // Generates a random name for the AI
    chooseRandomAIName(): string {
        let randomName: string;
        do {
            // Number of seconds since 1st january 1970
            let randomNumber = new Date().getTime();
            // Multiplication by a random number [0,1[, which we get the floor
            randomNumber = Math.floor(Math.random() * randomNumber);
            // Random value [0, aiNameDatabase.length[
            randomName = AI_NAME_DATABASE[randomNumber % AI_NAME_DATABASE.length];
        } while (randomName === this.form.controls.playerName.value);
        return randomName;
    }

    // Chooses randomly the player that will play first
    chooseStartingPlayer(): StartingPlayer {
        const enumLength = Object.keys(StartingPlayer).length / 2;
        // Number of seconds since 1st january 1970
        let randomNumber = new Date().getTime();
        // Multiplication by a random number [0,1[, which we get the floor
        randomNumber = Math.floor(Math.random() * randomNumber);
        // Random value [0, enum.length[
        return randomNumber % enumLength;
    }

    getRightBonusPositions(): string {
        let bonusPositions;
        if (this.form.controls.randomBonus.value === 'Activer') {
            bonusPositions = this.randomBonusService.shuffleBonusesPositions();
        } else {
            bonusPositions = BONUS_POSITIONS;
        }
        return JSON.stringify(Array.from(bonusPositions));
    }

    // Initializes the game with its settings
    initGame(): void {
        if (this.gameSettingsService.isSoloMode) {
            this.initSoloGame();
            this.router.navigate(['game']);
            return;
        }
        this.initSoloGame();
        this.initMultiplayerGame();
        //this.initSoloGame();
        this.router.navigate(['multiplayer-mode-waiting-room']);
    }

    initSoloGame(): void {
        const playersName: string[] = [this.form.controls.playerName.value, this.chooseRandomAIName()];
        const bonusTests = this.getRightBonusPositions();
        this.gameSettingsService.gameSettings = new GameSettings(
            playersName,
            this.chooseStartingPlayer(),
            this.form.controls.minuteInput.value,
            this.form.controls.secondInput.value,
            this.form.controls.levelInput.value,
            this.form.controls.randomBonus.value,
            //this.getRightBonusPositions(),
            bonusTests,
            'dictionary.json',
        );
    }

    initMultiplayerGame(): void {
        return;
    }

    ngOnDestroy(): void {
        this.gameSettingsService.isRedirectedFromMultiplayerGame = false;
        return;
    }
}
