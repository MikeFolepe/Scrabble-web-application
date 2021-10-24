/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { CASE_SIZE, INDEX_INVALID } from '@app/classes/constants';
import { Vec2 } from '@app/classes/vec2';
import { BoardHandlerService } from './board-handler.service';
import { GridService } from './grid.service';

describe('BoardHandlerService', () => {
    let service: BoardHandlerService;
    let gridServiceSpy: jasmine.SpyObj<GridService>;

    beforeEach(() => {
        gridServiceSpy = jasmine.createSpyObj('GridServiceSpy', ['eraseLayer', 'drawBorder', 'drawArrow']);
        TestBed.configureTestingModule({
            providers: [{ provide: GridService, useValue: gridServiceSpy }],
        });
        service = TestBed.inject(BoardHandlerService);

        service['placeLetterService'].placeWithKeyboard = jasmine.createSpy().and.returnValue(true);
        spyOn(service['turnService'], 'getTour').and.returnValue(true);
        spyOn(service['placeLetterService'], 'removePlacedLetter');
        spyOn(service['sendMessageService'], 'displayMessageByType');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('left clicking a case on the board should select it as the starting case', () => {
        const gridPosition: Vec2 = { x: 7 * CASE_SIZE + CASE_SIZE, y: 7 * CASE_SIZE + CASE_SIZE };
        const mouseEvent = {
            offsetX: gridPosition.x,
            offsetY: gridPosition.y,
            button: 0,
        } as MouseEvent;
        service.mouseHitDetect(mouseEvent);
        expect(service.currentCase).toEqual({ x: 7, y: 7 });
    });

    it('left clicking on the current selected case should switch the orientation of the placement', () => {
        service.currentCase = { x: 7, y: 7 };
        const gridPosition: Vec2 = { x: 7 * CASE_SIZE + CASE_SIZE, y: 7 * CASE_SIZE + CASE_SIZE };
        const mouseEvent = {
            offsetX: gridPosition.x,
            offsetY: gridPosition.y,
            button: 0,
        } as MouseEvent;
        service.mouseHitDetect(mouseEvent);
        expect(service.orientation).toEqual('v');
    });

    it('pressing multiple keyboard buttons that are valid letters should all be placed', () => {
        service['placeLetterService'].placeWithKeyboard = jasmine.createSpy().and.returnValue(true);
        service.currentCase = { x: 7, y: 7 };
        service.isFirstCasePicked = true;
        let keyboardEvent;
        const wordToPlace = 'Frite';
        for (const letterToPlace of wordToPlace) {
            keyboardEvent = new KeyboardEvent('keydown', { key: letterToPlace });
            service.buttonDetect(keyboardEvent);
        }

        expect(service.word).toEqual(wordToPlace);
    });

    it('pressing a keyboard button that is a letter not present in the easel should not be placed', () => {
        service['placeLetterService'].placeWithKeyboard = jasmine.createSpy().and.returnValue(true);
        service.currentCase = { x: 7, y: 7 };
        service.isFirstCasePicked = true;
        let keyboardEvent = new KeyboardEvent('keydown', { key: 'a' });
        service.buttonDetect(keyboardEvent);

        service['placeLetterService'].placeWithKeyboard = jasmine.createSpy().and.returnValue(false);
        keyboardEvent = new KeyboardEvent('keydown', { key: 'z' });
        service.buttonDetect(keyboardEvent);

        expect(service.word).toEqual('a');
    });

    it('pressing Backspace should remove the last letter placed', () => {
        service.currentCase = { x: 7, y: 7 };
        service.isFirstCasePicked = true;
        let keyboardEvent;

        const wordToPlace = 'Frite';
        for (const letterToPlace of wordToPlace) {
            keyboardEvent = new KeyboardEvent('keydown', { key: letterToPlace });
            service.buttonDetect(keyboardEvent);
        }
        keyboardEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
        service.buttonDetect(keyboardEvent);

        expect(service.word).toEqual('Frit');
    });

    it('removing all letters placed with Backspace should allow the user to pick a new starting case', () => {
        service.currentCase = { x: 7, y: 7 };
        service.isFirstCasePicked = true;
        let keyboardEvent;

        const wordToPlace = 'Frite';
        for (const letterToPlace of wordToPlace) {
            keyboardEvent = new KeyboardEvent('keydown', { key: letterToPlace });
            service.buttonDetect(keyboardEvent);
        }
        while (service.word.length) {
            keyboardEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
            service.buttonDetect(keyboardEvent);
        }

        expect(service.word).toEqual('');
        expect(service.isFirstCaseLocked).toBeFalse();
    });

    it('pressing escape should cancel all the placements and the case selection made', () => {
        service.currentCase = { x: 7, y: 7 };
        service.isFirstCasePicked = true;
        service.orientation = 'v';
        let keyboardEvent;

        const wordToPlace = 'Frite';
        for (const letterToPlace of wordToPlace) {
            keyboardEvent = new KeyboardEvent('keydown', { key: letterToPlace });
            service.buttonDetect(keyboardEvent);
        }

        keyboardEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        service.buttonDetect(keyboardEvent);

        expect(service.word).toEqual('');
        expect(service.currentCase).toEqual({ x: INDEX_INVALID, y: INDEX_INVALID });
        expect(service.isFirstCaseLocked).toBeFalse();
        expect(service.isFirstCasePicked).toBeFalse();
    });

    it('pressing Enter with a valid word placed should display the respective message ', () => {
        service['placeLetterService'].placeWithKeyboard = jasmine.createSpy().and.returnValue(true);
        service['placeLetterService'].validateKeyboardPlacement = jasmine.createSpy().and.returnValue(true);
        service.currentCase = { x: 7, y: 7 };
        service.firstCase = { x: 7, y: 7 };
        service.isFirstCasePicked = true;
        let keyboardEvent;

        const wordToPlace = 'Frite';
        for (const letterToPlace of wordToPlace) {
            keyboardEvent = new KeyboardEvent('keydown', { key: letterToPlace });
            service.buttonDetect(keyboardEvent);
        }
        keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        service.buttonDetect(keyboardEvent);

        expect(service['sendMessageService'].displayMessageByType).toHaveBeenCalledWith('!placer h8h Frite', 'player');
    });

    it('pressing Enter with an unvalid word placed should cancel the placement', () => {
        service['placeLetterService'].placeWithKeyboard = jasmine.createSpy().and.returnValue(true);
        service['placeLetterService'].validateKeyboardPlacement = jasmine.createSpy().and.returnValue(false);
        service.currentCase = { x: 7, y: 7 };
        service.isFirstCasePicked = true;
        let keyboardEvent;

        const wordToPlace = 'Frite';
        for (const letterToPlace of wordToPlace) {
            keyboardEvent = new KeyboardEvent('keydown', { key: letterToPlace });
            service.buttonDetect(keyboardEvent);
        }
        keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        service.buttonDetect(keyboardEvent);

        expect(service.word).toEqual('');
    });
});
