import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
// eslint-disable-next-line no-restricted-imports
import { CharRange, PlayerNameFieldService } from '../services/player-name-field.service';
@Component({
    selector: 'app-player-name-field',
    templateUrl: './player-name-field.component.html',
    styleUrls: ['./player-name-field.component.scss'],
})
export class PlayerNameFieldComponent implements OnInit {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Input() parentForm: FormGroup;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    charRange: CharRange = {
        minCharacter: 4,
        maxCharacter: 12,
    };
    pattern: string;

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(private playerNameFieldService_: PlayerNameFieldService) {
        // do nothing
    }

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngOnInit(): void {
        // eslint-disable-next-line no-underscore-dangle
        this.charRange = this.playerNameFieldService_.getCharRange();
        // eslint-disable-next-line no-underscore-dangle
        this.pattern = this.playerNameFieldService_.getPattern();
        this.parentForm.controls.playerName.setValidators([
            Validators.required,
            Validators.pattern(this.pattern),
            Validators.minLength(this.charRange.minCharacter),
            Validators.maxLength(this.charRange.maxCharacter),
        ]);
    }
}
