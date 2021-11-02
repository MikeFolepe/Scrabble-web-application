import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Range } from '@app/classes/range';
@Component({
    selector: 'app-player-name-field',
    templateUrl: './player-name-field.component.html',
    styleUrls: ['./player-name-field.component.scss'],
})
export class PlayerNameFieldComponent implements OnInit {
    @Input() parentForm: FormGroup;
    // Number of character range validity
    charRange: Range = {
        min: 4, // should be >= 4
        max: 12,
    };
    // Special character that are allowed
    specialChar: string = '@#$%^&*_';

    ngOnInit(): void {
        // Validation pattern which is combination of required pattern and special char
        const validationPattern: string = '^([A-Za-z][A-Za-z][A-Za-z][A-Za-z])[A-Za-z0-9' + this.specialChar + ']*';

        // The playerName field is required for form submit
        this.parentForm.controls.playerName.setValidators([
            Validators.required,
            Validators.pattern(validationPattern),
            Validators.minLength(this.charRange.min),
            Validators.maxLength(this.charRange.max),
        ]);
    }
}
