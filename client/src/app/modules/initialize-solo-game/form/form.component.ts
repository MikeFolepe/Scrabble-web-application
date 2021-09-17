import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
    form = new FormGroup({
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        playerName: new FormControl(''),
        minuteInput: new FormControl(''),
        secondInput: new FormControl(''),
        levelInput: new FormControl(''),
    });

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor() {
        // do nothing
    }

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngOnInit(): void {
        // do nothing
    }
}
