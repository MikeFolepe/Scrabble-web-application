/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { INDEX_PLAYER_AI, INDEX_REAL_PLAYER, RESERVE, THREE_SECONDS_DELAY } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { Player } from '@app/models/player.model';
import { GridService } from '@app/services/grid.service';

import { PlaceLetterService } from './place-letter.service';

describe('PlaceLetterService', () => {
    let service: PlaceLetterService;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
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
        const letterA: Letter = RESERVE[0];
        const letterB: Letter = RESERVE[1];
        const letterC: Letter = RESERVE[2];
        const letterD: Letter = RESERVE[3];
        const letterH: Letter = RESERVE[7];
        const letterWhite: Letter = RESERVE[26];

        const firstPlayerEasel = [letterA, letterA, letterB, letterB, letterC, letterC, letterD];
        const firstPlayer = new Player(1, 'Player 1', firstPlayerEasel);
        service['playerService'].addPlayer(firstPlayer);
        const secondPlayerEasel = [letterA, letterA, letterB, letterC, letterC, letterH, letterWhite];
        const secondPlayer = new Player(2, 'Player 2', secondPlayerEasel);
        service['playerService'].addPlayer(secondPlayer);

        // Fake these methods to be able to call placeCommand()
        spyOn(service['playerService'], 'removeLetter');
        spyOn(service['playerService'], 'refillEasel');
        spyOn(service['wordValidationService'], 'validateAllWordsOnBoard').and.returnValue({ validation: true, score: 0 });
        spyOn(service['sendMessageService'], 'displayMessageByType');
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('word placed outside the grid should be invalid', () => {
        const position: Vec2 = { x: 12, y: 12 };
        let orientation = 'h';
        const word = 'douleur';
        expect(service.isWordFitting(position, orientation, word)).toBeFalse(); // Horizontally
        orientation = 'v';
        expect(service.isWordFitting(position, orientation, word)).toBeFalse(); // Vertically
    });

    it('word placed inside the grid should be valid', () => {
        const position: Vec2 = { x: 2, y: 7 };
        const orientation = 'h';
        const word = 'cadeau';
        expect(service.isWordFitting(position, orientation, word)).toBeTrue();
    });

    it('first word placed on central case should be valid', () => {
        const position: Vec2 = { x: 7, y: 7 }; // central case H8
        let orientation = 'h';
        const word = 'office';
        expect(service.isFirstWordValid(position, orientation, word)).toBeTrue();
        orientation = 'v';
        expect(service.isFirstWordValid(position, orientation, word)).toBeTrue();
    });

    it('first word not placed on central case should be invalid', () => {
        const position: Vec2 = { x: 2, y: 9 };
        const orientation = 'v';
        const word = 'stage';
        expect(service.isFirstWordValid(position, orientation, word)).toBeFalse();
    });

    it('word placed on the following rounds should be valid if he touches other words', () => {
        // Place first word
        let position: Vec2 = { x: 7, y: 7 };
        let orientation = 'h';
        let word = 'bac';
        service.placeCommand(position, orientation, word, INDEX_REAL_PLAYER);
        // Try to place a word vertically while touching the previous word placed
        position = { x: 10, y: 6 };
        orientation = 'v';
        word = 'cba';
        let isWordTouching = service.isWordTouchingOthers(position, orientation, word);
        // Try to place a word horizontally while touching the previous word placed
        position = { x: 4, y: 8 };
        orientation = 'h';
        word = 'dabb';
        isWordTouching = service.isWordTouchingOthers(position, orientation, word);

        expect(isWordTouching).toBeTrue();
    });

    it("word placed on the following rounds should be invalid if he's not touching others", () => {
        // Place first word
        let position: Vec2 = { x: 7, y: 7 };
        let orientation = 'v';
        let word = 'bac';
        service.placeCommand(position, orientation, word, INDEX_REAL_PLAYER);
        // Try to place a word vertically without touching the previous word placed
        position = { x: 11, y: 13 };
        orientation = 'v';
        word = 'acab';
        const isWordTouching = service.isWordTouchingOthers(position, orientation, word);
        expect(isWordTouching).toBeFalse();
    });

    it("placing letters that aren't present in the easel or the scrabbleboard should be invalid", () => {
        const position: Vec2 = { x: 7, y: 7 };
        const orientation = 'h';
        const word = 'fil';
        expect(service.placeCommand(position, orientation, word, INDEX_REAL_PLAYER)).toBeFalse();
    });

    it('placing letters present in the easel or the scrabbleboard should be valid', () => {
        // Player 1 places the first word
        let position: Vec2 = { x: 7, y: 7 };
        let orientation = 'h';
        let word = 'abcd';
        service.placeCommand(position, orientation, word, INDEX_REAL_PLAYER);
        // Player 2 tries to vertically place a word while using letters already on the scrabbleBoard
        position = { x: 10, y: 6 };
        orientation = 'v';
        word = 'adbcc';
        let isWordValid = service.isWordValid(position, orientation, word, INDEX_PLAYER_AI);
        // Player 2 tries to horizontally place a word while using letters already on the scrabbleBoard
        position = { x: 10, y: 7 };
        orientation = 'h';
        word = 'daah';
        isWordValid = service.isWordValid(position, orientation, word, INDEX_PLAYER_AI);
        expect(isWordValid).toBeTrue();
    });

    it('placing a word containing a white letter (*) which is present in the easel should be valid', () => {
        const position: Vec2 = { x: 7, y: 7 };
        const orientation = 'h';
        const word = 'bOa'; // white letter is used as 'O'
        expect(service.isWordValid(position, orientation, word, INDEX_PLAYER_AI)).toBeTrue();
    });

    it("placing letters that doesn't form a valid word should be removed from scrabbleBoard", () => {
        service['wordValidationService'].validateAllWordsOnBoard = jasmine.createSpy().and.returnValue({ validation: false, score: 0 });
        // Player 1 places an invalid word
        const position: Vec2 = { x: 7, y: 7 };
        const orientation = 'h';
        const word = 'abcd';
        expect(service.placeCommand(position, orientation, word, INDEX_REAL_PLAYER)).toBeFalse();
    });

    it('only the invalid letters that we just placed should be removed from scrabbleBoard', () => {
        spyOn(service['skipTurnService'], 'switchTurn');
        // Player 1 places the 1st word
        let position: Vec2 = { x: 7, y: 7 };
        let orientation = 'h';
        let word = 'bac';
        service.placeCommand(position, orientation, word, INDEX_REAL_PLAYER);

        // Player 2 places an invalid word on top of the previous one
        service['wordValidationService'].validateAllWordsOnBoard = jasmine.createSpy().and.returnValue({ validation: false, score: 0 });
        jasmine.clock().install();
        // Horizontally
        position = { x: 7, y: 7 };
        orientation = 'h';
        word = 'bacchaV';
        let lettersRemoved = service.placeCommand(position, orientation, word, INDEX_PLAYER_AI);
        jasmine.clock().tick(THREE_SECONDS_DELAY + 1);
        expect(lettersRemoved).toBeFalse();
        // Vertically
        position = { x: 7, y: 7 };
        orientation = 'v';
        word = 'bEcchaa';
        lettersRemoved = service.placeCommand(position, orientation, word, INDEX_PLAYER_AI);
        jasmine.clock().tick(THREE_SECONDS_DELAY + 1);
        expect(lettersRemoved).toBeFalse();
        jasmine.clock().uninstall();
    });

    it('placing a word on top of a different existing word should be invalid', () => {
        spyOn(service['skipTurnService'], 'switchTurn');
        service['wordValidationService'].validateAllWordsOnBoard = jasmine.createSpy().and.returnValue({ validation: true, score: 0 });
        jasmine.clock().install();
        // Player 1 places the 1st word
        const position: Vec2 = { x: 7, y: 7 };
        const orientation = 'h';
        let word = 'aabb';
        service.placeCommand(position, orientation, word, INDEX_REAL_PLAYER);
        // Player 1 horizontally places a second word on top of the 1st word that has different letters
        word = 'ccd';
        jasmine.clock().tick(THREE_SECONDS_DELAY + 1);
        expect(service.placeCommand(position, orientation, word, INDEX_REAL_PLAYER)).toBeFalse();
        jasmine.clock().uninstall();
    });
    it('calling placeMethodAdapter() should call placeCommand()', () => {
        service['wordValidationService'].validateAllWordsOnBoard = jasmine.createSpy().and.returnValue({ validation: false, score: 0 });
        const spy = spyOn(service, 'placeCommand').and.callThrough();
        const start: Vec2 = { x: 7, y: 7 };
        const orientation = 'h';
        const word = 'dab';
        const object = { start, orientation, word, indexPlayer: 1 };
        service.placeMethodAdapter(object);
        expect(spy).toHaveBeenCalled();
    });

    it('placing letters in the easel with the keyboard should be valid', () => {
        const position: Vec2 = { x: 7, y: 7 };
        const orientation = 'h';
        const word = 'abcd';
        let isPlacementValid = true;
        for (let i = 0; i < word.length; i++) {
            if (!service.placeWithKeyboard(position, word[i], orientation, i, INDEX_REAL_PLAYER)) isPlacementValid = false;
            position.x++;
        }
        expect(isPlacementValid).toBeTrue();
    });

    it('placing letters that are not in the easel with the keyboard should be valid', () => {
        const position: Vec2 = { x: 7, y: 7 };
        const orientation = 'h';
        const word = 'zyx';
        let isPlacementValid = true;
        for (let i = 0; i < word.length; i++) {
            if (!service.placeWithKeyboard(position, word[i], orientation, i, INDEX_REAL_PLAYER)) isPlacementValid = false;
            position.x++;
        }
        expect(isPlacementValid).toBeFalse();
    });

    it('validating multiple valid keyboard placements should return true', () => {
        spyOn(service, 'isWordTouchingOthers').and.returnValue(true);
        service.isFirstRound = true;
        let position: Vec2 = { x: 7, y: 7 };
        let orientation = 'h';
        const word = 'abcd';
        expect(service.validateKeyboardPlacement(position, orientation, word, INDEX_REAL_PLAYER)).toBeTrue();
        service.isFirstRound = false;
        position = { x: 7, y: 8 };
        orientation = 'v';
        expect(service.validateKeyboardPlacement(position, orientation, word, INDEX_REAL_PLAYER)).toBeTrue();
    });

    it('validating multiple unvalid keyboard placements should return false', () => {
        service.isFirstRound = true;
        let position: Vec2 = { x: 10, y: 10 };
        const orientation = 'h';
        const word = 'abcd';
        expect(service.validateKeyboardPlacement(position, orientation, word, INDEX_REAL_PLAYER)).toBeFalse();
        service.isFirstRound = false;
        position = { x: 1, y: 1 };
        expect(service.validateKeyboardPlacement(position, orientation, word, INDEX_REAL_PLAYER)).toBeFalse();
    });

    it('validating the first unvalid keyboard placement should return false', () => {
        service.isFirstRound = true;
        const position: Vec2 = { x: 10, y: 10 };
        const orientation = 'h';
        const word = 'abcd';
        expect(service.validateKeyboardPlacement(position, orientation, word, INDEX_REAL_PLAYER)).toBeFalse();
    });

    it('placing all the letters from the easel to form a valid word should give a bonus', () => {
        service['wordValidationService'].validateAllWordsOnBoard = jasmine.createSpy().and.returnValue({ validation: true, score: 0 });
        const position: Vec2 = { x: 7, y: 7 };
        const orientation = 'h';
        const word = 'abah*cc';
        service.placeCommand(position, orientation, word, INDEX_PLAYER_AI);
        expect(service.isEaselSize).toBeTrue();
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
