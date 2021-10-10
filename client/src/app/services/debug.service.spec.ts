import { TestBed } from '@angular/core/testing';
import { DebugService } from './debug.service';

describe('DebugService', () => {
    let service: DebugService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DebugService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('right debugAiPossibilities should be received', () => {
        service.debugServiceMessage = [];
        const possibilities = [
            { word: 'Banane', nbPt: 10 },
            { word: 'Bob', nbPt: 5 },
        ];
        service.receiveAIDebugPossibilities(possibilities);
        expect(service.debugServiceMessage).toEqual(possibilities);
    });

    it('should clear DebugServiceMessage', () => {
        service.debugServiceMessage = [
            { word: 'Banane', nbPt: 10 },
            { word: 'Bob', nbPt: 5 },
        ];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const emptyDebugMessage: any = [];
        service.clearDebugMessage();
        expect(service.debugServiceMessage).toEqual(emptyDebugMessage);
    });

    it('should be switch the debug mode at false', () => {
        service.isDebugOn = true;
        service.switchDebugMode();
        expect(service.isDebugOn).toBeFalsy();
    });

    it('should be switch the debug mode at true', () => {
        service.isDebugOn = false;
        service.switchDebugMode();
        expect(service.isDebugOn).toBeTruthy();
    });

    it('should be return the state of debug mode', () => {
        service.isDebugOn = true;
        expect(service.isDebugOn).toEqual(service.isDebugOn);
    });
});
