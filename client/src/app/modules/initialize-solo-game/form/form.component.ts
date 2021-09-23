import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GameSettingsService } from '@app/services/game-settings.service';
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
        levelInput: new FormControl('Easy'),
    });

    constructor(private gameSettingsService: GameSettingsService) {
        // do nothing
    }

    initGame() {
        // Use the service to submit the form inputs to set the game settings in the service
        this.gameSettingsService.setGameSettings(
            this.form.controls.playerName.value,
            this.form.controls.minuteInput.value,
            this.form.controls.secondInput.value,
            this.form.controls.levelInput.value,
            false,
            '',
        );
    }
}
