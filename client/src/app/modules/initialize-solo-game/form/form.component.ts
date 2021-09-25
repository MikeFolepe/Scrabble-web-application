import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GameSettingsService } from '@app/services/game-settings.service';
import { IA_NAME_DATABASE } from '@app/classes/constants';
import { GameSettings, StartingPlayer } from '@app/classes/game-settings';
@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent {
    form = new FormGroup({
        playerName: new FormControl(''),
        minuteInput: new FormControl('01'),
        secondInput: new FormControl('00'),
        levelInput: new FormControl('Facile'),
    });

    constructor(private gameSettingsService: GameSettingsService) {
        // do nothing
    }
    initRandomIAName() {
        // Number of seconds since 1st january 1970
        let randomNumber = new Date().getTime();
        // Multiplication by a random number [0,1[, which we get the floor
        randomNumber = Math.floor(Math.random() * randomNumber);
        // Random value [0, iaNameDatabase.length[
        return IA_NAME_DATABASE[randomNumber % IA_NAME_DATABASE.length];
    }

    initStartingPlayer() {
        const enumLength = Object.keys(StartingPlayer).length / 2;
        // Number of seconds since 1st january 1970
        let randomNumber = new Date().getTime();
        // Multiplication by a random number [0,1[, which we get the floor
        randomNumber = Math.floor(Math.random() * randomNumber);
        // Random value [0, enum.length[
        return randomNumber % enumLength;
    }
    initGame() {
        const playersName: string[] = [this.form.controls.playerName.value, this.initRandomIAName()];
        const settings = new GameSettings(
            playersName,
            this.initStartingPlayer(),
            this.form.controls.minuteInput.value,
            this.form.controls.secondInput.value,
            this.form.controls.levelInput.value,
            false,
            'dictionary.json',
        );
        this.gameSettingsService.initializeSettings(settings);
    }
}
