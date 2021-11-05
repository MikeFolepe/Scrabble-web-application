import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Range } from '@app/classes/range';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
    form: FormControl;
    // Number of character range validity
    charRange: Range = {
        min: 4, // should be >= 4
        max: 12,
    };
    // Special character that are allowed
    specialChar: string = '@#$%^&*_';
    // JUSTIFICATION : Validation pattern which is combination of required pattern and special char
    // eslint-disable-next-line no-invalid-this
    validationPattern: string = '^([A-Za-z][A-Za-z][A-Za-z][A-Za-z])[A-Za-z0-9' + this.specialChar + ']*';
    constructor(public dialogRef: MatDialogRef<DialogComponent>) {
        this.form = new FormControl();
    }

    ngOnInit(): void {
        this.form.setValidators([
            Validators.required,
            Validators.pattern(this.validationPattern),
            Validators.minLength(this.charRange.min),
            Validators.maxLength(this.charRange.max),
        ]);
    }
}
