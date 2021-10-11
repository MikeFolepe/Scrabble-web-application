import { TestBed } from '@angular/core/testing';
import { ONE_SECOND_TIME } from '@app/classes/constants';
import { GameSettingsService } from './game-settings.service';
// import { GameSettingsService } from './game-settings.service';
import { PassTurnService } from './pass-turn.service';

describe('PassTurnService', () => {
    let service: PassTurnService;
    // let gameSettingsService: GameSettingsService;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PassTurnService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    beforeEach(() => {
        jasmine.clock().install();
        service.gameSettingsService = new GameSettingsService();
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

    it('adapt time output to correct value when when only seconds input is 0', () => {
        // when seconds input is 0
        service.gameSettingsService.gameSettings.timeSecond = '00';
        service.gameSettingsService.gameSettings.timeMinute = '05';
        service.startTimer();
        jasmine.clock().tick(ONE_SECOND_TIME + 1);
        expect(service.seconds).toEqual(59);
        expect(service.minutes).toEqual(4);
    });
    it('adapt time output to correct value when neither seconds nor minutes input is 0', () => {
        service.gameSettingsService.gameSettings.timeSecond = '30';
        service.gameSettingsService.gameSettings.timeMinute = '03';
        service.startTimer();
        jasmine.clock().tick(ONE_SECOND_TIME + 1);
        expect(service.seconds).toEqual(29);
        expect(service.minutes).toEqual(3);
    });

    // it('stopping timer should set seconds and minutes input to zero and emit seconds only if the message is --!passer--', () => {
    //     component.message = '!passer';
    //     component.secondsInt = 30;
    //     component.minutesInt = 4;
    //     const nullTime = 0;
    //     spyOn<any>(component.checkTime, 'emit');
    //     component.stopTimer();
    //     expect(component.secondsInt).toEqual(nullTime);
    //     expect(component.minutesInt).toEqual(nullTime);
    //     expect(component.checkTime.emit).toHaveBeenCalledWith(nullTime);
    // });

    // it('stopping timer should not not do anything if the message is not --!passer--', () => {
    //     component.message = '!wrong';
    //     component.secondsInt = 30;
    //     component.minutesInt = 4;
    //     const nullTime = 0;
    //     spyOn<any>(component.checkTime, 'emit');
    //     component.stopTimer();
    //     expect(component.secondsInt).toEqual(30);
    //     expect(component.minutesInt).toEqual(4);
    //     expect(component.checkTime.emit).not.toHaveBeenCalledWith(nullTime);
    // });
});
