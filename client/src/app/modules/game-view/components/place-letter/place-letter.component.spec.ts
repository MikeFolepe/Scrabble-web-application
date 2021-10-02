/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { INDEX_PLAYER_IA, THREE_SECONDS_DELAY, INDEX_REAL_PLAYER } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { Player } from '@app/models/player.model';
import { GridService } from '@app/services/grid.service';
// eslint-disable-next-line no-restricted-imports
import { WordValidationComponent } from '../word-validation/word-validation.component';
import { PlaceLetterComponent } from './place-letter.component';

describe('PlaceLetterComponent', () => {
    let component: PlaceLetterComponent;
    let gridServiceSpy: unknown;
    let fixture: ComponentFixture<PlaceLetterComponent>;

    beforeEach(() => {
        gridServiceSpy = jasmine.createSpyObj('GridService', ['drawLetter', 'eraseLetter']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlaceLetterComponent, WordValidationComponent],
            providers: [{ provide: GridService, useValue: gridServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlaceLetterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
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
        component['playerService'].addPlayer(firstPlayer);
        const secondPlayerEasel = [letterA, letterA, letterB, letterC, letterC, letterH, letterWhite];
        const secondPlayer = new Player(2, 'Player 2', secondPlayerEasel);
        component['playerService'].addPlayer(secondPlayer);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('word placed outside the grid should be invalid', () => {
        const position: Vec2 = { x: 12, y: 12 };
        let orientation = 'h';
        const word = 'douleur';
        expect(component.isWordFitting(position, orientation, word)).toEqual(false); // Horizontally
        orientation = 'v';
        expect(component.isWordFitting(position, orientation, word)).toEqual(false); // Vertically
    });
    it('word placed inside the grid should be valid', () => {
        const position: Vec2 = { x: 2, y: 7 };
        const orientation = 'h';
        const word = 'cadeau';
        expect(component.isWordFitting(position, orientation, word)).toEqual(true);
    });
    it('first word placed on central case should be valid', () => {
        const position: Vec2 = { x: 7, y: 7 }; // central case H8
        let orientation = 'h';
        const word = 'office';
        expect(component.isFirstWordValid(position, orientation, word)).toEqual(true);
        orientation = 'v';
        expect(component.isFirstWordValid(position, orientation, word)).toEqual(true);
    });
    it('first word not placed on central case should be invalid', () => {
        const position: Vec2 = { x: 2, y: 9 };
        const orientation = 'v';
        const word = 'stage';
        expect(component.isFirstWordValid(position, orientation, word)).toEqual(false);
    });
    it('word placed on the following rounds should be valid if he touches other words', () => {
        // Fake these methods to be able to call place()
        spyOn(component['playerService'], 'removeLetter');
        spyOn(component['playerService'], 'refillEasel');
        spyOn(component['letterService'], 'writeMessage');
        spyOn(component.wordValidator, 'validateAllWordsOnBoard').and.returnValue({ validation: true, score: 0 });
        // Place first word
        let position: Vec2 = { x: 7, y: 7 };
        let orientation = 'h';
        let word = 'bac';
        component.place(position, orientation, word, INDEX_REAL_PLAYER);
        // Try to place a word vertically while touching the previous word placed
        position = { x: 6, y: 10 };
        orientation = 'v';
        word = 'cba';
        let isWordTouching = component.isWordTouchingOthers(position, orientation, word);
        // Try to place a word horizontally while touching the previous word placed
        position = { x: 8, y: 4 };
        orientation = 'h';
        word = 'dabb';
        isWordTouching = component.isWordTouchingOthers(position, orientation, word);

        expect(isWordTouching).toEqual(true);
    });
    it("word placed on the following rounds should be invalid if he's not touching others", () => {
        // Fake these methods to be able to call place()
        spyOn(component['playerService'], 'removeLetter');
        spyOn(component['playerService'], 'refillEasel');
        spyOn(component['letterService'], 'writeMessage');
        spyOn(component.wordValidator, 'validateAllWordsOnBoard').and.returnValue({ validation: true, score: 0 });
        // Place first word
        let position: Vec2 = { x: 7, y: 7 };
        let orientation = 'v';
        let word = 'bac';
        component.place(position, orientation, word, INDEX_REAL_PLAYER);
        // Try to place a word vertically without touching the previous word placed
        position = { x: 11, y: 13 };
        orientation = 'v';
        word = 'acab';
        const isWordTouching = component.isWordTouchingOthers(position, orientation, word);
        expect(isWordTouching).toEqual(false);
    });
    it("placing letters that aren't present in the easel or the scrabbleboard should be invalid", () => {
        // Fake these methods to be able to call place()
        spyOn(component['playerService'], 'removeLetter');
        spyOn(component['playerService'], 'refillEasel');
        spyOn(component['letterService'], 'writeMessage');
        spyOn(component.wordValidator, 'validateAllWordsOnBoard').and.returnValue({ validation: true, score: 0 });
        const position: Vec2 = { x: 7, y: 7 };
        const orientation = 'h';
        const word = 'fil';
        expect(component.place(position, orientation, word, INDEX_REAL_PLAYER)).toEqual(false);
    });
    it('placing letters present in the easel or the scrabbleboard should be valid', () => {
        // Fake these methods to be able to call place()
        spyOn(component['playerService'], 'removeLetter');
        spyOn(component['playerService'], 'refillEasel');
        spyOn(component['letterService'], 'writeMessage');
        spyOn(component.wordValidator, 'validateAllWordsOnBoard').and.returnValue({ validation: true, score: 0 });
        // Player 1 places the first word
        let position: Vec2 = { x: 7, y: 7 };
        let orientation = 'h';
        let word = 'abcd';
        component.place(position, orientation, word, INDEX_REAL_PLAYER);
        // Player 2 tries to vertically place a word while using letters already on the scrabbleBoard
        position = { x: 6, y: 10 };
        orientation = 'v';
        word = 'adbbc';
        let isWordValid = component.isWordValid(position, orientation, word, INDEX_PLAYER_IA);
        // Player 2 tries to horizontally place a word while using letters already on the scrabbleBoard
        position = { x: 7, y: 10 };
        orientation = 'h';
        word = 'daaa';
        isWordValid = component.isWordValid(position, orientation, word, INDEX_PLAYER_IA);
        expect(isWordValid).toEqual(true);
    });
    it('placing a word containing a white letter (*) which is present in the easel should be valid', () => {
        const position: Vec2 = { x: 7, y: 7 };
        const orientation = 'h';
        const word = 'bOa'; // white letter is used as 'O'
        expect(component.isWordValid(position, orientation, word, INDEX_PLAYER_IA)).toEqual(true);
    });
    it("placing letters that doesn't form a valid word should be removed from scrabbleBoard", () => {
        // Fake these methods to be able to call place()
        spyOn(component['playerService'], 'removeLetter');
        spyOn(component['playerService'], 'refillEasel');
        spyOn(component['letterService'], 'writeMessage');
        spyOn(component.wordValidator, 'validateAllWordsOnBoard').and.returnValue({ validation: false, score: 0 });
        // Player 1 places an invalid word
        const position: Vec2 = { x: 7, y: 7 };
        const orientation = 'h';
        const word = 'abcd';
        expect(component.place(position, orientation, word, INDEX_REAL_PLAYER)).toEqual(false);
    });
    it('only the invalid letters that we just placed should be removed from scrabbleBoard', () => {
        // Fake these methods to be able to call place()
        spyOn(component['playerService'], 'removeLetter');
        spyOn(component['playerService'], 'refillEasel');
        spyOn(component['letterService'], 'writeMessage');
        spyOn(component.wordValidator, 'validateAllWordsOnBoard').and.returnValue({ validation: true, score: 0 });
        // Player 1 places the 1st word
        let position: Vec2 = { x: 7, y: 7 };
        let orientation = 'h';
        let word = 'bac';
        component.place(position, orientation, word, INDEX_REAL_PLAYER);

        // Player 2 places an invalid word on top of the previous one
        component.wordValidator.validateAllWordsOnBoard = jasmine.createSpy().and.returnValue({ validation: false, score: 0 });
        jasmine.clock().install();
        // Horizontally
        position = { x: 7, y: 7 };
        orientation = 'h';
        word = 'bacbhhV';
        let lettersRemoved = component.place(position, orientation, word, INDEX_PLAYER_IA);
        jasmine.clock().tick(THREE_SECONDS_DELAY + 1);
        expect(lettersRemoved).toEqual(false);
        // Vertically
        position = { x: 7, y: 7 };
        orientation = 'v';
        word = 'bEcchhL';
        lettersRemoved = component.place(position, orientation, word, INDEX_PLAYER_IA);
        jasmine.clock().tick(THREE_SECONDS_DELAY + 1);
        expect(lettersRemoved).toEqual(false);
        jasmine.clock().uninstall();
    });
    it('placing a word on top of a different existing word should be invalid', () => {
        // Fake these methods to be able to call place()
        spyOn(component['playerService'], 'removeLetter');
        spyOn(component['playerService'], 'refillEasel');
        spyOn(component['letterService'], 'writeMessage');
        spyOn(component.wordValidator, 'validateAllWordsOnBoard').and.returnValue({ validation: false, score: 0 });
        // Player 1 places the 1st word
        const position: Vec2 = { x: 7, y: 7 };
        const orientation = 'h';
        let word = 'aaaa';
        component.place(position, orientation, word, INDEX_REAL_PLAYER);
        // Player 1 places a second word on top of the 1st word that has different letters
        word = 'baaa';
        expect(component.place(position, orientation, word, INDEX_REAL_PLAYER)).toEqual(false);
    });
    it('calling placeMethodAdapter() should call place()', () => {
        // Fake these methods to be able to call place()
        spyOn(component['playerService'], 'removeLetter');
        spyOn(component['playerService'], 'refillEasel');
        spyOn(component['letterService'], 'writeMessage');
        spyOn(component.wordValidator, 'validateAllWordsOnBoard').and.returnValue({ validation: false, score: 0 });
        const spy = spyOn(component, 'place').and.callThrough();
        const start: Vec2 = { x: 7, y: 7 };
        const orientation = 'h';
        const word = 'dab';
        const indexPlayer = INDEX_REAL_PLAYER;
        const object = { start, orientation, word, indexPlayer };
        component.placeMethodAdapter(object);
        // spyOn<any>(component, 'place');
        expect(spy).toHaveBeenCalled();
    });
});
