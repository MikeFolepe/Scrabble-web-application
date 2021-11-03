import { TestBed } from '@angular/core/testing';
import { PossibleWords, Orientation } from '@app/classes/scrabble-board-pattern';
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

    it('right debugAiPossibilities should be received', () => {
        service.debugServiceMessage = [];
        const possibilities: PossibleWords[] = [
            { word: 'test', orientation: Orientation.HorizontalOrientation, line: 0, startIdx: 0, point: 1 },
            { word: 'test2', orientation: Orientation.VerticalOrientation, line: 1, startIdx: 1, point: 0 },
        ];
        service.receiveAIDebugPossibilities(possibilities);
        expect(service.debugServiceMessage).toEqual(possibilities);
    });

    it('should clear DebugServiceMessage', () => {
        service.debugServiceMessage = [
            { word: 'test', orientation: Orientation.HorizontalOrientation, line: 0, startIdx: 0, point: 1 },
            { word: 'test2', orientation: Orientation.VerticalOrientation, line: 1, startIdx: 1, point: 0 },
        ];

        const emptyDebugMessage: PossibleWords[] = [];
        service.clearDebugMessage();
        expect(service.debugServiceMessage).toEqual(emptyDebugMessage);
    });

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