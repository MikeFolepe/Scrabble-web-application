import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ONESECOND_TIME } from '@app/classes/constants';
import { CountdownComponent } from './countdown.component';

describe('CountdownComponent', () => {
    let component: CountdownComponent;
    let fixture: ComponentFixture<CountdownComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CountdownComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CountdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    beforeEach(() => {
        jasmine.clock().install();
    });

    afterEach(function () {
        jasmine.clock().uninstall();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call setTimer onInit', () => {
        component.ngOnInit();
        spyOn<any>(component, 'setTimer');
        jasmine.clock().tick(ONESECOND_TIME + 1);
        expect(component.setTimer).toHaveBeenCalled();
    });

    it('adapt time output to correct value when when only seconds input is 0', () => {
        // when seconds input is 0
        component.seconds = '00';
        component.minutes = '05';
        component.setTimer();
        jasmine.clock().tick(ONESECOND_TIME + 1);
        expect(component.secondsInt).toEqual(59);
        expect(component.minutesInt).toEqual(4);
    });

    it('adapt time output to correct value when seconds input and minutes input are both 0', () => {
        component.seconds = '0';
        component.minutes = '0';
        const nullTime = 0;
        spyOn<any>(component.checkTime, 'emit');
        component.setTimer();
        jasmine.clock().tick(ONESECOND_TIME + 1);
        expect(component.secondsInt).toEqual(nullTime);
        expect(component.minutesInt).toEqual(nullTime);
        expect(component.checkTime.emit).toHaveBeenCalledWith(nullTime);
    });

    it('adapt time output to correct value when neither seconds nor minutes input is 0', () => {
        component.seconds = '30';
        component.minutes = '03';
        component.setTimer();
        jasmine.clock().tick(ONESECOND_TIME + 1);
        expect(component.secondsInt).toEqual(29);
        expect(component.minutesInt).toEqual(3);
    });

    it('stopping timer should set seconds and minutes input to zero and emit seconds only if the message is --!passer--', () => {
        component.message = '!passer';
        component.secondsInt = 30;
        component.minutesInt = 4;
        const nullTime = 0;
        spyOn<any>(component.checkTime, 'emit');
        component.stopTimer();
        expect(component.secondsInt).toEqual(nullTime);
        expect(component.minutesInt).toEqual(nullTime);
        expect(component.checkTime.emit).toHaveBeenCalledWith(nullTime);
    });

    it('stopping timer should not not do anything if the message is not --!passer--', () => {
        component.message = '!wrong';
        component.secondsInt = 30;
        component.minutesInt = 4;
        const nullTime = 0;
        spyOn<any>(component.checkTime, 'emit');
        component.stopTimer();
        expect(component.secondsInt).toEqual(30);
        expect(component.minutesInt).toEqual(4);
        expect(component.checkTime.emit).not.toHaveBeenCalledWith(nullTime);
    });
});
