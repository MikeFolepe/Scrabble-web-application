// /* eslint-disable dot-notation */
// /* eslint-disable @typescript-eslint/no-magic-numbers */
// import { TestBed } from '@angular/core/testing';
// import { CASE_SIZE, INDEX_INVALID } from '@app/classes/constants';
// import { Vec2 } from '@app/classes/vec2';
// import { BoardHandlerService } from '@app/services/board-handler.service';
// import { GridService } from '@app/services/grid.service';
// import { RouterTestingModule } from '@angular/router/testing';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { TypeMessage } from '@app/classes/enum';

// describe('BoardHandlerService', () => {
//     let service: BoardHandlerService;
//     let gridServiceSpy: jasmine.SpyObj<GridService>;

//     beforeEach(() => {
//         gridServiceSpy = jasmine.createSpyObj('GridServiceSpy', ['eraseLayer', 'drawBorder', 'drawArrow']);
//         TestBed.configureTestingModule({
//             providers: [{ provide: GridService, useValue: gridServiceSpy }],
//             imports: [HttpClientTestingModule, RouterTestingModule],
//         });
//         service = TestBed.inject(BoardHandlerService);

//         service['placeLetterService'].placeWithKeyboard = jasmine.createSpy().and.returnValue(true);
//         service['skipTurnService'].isTurn = true;
//         spyOn(service['placeLetterService'], 'removePlacedLetter');
//         spyOn(service['sendMessageService'], 'displayMessageByType');
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

//     it('left clicking a case on the board should select it as the starting case', () => {
//         const gridPosition: Vec2 = { x: 7 * CASE_SIZE + CASE_SIZE, y: 7 * CASE_SIZE + CASE_SIZE };
//         const mouseEvent = {
//             offsetX: gridPosition.x,
//             offsetY: gridPosition.y,
//             button: 0,
//         } as MouseEvent;
//         service.mouseHitDetect(mouseEvent);
//         expect(service.currentCase).toEqual({ x: 7, y: 7 });
//     });

//     it('left clicking an out of bounds case should not select it', () => {
//         const gridPosition: Vec2 = { x: -1 * CASE_SIZE + CASE_SIZE, y: -1 * CASE_SIZE + CASE_SIZE };
//         const mouseEvent = {
//             offsetX: gridPosition.x,
//             offsetY: gridPosition.y,
//             button: 0,
//         } as MouseEvent;
//         service.mouseHitDetect(mouseEvent);
//         expect(service.currentCase).toEqual({ x: -1, y: -1 });
//     });

//     it('left clicking on the current selected case should switch the orientation of the placement', () => {
//         service.currentCase = { x: 7, y: 7 };
//         const gridPosition: Vec2 = { x: 7 * CASE_SIZE + CASE_SIZE, y: 7 * CASE_SIZE + CASE_SIZE };
//         const mouseEvent = {
//             offsetX: gridPosition.x,
//             offsetY: gridPosition.y,
//             button: 0,
//         } as MouseEvent;
//         service.mouseHitDetect(mouseEvent);
//         expect(service.orientation).toEqual('v');
//     });

//     it('pressing multiple keyboard buttons that are valid letters should all be placed', () => {
//         service.currentCase = { x: 7, y: 7 };
//         service.isFirstCasePicked = true;
//         let keyboardEvent;
//         const wordToPlace = 'Frite';
//         for (const letterToPlace of wordToPlace) {
//             keyboardEvent = new KeyboardEvent('keydown', { key: letterToPlace });
//             service.buttonDetect(keyboardEvent);
//         }

//         expect(service.word).toEqual(wordToPlace);
//     });

//     it('pressing a keyboard button that is a letter not present in the easel should not be placed', () => {
//         service.firstCase = { x: 7, y: 7 };
//         service.currentCase = { x: 7, y: 7 };
//         service.isFirstCasePicked = true;
//         let keyboardEvent = new KeyboardEvent('keydown', { key: 'a' });
//         service.buttonDetect(keyboardEvent);

//         service['placeLetterService'].placeWithKeyboard = jasmine.createSpy().and.returnValue(false);
//         keyboardEvent = new KeyboardEvent('keydown', { key: 'z' });
//         service.buttonDetect(keyboardEvent);

//         expect(service.word).toEqual('a');
//     });

//     it('pressing Backspace should remove the last letter placed', () => {
//         service.firstCase = { x: 7, y: 7 };
//         service.currentCase = { x: 7, y: 7 };
//         service.isFirstCasePicked = true;
//         let keyboardEvent;

//         const wordToPlace = 'Frite';
//         for (const letterToPlace of wordToPlace) {
//             keyboardEvent = new KeyboardEvent('keydown', { key: letterToPlace });
//             service.buttonDetect(keyboardEvent);
//         }
//         keyboardEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
//         service.buttonDetect(keyboardEvent);

//         expect(service.word).toEqual('Frit');
//     });

//     it('removing all letters placed with Backspace should allow the user to pick a new starting case', () => {
//         service.firstCase = { x: 7, y: 7 };
//         service.currentCase = { x: 7, y: 7 };
//         service.isFirstCasePicked = true;
//         let keyboardEvent;

//         const wordToPlace = 'Frite';
//         for (const letterToPlace of wordToPlace) {
//             keyboardEvent = new KeyboardEvent('keydown', { key: letterToPlace });
//             service.buttonDetect(keyboardEvent);
//         }
//         while (service.word.length) {
//             keyboardEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
//             service.buttonDetect(keyboardEvent);
//         }

//         expect(service.word).toEqual('');
//         expect(service.isFirstCaseLocked).toBeFalse();
//     });

//     it('pressing escape should cancel all the placements and the case selection made', () => {
//         service.firstCase = { x: 7, y: 7 };
//         service.currentCase = { x: 7, y: 7 };
//         service.isFirstCasePicked = true;
//         service.orientation = 'v';
//         let keyboardEvent;

//         const wordToPlace = 'Frite';
//         for (const letterToPlace of wordToPlace) {
//             keyboardEvent = new KeyboardEvent('keydown', { key: letterToPlace });
//             service.buttonDetect(keyboardEvent);
//         }

//         keyboardEvent = new KeyboardEvent('keydown', { key: 'Escape' });
//         service.buttonDetect(keyboardEvent);

//         expect(service.word).toEqual('');
//         expect(service.currentCase).toEqual({ x: INDEX_INVALID, y: INDEX_INVALID });
//         expect(service.isFirstCaseLocked).toBeFalse();
//         expect(service.isFirstCasePicked).toBeFalse();
//     });

//     it('pressing Enter with a valid word placed should display the respective message ', () => {
//         service['placeLetterService'].validateKeyboardPlacement = jasmine.createSpy().and.returnValue(true);
//         service.currentCase = { x: 7, y: 7 };
//         service.firstCase = { x: 7, y: 7 };
//         service.isFirstCasePicked = true;
//         let keyboardEvent;

//         const wordToPlace = 'Frite';
//         for (const letterToPlace of wordToPlace) {
//             keyboardEvent = new KeyboardEvent('keydown', { key: letterToPlace });
//             service.buttonDetect(keyboardEvent);
//         }
//         keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
//         service.buttonDetect(keyboardEvent);

//         expect(service['sendMessageService'].displayMessageByType).toHaveBeenCalledWith('!placer h8h Frite', TypeMessage.Player);
//     });

//     it('pressing Enter with an unvalid word placed should cancel the placement', () => {
//         service['placeLetterService'].validateKeyboardPlacement = jasmine.createSpy().and.returnValue(false);
//         service.currentCase = { x: 7, y: 7 };
//         service.isFirstCasePicked = true;
//         let keyboardEvent;

//         const wordToPlace = 'Frite';
//         for (const letterToPlace of wordToPlace) {
//             keyboardEvent = new KeyboardEvent('keydown', { key: letterToPlace });
//             service.buttonDetect(keyboardEvent);
//         }
//         keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
//         service.buttonDetect(keyboardEvent);

//         expect(service.word).toEqual('');
//     });

//     it('forming a valid word out of already placed letters should be valid', () => {
//         service['placeLetterService'].validateKeyboardPlacement = jasmine.createSpy().and.returnValue(true);

//         service['placeLetterService'].scrabbleBoard[7][7] = 'l';
//         service['placeLetterService'].scrabbleBoard[7][8] = 'i';
//         service['placeLetterService'].scrabbleBoard[7][9] = 't';

//         service.firstCase = { x: 6, y: 7 };
//         service.currentCase = { x: 6, y: 7 };
//         service.isFirstCasePicked = true;

//         const wordToPlace = 'ee';
//         let keyboardEvent;
//         for (const letterToPlace of wordToPlace) {
//             keyboardEvent = new KeyboardEvent('keydown', { key: letterToPlace });
//             service.buttonDetect(keyboardEvent);
//         }
//         keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
//         service.buttonDetect(keyboardEvent);

//         expect(service['sendMessageService'].displayMessageByType).toHaveBeenCalledWith('!placer h7h elite', TypeMessage.Player);
//     });

//     it('placing horizontally out of bounds letters following already placed letters should not be placed', () => {
//         service['placeLetterService'].validateKeyboardPlacement = jasmine.createSpy().and.returnValue(true);

//         service['placeLetterService'].scrabbleBoard[7][11] = 'l';
//         service['placeLetterService'].scrabbleBoard[7][12] = 'i';
//         service['placeLetterService'].scrabbleBoard[7][13] = 't';
//         service['placeLetterService'].scrabbleBoard[7][14] = 'e';

//         service.firstCase = { x: 10, y: 7 };
//         service.currentCase = { x: 10, y: 7 };
//         service.isFirstCasePicked = true;

//         const wordToPlace = 'ees';

//         let keyboardEvent = new KeyboardEvent('keydown', { key: wordToPlace[0] });
//         service.buttonDetect(keyboardEvent);
//         service['placeLetterService'].placeWithKeyboard = jasmine.createSpy().and.returnValue(false);
//         keyboardEvent = new KeyboardEvent('keydown', { key: wordToPlace[1] });
//         service.buttonDetect(keyboardEvent);
//         keyboardEvent = new KeyboardEvent('keydown', { key: wordToPlace[2] });
//         service.buttonDetect(keyboardEvent);

//         keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
//         service.buttonDetect(keyboardEvent);

//         expect(service['sendMessageService'].displayMessageByType).toHaveBeenCalledWith('!placer h11h e', TypeMessage.Player);
//     });

//     it('placing vertically out of bounds letters following already placed letters should not be placed', () => {
//         service['placeLetterService'].validateKeyboardPlacement = jasmine.createSpy().and.returnValue(true);

//         service['placeLetterService'].scrabbleBoard[11][7] = 'l';
//         service['placeLetterService'].scrabbleBoard[12][7] = 'i';
//         service['placeLetterService'].scrabbleBoard[13][7] = 't';
//         service['placeLetterService'].scrabbleBoard[14][7] = 'e';

//         service.firstCase = { x: 7, y: 10 };
//         service.currentCase = { x: 7, y: 10 };
//         service.isFirstCasePicked = true;
//         service.orientation = 'v';

//         const wordToPlace = 'ees';

//         let keyboardEvent = new KeyboardEvent('keydown', { key: wordToPlace[0] });
//         service.buttonDetect(keyboardEvent);
//         service['placeLetterService'].placeWithKeyboard = jasmine.createSpy().and.returnValue(false);
//         keyboardEvent = new KeyboardEvent('keydown', { key: wordToPlace[1] });
//         service.buttonDetect(keyboardEvent);
//         keyboardEvent = new KeyboardEvent('keydown', { key: wordToPlace[2] });
//         service.buttonDetect(keyboardEvent);

//         keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
//         service.buttonDetect(keyboardEvent);

//         expect(service['sendMessageService'].displayMessageByType).toHaveBeenCalledWith('!placer k8v e', TypeMessage.Player);
//     });
// });
