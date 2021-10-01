/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { Player } from '@app/models/player.model';
import { GridService } from '@app/services/grid.service';
import { WordValidationComponent } from '../word-validation/word-validation.component';
import { PlaceLetterComponent } from './place-letter.component';
import { INDEX_PLAYER_IA, INDEX_REAL_PLAYER } from '@app/classes/constants';

fdescribe('PlaceLetterComponent', () => {
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
        const position: Vec2 = { x: 7, y: 7 };
        const orientation = 'h';
        const word = 'fil';
        expect(component.isWordValid(position, orientation, word, INDEX_REAL_PLAYER)).toEqual(false);
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
});
