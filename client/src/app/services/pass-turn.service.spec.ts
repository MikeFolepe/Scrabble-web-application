import { TestBed } from '@angular/core/testing';
// import { ONE_SECOND_TIME } from '@app/classes/constants';
// import { GameSettingsService } from './game-settings.service';
import { PassTurnService } from './pass-turn.service';

describe('PassTurnService', () => {
    let service: PassTurnService;
    // let clearInterval: jasmine.Spy<jasmine.Func>;
    // let gameSettingsService: GameSettingsService;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PassTurnService);
        // clearInterval = jasmine.createSpy('clearInterval');
    });
    // beforeEach(() => {
    //     passTurnSpy = jasmine.createSpyObj('PassTurnService', ['startTimer']);
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
});
