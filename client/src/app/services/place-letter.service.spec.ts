/* eslint-disable sort-imports */
/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { INDEX_PLAYER_AI, INDEX_REAL_PLAYER, THREE_SECONDS_DELAY } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { Player } from '@app/models/player.model';
import { GridService } from '@app/services/grid.service';
import { PlaceLetterService } from './place-letter.service';

describe('PlaceLetterService', () => {
    let service: PlaceLetterService;
    let gridServiceSpy: unknown;
    beforeEach(() => {
        gridServiceSpy = jasmine.createSpyObj('GridService', ['drawLetter', 'eraseLetter']);
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: GridService, useValue: gridServiceSpy }],
        });
        service = TestBed.inject(PlaceLetterService);
    });

    beforeEach(() => {
        const letterA: Letter = {
            value: 'A',
            quantity: 0,
            points: 0,
        };
        const letterB: Letter = {
            value: 'B',
            quantity: 0,
            points: 0,
        };
        const letterC: Letter = {
            value: 'C',
            quantity: 0,
            points: 0,
        };
        const letterD: Letter = {
            value: 'D',
            quantity: 0,
            points: 0,
        };
        const letterH: Letter = {
            value: 'H',
            quantity: 0,
            points: 0,
        };
        const letterWhite: Letter = {
            value: '*',
            quantity: 0,
            points: 0,
        };

        const firstPlayerEasel = [letterA, letterA, letterB, letterB, letterC, letterC, letterD];
        const firstPlayer = new Player(1, 'Player 1', firstPlayerEasel);
        service['playerService'].addPlayer(firstPlayer);
        const secondPlayerEasel = [letterA, letterA, letterB, letterC, letterC, letterH, letterWhite];
        const secondPlayer = new Player(2, 'Player 2', secondPlayerEasel);
        service['playerService'].addPlayer(secondPlayer);

        // Fake these methods to be able to call place()
        spyOn(service['playerService'], 'removeLetter');
        spyOn(service['playerService'], 'refillEasel');
        spyOn(service['wordValidationService'], 'validateAllWordsOnBoard').and.returnValue({ validation: true, score: 0 });
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('word placed outside the grid should be invalid', () => {
        const position: Vec2 = { x: 12, y: 12 };
        let orientation = 'h';
        const word = 'douleur';
        expect(service.isWordFitting(position, orientation, word)).toEqual(false); // Horizontally
        orientation = 'v';
        expect(service.isWordFitting(position, orientation, word)).toEqual(false); // Vertically
    });

    it('word placed inside the grid should be valid', () => {
        const position: Vec2 = { x: 2, y: 7 };
        const orientation = 'h';
        const word = 'cadeau';
        expect(service.isWordFitting(position, orientation, word)).toEqual(true);
    });

    it('first word placed on central case should be valid', () => {
        const position: Vec2 = { x: 7, y: 7 }; // central case H8
        let orientation = 'h';
        const word = 'office';
        expect(service.isFirstWordValid(position, orientation, word)).toEqual(true);
        orientation = 'v';
        expect(service.isFirstWordValid(position, orientation, word)).toEqual(true);
    });

    it('first word not placed on central case should be invalid', () => {
        const position: Vec2 = { x: 2, y: 9 };
        const orientation = 'v';
        const word = 'stage';
        expect(service.isFirstWordValid(position, orientation, word)).toEqual(false);
    });

    it('word placed on the following rounds should be valid if he touches other words', () => {
        // Fake these methods to be able to call place()
        // Place first word
        let position: Vec2 = { x: 7, y: 7 };
        let orientation = 'h';
        let word = 'bac';
        service.place(position, orientation, word, INDEX_REAL_PLAYER);
        // Try to place a word vertically while touching the previous word placed
        position = { x: 6, y: 10 };
        orientation = 'v';
        word = 'cba';
        let isWordTouching = service.isWordTouchingOthers(position, orientation, word);
        // Try to place a word horizontally while touching the previous word placed
        position = { x: 8, y: 4 };
        orientation = 'h';
        word = 'dabb';
        isWordTouching = service.isWordTouchingOthers(position, orientation, word);

        expect(isWordTouching).toEqual(true);
    });

    it("word placed on the following rounds should be invalid if he's not touching others", () => {
        // Place first word
        let position: Vec2 = { x: 7, y: 7 };
        let orientation = 'v';
        let word = 'bac';
        service.place(position, orientation, word, INDEX_REAL_PLAYER);
        // Try to place a word vertically without touching the previous word placed
        position = { x: 11, y: 13 };
        orientation = 'v';
        word = 'acab';
        const isWordTouching = service.isWordTouchingOthers(position, orientation, word);
        expect(isWordTouching).toEqual(false);
    });

    it("placing letters that aren't present in the easel or the scrabbleboard should be invalid", () => {
        const position: Vec2 = { x: 7, y: 7 };
        const orientation = 'h';
        const word = 'fil';
        expect(service.place(position, orientation, word, INDEX_REAL_PLAYER)).toEqual(false);
    });

    it('placing letters present in the easel or the scrabbleboard should be valid', () => {
        // Player 1 places the first word
        let position: Vec2 = { x: 7, y: 7 };
        let orientation = 'h';
        let word = 'abcd';
        service.place(position, orientation, word, INDEX_REAL_PLAYER);
        // Player 2 tries to vertically place a word while using letters already on the scrabbleBoard
        position = { x: 6, y: 10 };
        orientation = 'v';
        word = 'adbcc';
        let isWordValid = service.isWordValid(position, orientation, word, INDEX_PLAYER_AI);
        // Player 2 tries to horizontally place a word while using letters already on the scrabbleBoard
        position = { x: 7, y: 10 };
        orientation = 'h';
        word = 'daah';
        isWordValid = service.isWordValid(position, orientation, word, INDEX_PLAYER_AI);
        expect(isWordValid).toEqual(true);
    });

    it('placing a word containing a white letter (*) which is present in the easel should be valid', () => {
        const position: Vec2 = { x: 7, y: 7 };
        const orientation = 'h';
        const word = 'bOa'; // white letter is used as 'O'
        expect(service.isWordValid(position, orientation, word, INDEX_PLAYER_AI)).toEqual(true);
    });

    it("placing letters that doesn't form a valid word should be removed from scrabbleBoard", () => {
        service['wordValidationService'].validateAllWordsOnBoard = jasmine.createSpy().and.returnValue({ validation: false, score: 0 });
        // Player 1 places an invalid word
        const position: Vec2 = { x: 7, y: 7 };
        const orientation = 'h';
        const word = 'abcd';
        expect(service.place(position, orientation, word, INDEX_REAL_PLAYER)).toEqual(false);
    });

    it('only the invalid letters that we just placed should be removed from scrabbleBoard', () => {
        // Player 1 places the 1st word
        let position: Vec2 = { x: 7, y: 7 };
        let orientation = 'h';
        let word = 'bac';
        service.place(position, orientation, word, INDEX_REAL_PLAYER);

        // Player 2 places an invalid word on top of the previous one
        service['wordValidationService'].validateAllWordsOnBoard = jasmine.createSpy().and.returnValue({ validation: false, score: 0 });
        jasmine.clock().install();
        // Horizontally
        position = { x: 7, y: 7 };
        orientation = 'h';
        word = 'bacchaV';
        let lettersRemoved = service.place(position, orientation, word, INDEX_PLAYER_AI);
        jasmine.clock().tick(THREE_SECONDS_DELAY + 1);
        expect(lettersRemoved).toEqual(false);
        // Vertically
        position = { x: 7, y: 7 };
        orientation = 'v';
        word = 'bEcchaa';
        lettersRemoved = service.place(position, orientation, word, INDEX_PLAYER_AI);
        jasmine.clock().tick(THREE_SECONDS_DELAY + 1);
        expect(lettersRemoved).toEqual(false);
        jasmine.clock().uninstall();
    });

    it('placing a word on top of a different existing word should be invalid', () => {
        service['wordValidationService'].validateAllWordsOnBoard = jasmine.createSpy().and.returnValue({ validation: true, score: 0 });
        jasmine.clock().install();
        // Player 1 places the 1st word
        const position: Vec2 = { x: 7, y: 7 };
        const orientation = 'h';
        let word = 'aabb';
        service.place(position, orientation, word, INDEX_REAL_PLAYER);
        // Player 1 horizontally places a second word on top of the 1st word that has different letters
        word = 'ccaa';
        jasmine.clock().tick(THREE_SECONDS_DELAY + 1);
        expect(service.place(position, orientation, word, INDEX_REAL_PLAYER)).toEqual(false);
        jasmine.clock().uninstall();
    });

    it('calling placeMethodAdapter() should call place()', () => {
        service['wordValidationService'].validateAllWordsOnBoard = jasmine.createSpy().and.returnValue({ validation: false, score: 0 });
        const spy = spyOn(service, 'place').and.callThrough();
        const start: Vec2 = { x: 7, y: 7 };
        const orientation = 'h';
        const word = 'dab';
        const object = { start, orientation, word, indexPlayer: 1 };
        service.placeMethodAdapter(object);
        expect(spy).toHaveBeenCalled();
    });

    it('placing all the letters from the easel to form a valid word should give a bonus', () => {
        service['wordValidationService'].validateAllWordsOnBoard = jasmine.createSpy().and.returnValue({ validation: true, score: 0 });
        const position: Vec2 = { x: 7, y: 7 };
        const orientation = 'h';
        const word = 'abah*cc';
        service.place(position, orientation, word, INDEX_PLAYER_AI);
        expect(service.isEaselSize).toEqual(true);
    });

    it('placing a word containing the same letter multiple times that is only present once in the easel should be invalid', () => {
        const position: Vec2 = { x: 7, y: 7 };
        const orientation = 'h';
        const word = 'dad';
        expect(service.isWordValid(position, orientation, word, INDEX_REAL_PLAYER)).toEqual(false);
    });

    // it('should unsubscribe on destroy', () => {
    //     spyOn(service.viewSubscription, 'unsubscribe');
    //     service.ngOnDestroy();
    //     expect(service.viewSubscription.unsubscribe).toHaveBeenCalled();
    // });
});
