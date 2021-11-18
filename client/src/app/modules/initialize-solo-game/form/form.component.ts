import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AI_NAME_DATABASE, BONUS_POSITIONS, PLAYER_ONE_INDEX } from '@app/classes/constants';
import { GameSettingsService } from '@app/services/game-settings.service';
import { RandomBonusesService } from '@app/services/random-bonuses.service';
import { GameSettings, StartingPlayer } from '@common/game-settings';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnDestroy {
    form: FormGroup;

    constructor(public gameSettingsService: GameSettingsService, private router: Router, private randomBonusService: RandomBonusesService) {
        this.form = new FormGroup({
            playerName: new FormControl(this.gameSettingsService.gameSettings.playersName[PLAYER_ONE_INDEX]),
            minuteInput: new FormControl(this.gameSettingsService.gameSettings.timeMinute),
            secondInput: new FormControl(this.gameSettingsService.gameSettings.timeSecond),
            levelInput: new FormControl(this.gameSettingsService.gameSettings.level),
            randomBonus: new FormControl(this.gameSettingsService.gameSettings.randomBonus),
        });
    }

    getRightBonusPositions(): string {
        let bonusPositions;
        if (this.form.controls.randomBonus.value === 'Activer') {
            bonusPositions = this.randomBonusService.shuffleBonusPositions();
        } else {
            bonusPositions = BONUS_POSITIONS;
        }
        return JSON.stringify(Array.from(bonusPositions));
    }

    chooseRandomAIName(): string {
        let randomName: string;
        do {
            // Random value [0, AI_NAME_DATABASE.length[
            const randomNumber = Math.floor(Math.random() * AI_NAME_DATABASE.length);
            randomName = AI_NAME_DATABASE[randomNumber];
        } while (randomName === this.form.controls.playerName.value);
        return randomName;
    }

    // Initializes the game with its settings
    initGame(): void {
        this.snapshotSettings();
        if (this.gameSettingsService.isSoloMode) {
            this.router.navigate(['game']);
            return;
        }
        this.router.navigate(['multiplayer-mode-waiting-room']);
    }

    chooseStartingPlayer(): StartingPlayer {
        return Math.floor((Math.random() * Object.keys(StartingPlayer).length) / 2);
    }

    snapshotSettings(): void {
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

    ngOnDestroy(): void {
        this.gameSettingsService.isRedirectedFromMultiplayerGame = false;
        return;
    }
}
