// <<<<<<< HEAD
// <<<<<<<< HEAD:client/src/app/services/word-validation.service.spec.ts
// import { TestBed } from '@angular/core/testing';
// import { BOARD_COLUMNS, BOARD_ROWS } from '@app/classes/constants';
// ========
// /* eslint-disable @typescript-eslint/no-magic-numbers */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ALL_EASEL_BONUS, BOARD_COLUMNS, BOARD_ROWS } from '@app/classes/constants';
// >>>>>>>> dffd1575caf34a0774757e7f27439194dc0e305b:client/src/app/modules/game-view/components/word-validation/word-validation.component.spec.ts
// =======
// import { TestBed } from '@angular/core/testing';
// import { BOARD_COLUMNS, BOARD_ROWS } from '@app/classes/constants';
// >>>>>>> dffd1575caf34a0774757e7f27439194dc0e305b
// import { ScoreValidation } from '@app/classes/validation-score';
// import { WordValidationService } from './word-validation.service';

// describe('WordValidationService', () => {
//     let service: WordValidationService;
//     const scrabbleBoard: string[][] = [];
// <<<<<<< HEAD
//     beforeEach(() => {
//         TestBed.configureTestingModule({});
//         service = TestBed.inject(WordValidationService);
//         service.newPlayedWords.clear();
// =======

//     beforeEach(() => {
//         TestBed.configureTestingModule({});
//         service = TestBed.inject(WordValidationService);
// >>>>>>> dffd1575caf34a0774757e7f27439194dc0e305b
//         for (let i = 0; i < BOARD_ROWS; i++) {
//             scrabbleBoard[i] = [];
//             for (let j = 0; j < BOARD_COLUMNS; j++) {
//                 // To generate a grid with some letters anywhere on it
// <<<<<<< HEAD
// =======
//                 // eslint-disable-next-line @typescript-eslint/no-magic-numbers
// >>>>>>> dffd1575caf34a0774757e7f27439194dc0e305b
//                 if ((i + j) % 11 === 0) {
//                     scrabbleBoard[i][j] = 'X';
//                 } else {
//                     scrabbleBoard[i][j] = '';
//                 }
//             }
//         }
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

//     it('should pass through all rows and columns', () => {
// <<<<<<< HEAD
// <<<<<<<< HEAD:client/src/app/services/word-validation.service.spec.ts
//         service.newWords = ['', 'mais', ''];
//         service.newPlayedWords.set('tumour', ['B2', 'B3', 'B4', 'B5', 'B6', 'B7']);
//         service.playedWords.set('ma', ['C1', 'C2']);
//         const isEaselSize = true;
//         const isRow = true;
//         const passThroughAllRowsOrColumnsSpy = spyOn(service, 'passThroughAllRowsOrColumns').and.callThrough();
//         // const calculateLettersScoreSpy = spyOn<any>(service, 'calculateLettersScore').and.callThrough();
//         service.validateAllWordsOnBoard(scrabbleBoard, isEaselSize, isRow);
//         expect(passThroughAllRowsOrColumnsSpy).toHaveBeenCalledTimes(2);
//         // expect(calculateLettersScoreSpy).toHaveBeenCalled();
// ========
//         component.newWords = ['', 'mais', ''];
//         component.newPlayedWords.set('mAsse', ['A1', 'A2', 'A3', 'A4', 'A5']);
//         component.playedWords.set('mAsse', ['A1', 'A2', 'A3', 'A4', 'A5']);
//         const isEaselSize = true;
//         const isRow = true;
//         const passThroughAllRowsOrColumnsSpy = spyOn<any>(component, 'passThroughAllRowsOrColumns').and.callThrough();
//         component.validateAllWordsOnBoard(scrabbleBoard, isEaselSize, isRow);
//         expect(passThroughAllRowsOrColumnsSpy).toHaveBeenCalledTimes(2);
// >>>>>>>> dffd1575caf34a0774757e7f27439194dc0e305b:client/src/app/modules/game-view/components/word-validation/word-validation.component.spec.ts
// =======
//         service.newWords = ['', 'mais', ''];
//         service.newPlayedWords.set('mAsse', ['A1', 'A2', 'A3', 'A4', 'A5']);
//         service.playedWords.set('mAsse', ['A1', 'A2', 'A3', 'A4', 'A5']);
//         const isEaselSize = true;
//         const passThroughAllRowsSpy = spyOn(service, 'passTroughAllRows').and.callThrough();
//         const passThroughAllCollumnsSpy = spyOn(service, 'passThroughAllColumns').and.callThrough();
//         const calculateLettersScoreSpy = spyOn(service, 'calculateLettersScore').and.callThrough();
//         service.validateAllWordsOnBoard(scrabbleBoard, isEaselSize);
//         expect(passThroughAllRowsSpy).toHaveBeenCalledTimes(1);
//         expect(passThroughAllCollumnsSpy).toHaveBeenCalledTimes(1);
//         expect(calculateLettersScoreSpy).toHaveBeenCalled();
// >>>>>>> dffd1575caf34a0774757e7f27439194dc0e305b
//     });

//     it('should calculateLetterScore and calculate word bonuses if the word touch a wordBonuses position', () => {
//         service.newWords = ['', 'mais', ''];
//         service.newPlayedWords.set('mAsse', ['A1', 'A2', 'A3', 'A4', 'A5']);
//         service.playedWords.set('mAsse', ['A1', 'A2', 'A3', 'A4', 'A5']);
//         const isEaselSize = false;
// <<<<<<< HEAD
//         const isRow = true;
// <<<<<<<< HEAD:client/src/app/services/word-validation.service.spec.ts
//         const passThroughAllRowsOrColumnsSpy = spyOn(service, 'passThroughAllRowsOrColumns').and.callThrough();
//         const calculateLettersScoreSpy = spyOn(service, 'calculateLettersScore').and.callThrough();
//         const applyBonusesWordSpy = spyOn(service, 'applyBonusesWord').and.callThrough();
//         service.validateAllWordsOnBoard(scrabbleBoard, isEaselSize, isRow);
// ========
//         const passThroughAllRowsOrColumnsSpy = spyOn<any>(component, 'passThroughAllRowsOrColumns').and.callThrough();
//         const calculateTotalScoreSpy = spyOn<any>(component, 'calculateTotalScore').and.callThrough();
//         const applyBonusesWordSpy = spyOn<any>(component, 'applyBonusesWord').and.callThrough();
//         component.validateAllWordsOnBoard(scrabbleBoard, isEaselSize, isRow);
// >>>>>>>> dffd1575caf34a0774757e7f27439194dc0e305b:client/src/app/modules/game-view/components/word-validation/word-validation.component.spec.ts
//         expect(passThroughAllRowsOrColumnsSpy).toHaveBeenCalledTimes(2);
//         expect(calculateTotalScoreSpy).toHaveBeenCalled();
// =======
//         const passThroughAllRowsSpy = spyOn(service, 'passTroughAllRows').and.callThrough();
//         const passThroughAllCollumnsSpy = spyOn(service, 'passThroughAllColumns').and.callThrough();
//         const calculateLettersScoreSpy = spyOn(service, 'calculateLettersScore').and.callThrough();
//         const applyBonusesWordSpy = spyOn(service, 'applyBonusesWord').and.callThrough();
//         service.validateAllWordsOnBoard(scrabbleBoard, isEaselSize);
//         expect(passThroughAllRowsSpy).toHaveBeenCalledTimes(1);
//         expect(passThroughAllCollumnsSpy).toHaveBeenCalledTimes(1);
//         expect(calculateLettersScoreSpy).toHaveBeenCalled();
// >>>>>>> dffd1575caf34a0774757e7f27439194dc0e305b
//         expect(applyBonusesWordSpy).toHaveBeenCalled();
//         // m has 2 points and a has 1 point
//     });

// <<<<<<< HEAD
//     it('should double word score if word is placed on a double word case', () => {
//         spyOn(component.bonusesPositions, 'get').and.returnValue('doubleword');
//         const initialScore = 10;
//         const score = component.applyBonusesWord(initialScore, 'a');
//         expect(score).toEqual(initialScore * 2);
//     });

//     it('should triple letter score if word is placed on a triple letter case', () => {
//         spyOn(component.bonusesPositions, 'get').and.returnValue('tripleletter');
//         const initialScore = 10;
//         const score = component.calculateLettersScore(initialScore, 'a', 'a');
//         expect(score).toEqual(initialScore + 3);
//     });

//     it('should add easel bonus when condition encountered and validateAllWordsOnBoard() is called', () => {
//         const initialScore = 100;
//         spyOn(component, 'calculateTotalScore').and.returnValue(initialScore);
//         const result = component.validateAllWordsOnBoard(scrabbleBoard, true, true);
//         expect(result.score).toEqual(initialScore + ALL_EASEL_BONUS);
//     });

//     it('should call the right functions in case word is greater than two letters in passThroughAllRowsOrColumns()', () => {
//         const spyOnHorizontal = spyOn(component, 'getWordHorizontalPositions');
//         const spyOnVertical = spyOn(component, 'getWordVerticalPositions');
//         const spyOnCheck = spyOn(component, 'checkIfNotPlayed');

//         component.newWords = ['test'];
//         component.passThroughAllRowsOrColumns(scrabbleBoard, true);

//         component.newWords = ['test'];
//         component.passThroughAllRowsOrColumns(scrabbleBoard, false);

//         expect(spyOnHorizontal).toHaveBeenCalledTimes(1);
//         expect(spyOnVertical).toHaveBeenCalledTimes(1);
//         expect(spyOnCheck).toHaveBeenCalledTimes(2);
//     });

// =======
// >>>>>>> dffd1575caf34a0774757e7f27439194dc0e305b
//     it('validate all words should be false once one word is not valid in dictionnary', () => {
//         service.newWords = ['', 'is', ''];
//         service.newPlayedWords.set('nrteu', ['A1', 'A2', 'A3', 'A4', 'A5']);
//         service.playedWords.set('ma', ['B1', 'B2']);
//         const isEaselSize = true;
// <<<<<<< HEAD
//         const isRow = true;
//         const expectedResult: ScoreValidation = { validation: false, score: 0 };
//         const result = service.validateAllWordsOnBoard(scrabbleBoard, isEaselSize, isRow);
// =======
//         const expectedResult: ScoreValidation = { validation: false, score: 0 };
//         const result = service.validateAllWordsOnBoard(scrabbleBoard, isEaselSize);
// >>>>>>> dffd1575caf34a0774757e7f27439194dc0e305b
//         expect(result).toEqual(expectedResult);
//         // m has 2 points and a has 1 point
//     });

//     it('check if not played should return true if there is no matching played word', () => {
//         service.playedWords.set('', []);
//         const result = service.checkIfNotPlayed('ma', ['A1', 'A2']);
//         expect(result).toEqual(true);
//     });

//     it('check if not played should return false if there is already a played word at the given position', () => {
//         service.playedWords.set('ma', ['A1', 'A2']);
//         const result = service.checkIfNotPlayed('ma', ['A1', 'A2']);
//         expect(result).toEqual(false);
//     });

//     it('should be false if word is not valid in dictionnary', () => {
//         const expectedResult = false;
//         const isValid = service.isValidInDictionary('npm');
//         expect(isValid).toEqual(expectedResult);
//     });

//     it('should be false if word has less than 2 letters', () => {
//         const expectedResult = false;
//         const isValid = service.isValidInDictionary('n');
//         expect(isValid).toEqual(expectedResult);
//     });

//     it('should be true if word is valid in dictionnary', () => {
//         const expectedResult = true;
//         const isValid = service.isValidInDictionary('vrai');
//         expect(isValid).toEqual(expectedResult);
//     });

//     it('add to playedWords should add the new position to the words map if the concerned word is already played', () => {
//         const word = 'ma';
//         const positions = ['H8', 'H9'];
//         const playedWordsStub: Map<string, string[]> = new Map();
//         playedWordsStub.set('ma', ['A1', 'A2']);
//         service.addToPlayedWords(word, positions, playedWordsStub);
//         expect(playedWordsStub.get(word)).toEqual(['A1', 'A2', 'H8', 'H9']);
//     });

//     it('should correctly return the letters positions of the vertically given word', () => {
//         service.newWords = ['', '', '', 'm', 'a', ''];
//         const word = 'ma';
//         const index = 7;
//         const expectedPositions = ['D8', 'E8'];
// <<<<<<< HEAD
//         const returnedPositions = service.getWordVerticalPositions(word, index);
//         expect(returnedPositions).toEqual(expectedPositions);
//     });
// });

// =======
//         const returnedPositions = service.getWordPositionsVertical(word, index);
//         expect(returnedPositions).toEqual(expectedPositions);
//     });
// });
// >>>>>>> dffd1575caf34a0774757e7f27439194dc0e305b
