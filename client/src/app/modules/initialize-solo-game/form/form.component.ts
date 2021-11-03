import { AI_NAME_DATABASE, BONUS_POSITIONS } from '@app/classes/constants';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GameSettings, StartingPlayer } from '@common/game-settings';
import { GameSettingsService } from '@app/services/game-settings.service';
import { RandomBonusesService } from '@app/services/random-bonuses.service';
import { Router } from '@angular/router';

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
        this.router.navigate(['multiplayer-mode-waiting-room']);
    }

    initSoloGame(): void {
        const playersName: string[] = [this.form.controls.playerName.value, this.chooseRandomAIName()];
        this.gameSettingsService.gameSettings = new GameSettings(
            playersName,
            this.chooseStartingPlayer(),
            this.form.controls.minuteInput.value,
            this.form.controls.secondInput.value,
            this.form.controls.levelInput.value,
            this.form.controls.randomBonus.value,
            this.getRightBonusPositions(),
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

    private chooseRandomAIName(): string {
        let randomName: string;
        do {
            // Random value [0, AI_NAME_DATABASE.length[
            const randomNumber = Math.floor(Math.random() * AI_NAME_DATABASE.length);
            randomName = AI_NAME_DATABASE[randomNumber];
        } while (randomName === this.form.controls.playerName.value);
        return randomName;
    }

    private chooseStartingPlayer(): StartingPlayer {
        return Math.floor((Math.random() * Object.keys(StartingPlayer).length) / 2);
    }
}
