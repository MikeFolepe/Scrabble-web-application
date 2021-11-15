import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Range } from '@app/classes/range';

@Component({
    selector: 'app-dialog',
    templateUrl: './join-dialog.component.html',
    styleUrls: ['./join-dialog.component.scss'],
})
export class JoinDialogComponent implements OnInit {
    form: FormControl;
    // Number of character range validity
    charRange: Range;
    // Special character that are allowed
    specialChar: string;
    validationPattern: string;
    constructor(public dialogRef: MatDialogRef<JoinDialogComponent>) {
        this.form = new FormControl();
        this.charRange = {
            min: 4,
            max: 12,
        };
        // TODO mettre specialChar dans fichier constantes
        this.specialChar = '@#$%^&*_';
        this.validationPattern = '^([A-Za-z][A-Za-z][A-Za-z][A-Za-z])[A-Za-z0-9' + this.specialChar + ']*';
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
