import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NAME_SIZE, SPECIAL_CHAR, VALIDATION_PATTERN } from '@app/classes/constants';
import { CustomRange } from '@app/classes/range';

@Component({
    selector: 'app-edit-dictionary-dialog',
    templateUrl: './edit-dictionary-dialog.component.html',
    styleUrls: ['./edit-dictionary-dialog.component.scss'],
})
export class EditDictionaryDialogComponent implements OnInit {
    form: FormGroup;
    nameSize: CustomRange;
    descriptionSize: CustomRange;
    specialChar: string;
    specialCharWhiteSpace: string;

    constructor(public dialogRef: MatDialogRef<EditDictionaryDialogComponent>) {
        // TODO à changer
        this.nameSize = NAME_SIZE;
        this.specialChar = SPECIAL_CHAR;

        this.specialCharWhiteSpace = this.specialChar + ' ';
        this.descriptionSize = { min: 8, max: 30 };
        this.form = new FormGroup({
            titleInput: new FormControl(''),
            descriptionInput: new FormControl(''),
        });
    }

    ngOnInit(): void {
        this.form.controls.titleInput.setValidators([
            Validators.required,
            Validators.pattern(VALIDATION_PATTERN),
            Validators.minLength(NAME_SIZE.min),
            Validators.maxLength(NAME_SIZE.max),
        ]);

        const descriptionValidationPattern = '^([A-Za-z][A-Za-z][A-Za-z][A-Za-z])[A-Za-z0-9' + this.specialCharWhiteSpace + ']*';

        this.form.controls.descriptionInput.setValidators([
            Validators.required,
            Validators.pattern(descriptionValidationPattern),
            Validators.minLength(this.descriptionSize.min),
            Validators.maxLength(this.descriptionSize.max),
        ]);
    }
}
