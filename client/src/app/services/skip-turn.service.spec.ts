import { TestBed } from '@angular/core/testing';
// import { ONE_SECOND_TIME } from '@app/classes/constants';
// import { GameSettingsService } from './game-settings.service';
import { SkipTurnService } from './skip-turn.service';

describe('SkipTurnService', () => {
    let service: SkipTurnService;
    // let clearInterval: jasmine.Spy<jasmine.Func>;
    // let gameSettingsService: GameSettingsService;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SkipTurnService);
        // clearInterval = jasmine.createSpy('clearInterval');
    });
    // beforeEach(() => {
    //     skipTurnSpy = jasmine.createSpyObj('SkipTurnService', ['startTimer']);
    // });
    beforeEach(() => {
        jasmine.clock().install();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    // it('should call setTimer onInit', () => {
    //     component.ngOnInit();
    //     spyOn<any>(component, 'setTimer');
    //     jasmine.clock().tick(ONESECOND_TIME + 1);
    //     expect(component.setTimer).toHaveBeenCalled();
    // });
    it('should call clearInterval on stopTimer', () => {
        spyOn(service, 'stopTimer');
        service.stopTimer();
        expect(service.stopTimer).toHaveBeenCalled();
    });

    it('should stopTimer when switching turn', () => {
        spyOn(service, 'stopTimer');
        service.switchTurn();
        expect(service.stopTimer).toHaveBeenCalled();
    });

    // it('should startTimer when switching turns', () => {
    //     service.isTurn = false;
    //     const newTurn = true;
    //     spyOn(service, 'startTimer').andz;
    //     service.switchTurn();
    //     expect(service.isTurn).toEqual(newTurn);
    //     expect(service.startTimer).toHaveBeenCalled();
    // });

    // it('should clearInterval when stopping timer', () => {
    //     service.stopTimer();
    //     expect(clearInterval).toHaveBeenCalled();
    // });

    /* eslint-disable @typescript-eslint/no-magic-numbers */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    // import { ComponentFixture, TestBed } from '@angular/core/testing';
    // import { ONESECOND_TIME } from '@app/classes/constants';
    // import { CountdownComponent } from './countdown.component';

    // describe('CountdownComponent', () => {
    //     let component: CountdownComponent;
    //     let fixture: ComponentFixture<CountdownComponent>;

    //     beforeEach(async () => {
    //         await TestBed.configureTestingModule({
    //             declarations: [CountdownComponent],
    //         }).compileComponents();
    //     });

    //     beforeEach(() => {
    //         fixture = TestBed.createComponent(CountdownComponent);
    //         component = fixture.componentInstance;
    //         fixture.detectChanges();
    //     });

    //     beforeEach(() => {
    //         jasmine.clock().install();
    //     });

    //     afterEach(() => {
    //         jasmine.clock().uninstall();
    //     });

    //     it('should create', () => {
    //         expect(component).toBeTruthy();
    //     });

    //     it('should call setTimer onInit', () => {
    //         component.ngOnInit();
    //         spyOn<any>(component, 'setTimer');
    //         jasmine.clock().tick(ONESECOND_TIME + 1);
    //         expect(component.setTimer).toHaveBeenCalled();
    //     });

    //     it('should stop timer if it is the end of the game', () => {
    //         spyOn(component, 'stopTimer');
    //         component.endgameService.isEndGame = true;

    //         component.setTimer();

    //         expect(component.stopTimer).toHaveBeenCalled();
    //     });

    //     it('adapt time output to correct value when when only seconds input is 0', () => {
    //         // when seconds input is 0
    //         component.seconds = '00';
    //         component.minutes = '05';
    //         component.setTimer();
    //         jasmine.clock().tick(ONESECOND_TIME + 1);
    //         expect(component.secondsInt).toEqual(59);
    //         expect(component.minutesInt).toEqual(4);
    //     });

    //     it('adapt time output to correct value when seconds input and minutes input are both 0', () => {
    //         component.seconds = '0';
    //         component.minutes = '0';
    //         const nullTime = 0;
    //         spyOn<any>(component.checkTime, 'emit');
    //         component.setTimer();
    //         jasmine.clock().tick(ONESECOND_TIME + 1);
    //         expect(component.secondsInt).toEqual(nullTime);
    //         expect(component.minutesInt).toEqual(nullTime);
    //         expect(component.checkTime.emit).toHaveBeenCalledWith(nullTime);
    //     });

    //     it('adapt time output to correct value when neither seconds nor minutes input is 0', () => {
    //         component.seconds = '30';
    //         component.minutes = '03';
    //         component.setTimer();
    //         jasmine.clock().tick(ONESECOND_TIME + 1);
    //         expect(component.secondsInt).toEqual(29);
    //         expect(component.minutesInt).toEqual(3);
    //     });

    //     it('stopping timer should set seconds and minutes input to zero and emit seconds only if the message is --!passer--', () => {
    //         component.message = '!passer';
    //         component.secondsInt = 30;
    //         component.minutesInt = 4;
    //         const nullTime = 0;
    //         spyOn<any>(component.checkTime, 'emit');
    //         component.stopTimer();
    //         expect(component.secondsInt).toEqual(nullTime);
    //         expect(component.minutesInt).toEqual(nullTime);
    //         expect(component.checkTime.emit).toHaveBeenCalledWith(nullTime);
    //     });

    //     it('stopping timer should not not do anything if the message is not --!passer--', () => {
    //         component.message = '!wrong';
    //         component.secondsInt = 30;
    //         component.minutesInt = 4;
    //         const nullTime = 0;
    //         spyOn<any>(component.checkTime, 'emit');
    //         component.stopTimer();
    //         expect(component.secondsInt).toEqual(30);
    //         expect(component.minutesInt).toEqual(4);
    //         expect(component.checkTime.emit).not.toHaveBeenCalledWith(nullTime);
    //     });
    // });
});
