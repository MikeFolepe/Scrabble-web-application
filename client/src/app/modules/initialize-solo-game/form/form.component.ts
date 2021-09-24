import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GameSettingsService } from '@app/services/game-settings.service';
@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
    form = new FormGroup({
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        playerName: new FormControl(''),
        minuteInput: new FormControl('01'),
        secondInput: new FormControl('00'),
        levelInput: new FormControl('Easy'),
    });

    constructor(private gameSettingsService: GameSettingsService) {
        // do nothing
    }

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngOnInit(): void {
        // do nothing
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    initGame() {
        this.gameSettingsService.setGameSettingsSolo(
            this.form.controls.playerName.value,
            this.form.controls.minuteInput.value,
            this.form.controls.secondInput.value,
            this.form.controls.levelInput.value,
            undefined,
            undefined,
        );
    }
}
