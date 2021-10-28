import { TestBed } from '@angular/core/testing';
import { DebugService } from './debug.service';

describe('DebugService', () => {
    let service: DebugService;
    // Fichier de test

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DebugService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // it('right debugAiPossibilities should be received', () => {
    //     service.debugServiceMessage = [];
    //     const possibilities = [
    //         { word: 'Banane', point: 10 },
    //         { word: 'Bob', point: 5 },
    //     ];
    //     service.receiveAIDebugPossibilities(possibilities);
    //     expect(service.debugServiceMessage).toEqual(possibilities);
    // });

    // it('should clear DebugServiceMessage', () => {
    //     service.debugServiceMessage = [
    //         { word: 'Banane', point: 10 },
    //         { word: 'Bob', point: 5 },
    //     ];

    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     const emptyDebugMessage: any = [];
    //     service.clearDebugMessage();
    //     expect(service.debugServiceMessage).toEqual(emptyDebugMessage);
    // });

    it('should be switch the debug mode at false', () => {
        service.isDebugActive = true;
        service.switchDebugMode();
        expect(service.isDebugActive).toBeFalsy();
    });

    it('should switch the debug mode at true', () => {
        service.isDebugActive = false;
        service.switchDebugMode();
        expect(service.isDebugActive).toBeTruthy();
    });
});
