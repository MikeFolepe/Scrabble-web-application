/* eslint-disable no-underscore-dangle */
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
// eslint-disable-next-line no-restricted-imports
import { TimerFieldService } from '../services/timer-field.service';

@Component({
    selector: 'app-timer-field',
    templateUrl: './timer-field.component.html',
    styleUrls: ['./timer-field.component.scss'],
})
export class TimerFieldComponent implements OnInit {
    @Input() parentForm: FormGroup;
    minuteSelectionList: string[];
    secondSelectionList: string[];
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(private timerField_: TimerFieldService) {
        // do nothing
    }

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngOnInit(): void {
        // this.parentForm.addControl('Timer', new FormControl('', [Validators.required]));
        // eslint-disable-next-line no-underscore-dangle
        this.minuteSelectionList = this.timerField_.getMinutes();
        // eslint-disable-next-line no-underscore-dangle
        this.secondSelectionList = this.timerField_.getSeconds();
        // do nothing
        this.parentForm.controls.minuteInput.setValidators([Validators.required]);
        this.parentForm.controls.secondInput.setValidators([Validators.required]);
    }

    setTimeValidity() {
        const isTimeValid: boolean = this.timerField_.isValidHours(
            this.parentForm.controls.minuteInput.value,
            this.parentForm.controls.secondInput.value,
        );
        if (!isTimeValid) {
            this.parentForm.controls.minuteInput.setErrors({ incorrect: true });
            this.parentForm.controls.secondInput.setErrors({ incorrect: true });
        } else {
            this.parentForm.controls.minuteInput.setErrors(null);
            this.parentForm.controls.secondInput.setErrors(null);
        }
    }
}
