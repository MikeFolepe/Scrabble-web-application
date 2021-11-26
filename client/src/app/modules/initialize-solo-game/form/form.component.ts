// TODO check privacy of functions in this file

import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AI_NAME_DATABASE, BONUS_POSITIONS, INVALID_INDEX, PLAYER_ONE_INDEX } from '@app/classes/constants';
import { GameSettingsService } from '@app/services/game-settings.service';
import { RandomBonusesService } from '@app/services/random-bonuses.service';
import { GameSettings, StartingPlayer } from '@common/game-settings';
import { OBJECTIVES } from '@common/objectives';
import { ObjectiveTypes } from '@common/objectives-type';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnDestroy {
    form: FormGroup;

    constructor(public gameSettingsService: GameSettingsService, private router: Router, private randomBonusService: RandomBonusesService) {
        this.form = new FormGroup({
            playerName: new FormControl(this.gameSettingsService.gameSettings.playersNames[PLAYER_ONE_INDEX]),
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
        const playersNames: string[] = [this.form.controls.playerName.value, this.chooseRandomAIName()];
        this.gameSettingsService.gameSettings = new GameSettings(
            playersNames,
            this.chooseStartingPlayer(),
            this.form.controls.minuteInput.value,
            this.form.controls.secondInput.value,
            this.form.controls.levelInput.value,
            this.form.controls.randomBonus.value,
            this.getRightBonusPositions(),
            'dictionary.json',
            this.initializeObjective([
                [4, 3],
                [6, 1],
            ]),
        );
    }

    // [[idx1 = objPublic1, idx2 = ObjPublic2], [idx3 = ton ObjPrive, idx4 = ObjPrive de ton adversaire (multijoueur ou JV)]]
    initializeObjective(forceValue: number[][] = [[], []]): number[][] {
        // TODO: ligne 83 uniquement à des fins de débogage
        if (forceValue[0].length === 2 && forceValue[1].length === 2) return forceValue;
        const objectiveIds: number[] = [];
        const objectiveByType: number[][] = [[], []];

        while (objectiveIds.length < 4) {
            const candidate = Math.floor(Number(Math.random()) * OBJECTIVES.length);
            if (objectiveIds.indexOf(candidate) === INVALID_INDEX) objectiveIds.push(candidate);
        }
        objectiveByType[ObjectiveTypes.Public] = objectiveIds.slice(0, 2);
        objectiveByType[ObjectiveTypes.Private] = objectiveIds.slice(2, objectiveIds.length);

        return objectiveByType;
    }

    ngOnDestroy(): void {
        this.gameSettingsService.isRedirectedFromMultiplayerGame = false;
        return;
    }
}
