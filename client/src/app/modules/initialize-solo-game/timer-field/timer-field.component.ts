import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-timer-field',
    templateUrl: './timer-field.component.html',
    styleUrls: ['./timer-field.component.scss'],
})
export class TimerFieldComponent implements OnInit {
    @Input() parentForm: FormGroup;
    // Time and Second value selection list for view
    minuteSelectionList: string[] = ['00', '01', '02', '03', '04', '05'];
    secondSelectionList: string[] = ['00', '30'];
    // Min and Max value of timer in HHMM to allow string comparison
    minTimer: string = '0030';
    maxTimer: string = '0500';

    ngOnInit(): void {
        // The Timer field is required for form submit
        this.parentForm.controls.minuteInput.setValidators([Validators.required]);
        this.parentForm.controls.secondInput.setValidators([Validators.required]);
    }

    isValidHours(minuteInput: string, secondInput: string): boolean {
        // If one of the timer input is not initialized the timer field input should be in error
        if (minuteInput === '' || secondInput === '') {
            return false;
        }
        // Checking if the inputs are in range
        return minuteInput + secondInput < this.maxTimer && minuteInput + secondInput > this.minTimer;
    }

    setTimeValidity(): void {
        // Triggered by the click on any selection value in the view
        // Verifies the validity of the actual timer input
        const isTimeValid: boolean = this.isValidHours(this.parentForm.controls.minuteInput.value, this.parentForm.controls.secondInput.value);

        // Set the form field validity
        if (!isTimeValid) {
            this.parentForm.controls.minuteInput.setErrors({ incorrect: true });
            this.parentForm.controls.secondInput.setErrors({ incorrect: true });
        } else {
            this.parentForm.controls.minuteInput.setErrors(null);
            this.parentForm.controls.secondInput.setErrors(null);
        }
    }
}
