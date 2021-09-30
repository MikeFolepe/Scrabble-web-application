import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LevelFieldComponent } from './level-field.component';

describe('LevelFieldComponent', () => {
    let component: LevelFieldComponent;
    let fixture: ComponentFixture<LevelFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LevelFieldComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LevelFieldComponent);
        component = fixture.componentInstance;
        component.parentForm = new FormGroup({
            playerName: new FormControl('', Validators.required),
            minuteInput: new FormControl('', Validators.required),
            secondInput: new FormControl('', Validators.required),
            levelInput: new FormControl('', Validators.required),
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
