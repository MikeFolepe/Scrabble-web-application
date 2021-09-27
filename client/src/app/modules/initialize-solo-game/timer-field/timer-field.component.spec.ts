import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TimerFieldComponent } from './timer-field.component';

describe('TimerFieldComponent', () => {
    let component: TimerFieldComponent;
    let fixture: ComponentFixture<TimerFieldComponent>;
    let minuteInput:string;
    let secondInput:string;
    // let parentFormSpy: any;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TimerFieldComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TimerFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('Time must be invalidated if minutes input or seconds input is empty', () => {
    //     minuteInput = '';
    //     secondInput = '';
    //     expect(component.isValidTime(minuteInput, secondInput)).toBe(false);
    // });

    // it('Time must be invalidated if the input time is not in valid the range', () => {
    //     minuteInput = '70';
    //     secondInput = '00';
    //     expect(component.isValidTime(minuteInput, secondInput)).toBe(false);
    // });

    it('Time must be validated if the input time is in valid the range', () => {
        component.parentForm = new FormGroup({
            playerName: new FormControl(''),
            minuteInput: new FormControl('70'),
            secondInput: new FormControl('00'),
            levelInput: new FormControl('Facile'),
        });
        minuteInput = '05';
        secondInput = '00';
        expect(component.isValidTime(minuteInput, secondInput)).toBe(true);
    });

    it('should have input errors when time is not validated', () => {
        component.parentForm = new FormGroup({
            playerName: new FormControl(''),
            minuteInput: new FormControl('70'),
            secondInput: new FormControl('00'),
            levelInput: new FormControl('Facile'),
        });
        //expect(component.isValidTime(component.parentForm.controls.minuteInput.value, component.parentForm.controls.secondInput.value)).toBeFalsy();
        component.setTimeValidity();
        expect(component.parentForm.controls.minuteInput.errors).toBeTruthy();
        expect(component.parentForm.controls.secondInput.errors).toBeTruthy();
    });

    it('should not have input errors when time is validated', () => {
        component.parentForm = new FormGroup({
            playerName: new FormControl(''),
            minuteInput: new FormControl('01'),
            secondInput: new FormControl('00'),
            levelInput: new FormControl('Facile'),
        });
        component.setTimeValidity();
        //expect(component.isValidTime(component.parentForm.controls.minuteInput.value, component.parentForm.controls.secondInput.value)).toBeTruthy();
        expect(component.parentForm.controls.minuteInput.errors).toBeNull();
        expect(component.parentForm.controls.secondInput.errors).toBeNull();
    })


});
