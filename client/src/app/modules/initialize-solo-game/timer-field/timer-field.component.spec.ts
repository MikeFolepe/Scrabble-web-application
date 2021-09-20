import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimerFieldComponent } from './timer-field.component';

describe('TimerFieldComponent', () => {
    let component: TimerFieldComponent;
    let fixture: ComponentFixture<TimerFieldComponent>;

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

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
