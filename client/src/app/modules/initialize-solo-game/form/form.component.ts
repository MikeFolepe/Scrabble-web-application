// TODO check privacy of functions in this file

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BONUS_POSITIONS, PLAYER_ONE_INDEX } from '@app/classes/constants';
import { CommunicationService } from '@app/services/communication.service';
import { GameSettingsService } from '@app/services/game-settings.service';
import { RandomBonusesService } from '@app/services/random-bonuses.service';
import { WordValidationService } from '@app/services/word-validation.service';
import { AiPlayerDB, AiType } from '@common/ai-name';
import { Dictionary } from '@common/dictionary';
import { GameSettings, StartingPlayer } from '@common/game-settings';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnDestroy, OnInit {
    form: FormGroup;
    dictionaries: Dictionary[];
    gameDictionary: string[];
    beginnersAi: AiPlayerDB[];
    expertsAi: AiPlayerDB[];
    isDictionaryDeleted: boolean;

    constructor(
        public gameSettingsService: GameSettingsService,
        private router: Router,
        private randomBonusService: RandomBonusesService,
        private communicationService: CommunicationService,
        private wordValidationService: WordValidationService,
    ) {
        this.form = new FormGroup({
            playerName: new FormControl(this.gameSettingsService.gameSettings.playersNames[PLAYER_ONE_INDEX]),
            minuteInput: new FormControl(this.gameSettingsService.gameSettings.timeMinute),
            secondInput: new FormControl(this.gameSettingsService.gameSettings.timeSecond),
            levelInput: new FormControl(this.gameSettingsService.gameSettings.level),
            randomBonus: new FormControl(this.gameSettingsService.gameSettings.randomBonus),
        });
        this.initializeAiPlayers();
    }

    initializeAiPlayers(): void {
        this.communicationService.getAiPlayers(AiType.beginner).subscribe((aiBeginners: AiPlayerDB[]) => {
            this.beginnersAi = aiBeginners;
        });

        this.communicationService.getAiPlayers(AiType.expert).subscribe((aiExperts: AiPlayerDB[]) => {
            this.expertsAi = aiExperts;
        });
    }

    async initializeDictionaries(): Promise<void> {
        this.dictionaries = await this.communicationService.getDictionaries().toPromise();
    }

    async ngOnInit(): Promise<void> {
        await this.initializeDictionaries();
        await this.selectGameDictionary(this.dictionaries[0]);
        this.initializeAiPlayers();
    }



    getRightBonusPositions(): string {
        const bonusPositions = this.form.controls.randomBonus.value === 'Activer' ? this.randomBonusService.shuffleBonusPositions() : BONUS_POSITIONS;
        return JSON.stringify(Array.from(bonusPositions));
    }

    chooseRandomAIName(levelInput: string): string {
        let randomName = '';
        do {
            // Random value [0, AI_NAME_DATABASE.length[
            const randomNumber = Math.floor(Math.random() * this.beginnersAi.length);
            randomName = levelInput === 'Facile' ? this.beginnersAi[randomNumber].aiName : this.expertsAi[randomNumber].aiName;
        } while (randomName === this.form.controls.playerName.value);
        return randomName;
    }

    // Initializes the game with its settings
    initGame(): void {
        this.snapshotSettings();
        const nextUrl = this.gameSettingsService.isSoloMode ? 'game' : 'multiplayer-mode-waiting-room';
        this.router.navigate([nextUrl]);
    }

    async selectGameDictionary(dictionary: Dictionary): Promise<void> {
        const dictionaries = await this.communicationService.getDictionaries().toPromise();
        if (!dictionaries.find((dictionaryInArray: Dictionary) => dictionary.title === dictionaryInArray.title)) {
            this.isDictionaryDeleted = true;
            return;
        }
        this.gameDictionary = await this.communicationService.getGameDictionary(dictionary.fileName).toPromise();
        this.wordValidationService.fileName = dictionary.fileName;
    }

    chooseStartingPlayer(): StartingPlayer {
        return Math.floor((Math.random() * Object.keys(StartingPlayer).length) / 2);
    }

    snapshotSettings(): void {
        const playersNames: string[] = [this.form.controls.playerName.value, this.chooseRandomAIName(this.form.controls.levelInput.value)];
        this.gameSettingsService.gameSettings = new GameSettings(
            playersNames,
            this.chooseStartingPlayer(),
            this.form.controls.minuteInput.value,
            this.form.controls.secondInput.value,
            this.form.controls.levelInput.value,
            this.form.controls.randomBonus.value,
            this.getRightBonusPositions(),
            this.gameDictionary,
        );
    }

    ngOnDestroy(): void {
        this.gameSettingsService.isRedirectedFromMultiplayerGame = false;
    }
}
