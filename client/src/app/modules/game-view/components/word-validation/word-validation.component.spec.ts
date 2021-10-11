/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BOARD_COLUMNS, BOARD_ROWS } from '@app/classes/constants';
import { ScoreValidation } from '@app/classes/validation-score';
import { WordValidationComponent } from './word-validation.component';

describe('WordValidationComponent', () => {
    let component: WordValidationComponent;
    let fixture: ComponentFixture<WordValidationComponent>;
    const scrabbleBoard: string[][] = [];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WordValidationComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WordValidationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.newPlayedWords.clear();
        for (let i = 0; i < BOARD_ROWS; i++) {
            scrabbleBoard[i] = [];
            for (let j = 0; j < BOARD_COLUMNS; j++) {
                // To generate a grid with some letters anywhere on it
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                if ((i + j) % 11 === 0) {
                    scrabbleBoard[i][j] = 'X';
                } else {
                    scrabbleBoard[i][j] = '';
                }
            }
        }
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('should pass through all rows and columns', () => {
    //     component.newWords = ['', 'mais', ''];
    //     component.newPlayedWords.set('tumour', ['B2', 'B3', 'B4', 'B5', 'B6', 'B7']);
    //     component.playedWords.set('ma', ['C1', 'C2']);
    //     const isEaselSize = true;
    //     const isRow = true;
    //     const passThroughAllRowsOrColumnsSpy = spyOn<any>(component, 'passThroughAllRowsOrColumns').and.callThrough();
    //     const calculateLettersScoreSpy = spyOn<any>(component, 'calculateLettersScore').and.callThrough();
    //     component.validateAllWordsOnBoard(scrabbleBoard, isEaselSize, isRow);
    //     expect(passThroughAllRowsOrColumnsSpy).toHaveBeenCalledTimes(2);
    //     expect(calculateLettersScoreSpy).toHaveBeenCalled();
    // });

    it('should calculateLetterScore and calculate word bonuses if the word touch a wordBonuses position', () => {
        component.newWords = ['', 'mais', ''];
        component.newPlayedWords.set('mAsse', ['A1', 'A2', 'A3', 'A4', 'A5']);
        component.playedWords.set('mAsse', ['A1', 'A2', 'A3', 'A4', 'A5']);
        const isEaselSize = false;
        const isRow = true;
        const passThroughAllRowsOrColumnsSpy = spyOn<any>(component, 'passThroughAllRowsOrColumns').and.callThrough();
        const calculateLettersScoreSpy = spyOn<any>(component, 'calculateLettersScore').and.callThrough();
        const applyBonusesWordSpy = spyOn<any>(component, 'applyBonusesWord').and.callThrough();
        component.validateAllWordsOnBoard(scrabbleBoard, isEaselSize, isRow);
        expect(passThroughAllRowsOrColumnsSpy).toHaveBeenCalledTimes(2);
        expect(calculateLettersScoreSpy).toHaveBeenCalled();
        expect(applyBonusesWordSpy).toHaveBeenCalled();
        // m has 2 points and a has 1 point
    });

    it('validate all words should be false once one word is not valid in dictionnary', () => {
        component.newWords = ['', 'is', ''];
        component.newPlayedWords.set('nrteu', ['A1', 'A2', 'A3', 'A4', 'A5']);
        component.playedWords.set('ma', ['B1', 'B2']);
        const isEaselSize = true;
        const isRow = true;
        const expectedResult: ScoreValidation = { validation: false, score: 0 };
        const result = component.validateAllWordsOnBoard(scrabbleBoard, isEaselSize, isRow);
        expect(result).toEqual(expectedResult);
        // m has 2 points and a has 1 point
    });

    it('check if not played should return true if there is no matching played word', () => {
        component.playedWords.set('', []);
        const result = component.checkIfNotPlayed('ma', ['A1', 'A2']);
        expect(result).toEqual(true);
    });

    it('check if not played should return false if there is already a played word at the given position', () => {
        component.playedWords.set('ma', ['A1', 'A2']);
        const result = component.checkIfNotPlayed('ma', ['A1', 'A2']);
        expect(result).toEqual(false);
    });

    it('should be false if word is not valid in dictionnary', () => {
        const expectedResult = false;
        const isValid = component.isValidInDictionary('npm');
        expect(isValid).toEqual(expectedResult);
    });

    it('should be false if word has less than 2 letters', () => {
        const expectedResult = false;
        const isValid = component.isValidInDictionary('n');
        expect(isValid).toEqual(expectedResult);
    });

    it('should be true if word is valid in dictionnary', () => {
        const expectedResult = true;
        const isValid = component.isValidInDictionary('vrai');
        expect(isValid).toEqual(expectedResult);
    });

    it('add to playedWords should add the new position to the words map if the concerned word is already played', () => {
        const word = 'ma';
        const positions = ['H8', 'H9'];
        const playedWordsStub: Map<string, string[]> = new Map();
        playedWordsStub.set('ma', ['A1', 'A2']);
        component.addToPlayedWords(word, positions, playedWordsStub);
        expect(playedWordsStub.get(word)).toEqual(['A1', 'A2', 'H8', 'H9']);
    });

    it('should correctly return the letters positions of the vertically given word', () => {
        component.newWords = ['', '', '', 'm', 'a', ''];
        const word = 'ma';
        const index = 7;
        const expectedPositions = ['D8', 'E8'];
        const returnedPositions = component.getWordVerticalPositions(word, index);
        expect(returnedPositions).toEqual(expectedPositions);
    });
});
