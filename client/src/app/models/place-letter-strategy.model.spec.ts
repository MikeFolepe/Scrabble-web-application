// /* eslint-disable @typescript-eslint/no-magic-numbers */
// /* eslint-disable max-lines */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable dot-notation */
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { BOARD_COLUMNS, BOARD_ROWS } from '@app/classes/constants';
// import { BoardPattern, Orientation, PatternInfo, PossibleWords } from '@app/classes/scrabble-board-pattern';
// import { PlayerAI } from '@app/models/player-ai.model';
// import { PlayerAIService } from '@app/services/player-ai.service';
// import { Letter } from '@common/letter';
// import { PlaceLetterStrategy } from './place-letter-strategy.model';

// describe('Place Letter strategy', () => {
//     let playerAi: PlayerAI;
//     let placeStrategy: PlaceLetterStrategy;
//     let playerAiService: PlayerAIService;
//     const scrabbleBoard: string[][] = [];
//     let letterTable: Letter[] = [];
//     beforeEach(async () => {
//         await TestBed.configureTestingModule({
//             imports: [HttpClientTestingModule, RouterTestingModule],
//             providers: [{ provide: PlaceLetterStrategy, useValue: placeStrategy }],
//         }).compileComponents();
//         placeStrategy = TestBed.inject(PlaceLetterStrategy);
//     });

//     beforeEach(() => {
//         const id = 1;
//         const name = 'PlayerAI';
//         letterTable = [
//             { value: 'A', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'B', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'C', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'D', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'E', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'F', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'G', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//         ];
//         playerAi = new PlayerAI(id, name, letterTable, playerAiService);
//         playerAiService = TestBed.inject(PlayerAIService);
//         playerAiService.playerService.players[1] = playerAi;
//         for (let i = 0; i < BOARD_COLUMNS; i++) {
//             scrabbleBoard[i] = [];
//             for (let j = 0; j < BOARD_ROWS; j++) {
//                 scrabbleBoard[i][j] = '';
//             }
//         }
//     });

//     it('should create an instance', () => {
//         expect(playerAi).toBeTruthy();
//         expect(playerAiService).toBeTruthy();
//         expect(scrabbleBoard).toBeTruthy();
//     });

//     it('should create all patterns by replacing empty cases by playerHand letters pattern', () => {
//         scrabbleBoard[0][3] = 'p';
//         scrabbleBoard[1][3] = 'a';
//         scrabbleBoard[2][3] = 'r';
//         scrabbleBoard[3][3] = 'i';
//         scrabbleBoard[4][3] = 's';
//         scrabbleBoard[2][6] = 'o';
//         scrabbleBoard[3][6] = 'u';
//         scrabbleBoard[4][6] = 'r';
//         scrabbleBoard[5][6] = 's';
//         scrabbleBoard[3][2] = 'm';
//         scrabbleBoard[3][4] = 'a';
//         scrabbleBoard[3][5] = 'o';
//         const isFirstRound = false;
//         const horizontal: PatternInfo[] = [];
//         const vertical: PatternInfo[] = [];
//         horizontal.push({ line: 0, pattern: '^[abcdefg]*p[abcdefg]*$' });
//         horizontal.push({ line: 1, pattern: '^[abcdefg]*a[abcdefg]*$' });
//         horizontal.push({ line: 2, pattern: '^[abcdefg]*r[abcdefg]*o[abcdefg]*$' });
//         horizontal.push({ line: 3, pattern: '^[abcdefg]*miaou[abcdefg]*$' });
//         horizontal.push({ line: 4, pattern: '^[abcdefg]*s[abcdefg]*r[abcdefg]*$' });
//         horizontal.push({ line: 5, pattern: '^[abcdefg]*s[abcdefg]*$' });
//         vertical.push({ line: 2, pattern: '^[abcdefg]*m[abcdefg]*$' });
//         vertical.push({ line: 3, pattern: '^paris[abcdefg]*$' });
//         vertical.push({ line: 4, pattern: '^[abcdefg]*a[abcdefg]*$' });
//         vertical.push({ line: 5, pattern: '^[abcdefg]*o[abcdefg]*$' });
//         vertical.push({ line: 6, pattern: '^[abcdefg]*ours[abcdefg]*$' });
//         const expected: BoardPattern = { horizontal, vertical };
//         placeStrategy = new PlaceLetterStrategy();
//         placeStrategy['initializeArray'](scrabbleBoard);
//         expect(placeStrategy['generateAllPatterns']('[ABCDEFG]', isFirstRound)).toEqual(expected);
//     });

//     it('player hand pattern at first round', () => {
//         const isFirstRound = true;
//         const horizontal: PatternInfo[] = [{ line: 7, pattern: '^[abcdefg]*$' }];
//         const vertical: PatternInfo[] = [{ line: 7, pattern: '^[abcdefg]*$' }];
//         const expected: BoardPattern = { horizontal, vertical };
//         placeStrategy = new PlaceLetterStrategy();
//         placeStrategy['initializeArray'](scrabbleBoard);
//         expect(placeStrategy['generateAllPatterns']('[ABCDEFG]', isFirstRound)).toEqual(expected);
//     });

//     it('should find all possible words based on pattern', () => {
//         const horizontal: PatternInfo[] = [];
//         const vertical: PatternInfo[] = [];
//         horizontal.push({ line: 0, pattern: '^[mndacis]*a[mcndais]*$' });
//         vertical.push({ line: 0, pattern: '^[mndacis]*o[mndacis]*$' });
//         const patterns: BoardPattern = { horizontal, vertical };
//         const randomDictionary: string[] = ['moi', 'canada', 'inf2610', 'moins', 'a', 'o'];
//         const expected: PossibleWords[] = [];
//         expected.push({ word: 'canada', orientation: Orientation.Horizontal, line: 0, startIndex: 0, point: 0 });
//         expected.push({ word: 'moi', orientation: Orientation.Vertical, line: 0, startIndex: 0, point: 0 });
//         expected.push({ word: 'moins', orientation: Orientation.Vertical, line: 0, startIndex: 0, point: 0 });
//         placeStrategy = new PlaceLetterStrategy();
//         expect(placeStrategy['generateAllWords'](randomDictionary, patterns)).toEqual(expected);
//     });

//     it('should retain only those he can play in letter quantity', () => {
//         const possibleWords: PossibleWords[] = [];
//         const word1: PossibleWords = { word: 'abc', orientation: Orientation.Horizontal, line: 0, startIndex: 0, point: 0 };
//         const word2: PossibleWords = { word: 'aab', orientation: Orientation.Horizontal, line: 2, startIndex: 0, point: 0 };
//         const word3: PossibleWords = { word: 'abz', orientation: Orientation.Horizontal, line: 4, startIndex: 0, point: 0 };
//         possibleWords.push(word1);
//         possibleWords.push(word2);
//         possibleWords.push(word3);
//         const expected: PossibleWords[] = [];
//         expected.push(word1);
//         expected.push(word3);
//         scrabbleBoard[4][0] = 'z';
//         placeStrategy = new PlaceLetterStrategy();
//         placeStrategy['initializeArray'](scrabbleBoard);
//         expect(placeStrategy['removeIfNotEnoughLetter'](possibleWords, playerAi)).toEqual(expected);
//     });

//     it('should remove all word that are no disposable on the scrabble board', () => {
//         scrabbleBoard[0][0] = 'm';
//         scrabbleBoard[0][2] = 'r';
//         scrabbleBoard[0][5] = 'n';
//         scrabbleBoard[2][0] = 'r';
//         scrabbleBoard[5][0] = 'n';
//         const word1: PossibleWords = { word: 'amar', orientation: Orientation.Horizontal, line: 0, startIndex: 0, point: 0 };
//         const word2: PossibleWords = { word: 'maree', orientation: Orientation.Horizontal, line: 0, startIndex: 0, point: 0 };
//         const word3: PossibleWords = { word: 'martin', orientation: Orientation.Horizontal, line: 0, startIndex: 0, point: 0 };
//         const word4: PossibleWords = { word: 'mare', orientation: Orientation.Horizontal, line: 0, startIndex: 0, point: 0 };
//         const word5: PossibleWords = { word: 'amar', orientation: Orientation.Vertical, line: 0, startIndex: 0, point: 0 };
//         const word6: PossibleWords = { word: 'maree', orientation: Orientation.Vertical, line: 0, startIndex: 0, point: 0 };
//         const word7: PossibleWords = { word: 'martin', orientation: Orientation.Vertical, line: 0, startIndex: 0, point: 0 };
//         const word8: PossibleWords = { word: 'mare', orientation: Orientation.Vertical, line: 0, startIndex: 0, point: 0 };
//         const possibleWord: PossibleWords[] = [];
//         possibleWord.push(word1);
//         possibleWord.push(word2);
//         possibleWord.push(word3);
//         possibleWord.push(word4);
//         possibleWord.push(word5);
//         possibleWord.push(word6);
//         possibleWord.push(word7);
//         possibleWord.push(word8);
//         const expected: PossibleWords[] = [];
//         expected.push(word3);
//         expected.push(word4);
//         expected.push(word7);
//         expected.push(word8);
//         placeStrategy = new PlaceLetterStrategy();
//         placeStrategy['initializeArray'](scrabbleBoard);
//         expect(placeStrategy['removeIfNotDisposable'](possibleWord)).toEqual(expected);
//     });

//     it('should play from the center at first round', async () => {
//         const myDictionary: string[] = ['maths', 'math', 'lundi', 'mardi', 'on'];
//         playerAi.letterTable = [
//             { value: 'H', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'O', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'N', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'T', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'D', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'A', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'R', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//         ];
//         placeStrategy.dictionary = myDictionary;
//         placeStrategy.pointingRange = { min: 1, max: 4 };
//         const spyOnPlace = spyOn<any>(playerAiService, 'place');
//         const word1: PossibleWords = { word: 'on', orientation: Orientation.Horizontal, line: 7, startIndex: 7, point: 2 };
//         const word2: PossibleWords = { word: 'on', orientation: Orientation.Vertical, line: 7, startIndex: 7, point: 2 };

//         const expectedMatching: PossibleWords[] = [];
//         expectedMatching.push(word1);
//         expectedMatching.push(word2);

//         spyOn<any>(playerAiService, 'calculatePoints').and.returnValue(expectedMatching);
//         playerAiService.gameSettingsService.gameSettings.level = 'Difficile';

//         await placeStrategy.execute(playerAiService);
//         expect(spyOnPlace).toHaveBeenCalledWith(word1);
//     });

//     it('computeResult should swap if no possibilities', async () => {
//         const spyOnSwap = spyOn<any>(playerAiService, 'swap');

//         await placeStrategy['computeResults']([], playerAiService);
//         expect(spyOnSwap).toHaveBeenCalledOnceWith(true);
//     });

//     it('computeResult should place if mode is difficult', async () => {
//         const spyOnPlace = spyOn<any>(playerAiService, 'place');
//         const word1: PossibleWords = { word: 'bon', orientation: Orientation.Horizontal, line: 7, startIndex: 7, point: 3 };
//         const word2: PossibleWords = { word: 'on', orientation: Orientation.Vertical, line: 7, startIndex: 7, point: 2 };
//         const words: PossibleWords[] = [];
//         words.push(word1);
//         words.push(word2);

//         await placeStrategy['computeResults'](words, playerAiService, true);
//         expect(spyOnPlace).toHaveBeenCalledWith(word1);
//     });

//     it('computeResult should place if mode is easy', async () => {
//         const spyOnPlace = spyOn<any>(playerAiService, 'place');
//         const word1: PossibleWords = { word: 'bon', orientation: Orientation.Horizontal, line: 7, startIndex: 7, point: 3 };
//         const word2: PossibleWords = { word: 'on', orientation: Orientation.Vertical, line: 7, startIndex: 7, point: 2 };
//         const words: PossibleWords[] = [];
//         words.push(word1);
//         words.push(word2);

//         await placeStrategy['computeResults'](words, playerAiService, false);
//         expect(spyOnPlace).toHaveBeenCalledTimes(1);
//     });

//     it('isWordOverwriting test sample', () => {
//         const line1 = 'moi       majid';
//         const line2 = 'moi      majida';

//         expect(placeStrategy['isWordOverWriting'](line1, 11, 15, 5)).toBeTrue();
//         expect(placeStrategy['isWordOverWriting'](line2, 10, 14, 5)).toBeTrue();
//     });

//     it('removeIfNotEnoughLetter test sample', () => {
//         const allPossibleWords: PossibleWords[] = [{ word: '', orientation: Orientation.Horizontal, line: 0, startIndex: 0, point: 0 }];
//         expect(placeStrategy['removeIfNotEnoughLetter'](allPossibleWords, playerAi)).toEqual([
//             { word: '', orientation: Orientation.Horizontal, line: 0, startIndex: 0, point: 0 },
//         ]);
//     });

//     it('regression test sample1', async () => {
//         const myDictionary: string[] = ['thon', 'maths', 'rond', 'math', 'art', 'lundi', 'mardi'];
//         scrabbleBoard[3][1] = 'm';
//         scrabbleBoard[3][2] = 'a';
//         scrabbleBoard[3][3] = 't';
//         scrabbleBoard[3][4] = 'h';
//         scrabbleBoard[4][2] = 'r';
//         scrabbleBoard[5][2] = 't';
//         playerAi.letterTable = [
//             { value: 'H', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'O', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'N', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'S', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'D', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'A', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'R', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//         ];
//         const word1: PossibleWords = { word: 'maths', orientation: Orientation.Horizontal, line: 3, startIndex: 1, point: 10 };
//         const word2: PossibleWords = { word: 'rond', orientation: Orientation.Horizontal, line: 4, startIndex: 2, point: 9 };
//         const word3: PossibleWords = { word: 'thon', orientation: Orientation.Horizontal, line: 5, startIndex: 2, point: 6 };
//         const word4: PossibleWords = { word: 'thon', orientation: Orientation.Vertical, line: 3, startIndex: 3, point: 3 };
//         const word5: PossibleWords = { word: 'art', orientation: Orientation.Vertical, line: 3, startIndex: 1, point: 1 };
//         const word6: PossibleWords = { word: 'art', orientation: Orientation.Horizontal, line: 5, startIndex: 0, point: 5 };
//         const expectedPoss: PossibleWords[] = [];
//         expectedPoss.push(word1);
//         expectedPoss.push(word2);
//         expectedPoss.push(word3);
//         expectedPoss.push(word6);
//         expectedPoss.push(word4);
//         expectedPoss.push(word5);
//         placeStrategy.dictionary = myDictionary;
//         playerAiService.placeLetterService.isFirstRound = false;
//         playerAiService.placeLetterService.scrabbleBoard = scrabbleBoard;
//         playerAiService.gameSettingsService.gameSettings.level = 'Difficile';

//         const spyOnCompute = spyOn<any>(placeStrategy, 'computeResults');
//         spyOn<any>(playerAiService.wordValidation, 'validateAllWordsOnBoard').and.returnValues(
//             { validation: true, score: 10 },
//             { validation: true, score: 9 },
//             { validation: true, score: 6 },
//             { validation: true, score: 5 },
//             { validation: true, score: 3 },
//             { validation: true, score: 1 },
//         );
//         await placeStrategy.execute(playerAiService);
//         expect(spyOnCompute).toHaveBeenCalledWith(expectedPoss, playerAiService);
//     });

//     it('regression test sample2', async () => {
//         const myDictionary: string[] = ['thon', 'maths', 'rond', 'math', 'art', 'lundi', 'mardi'];
//         scrabbleBoard[3][1] = 'm';
//         scrabbleBoard[3][2] = 'a';
//         scrabbleBoard[3][3] = 't';
//         scrabbleBoard[3][4] = 'h';
//         scrabbleBoard[4][2] = 'r';
//         scrabbleBoard[5][2] = 't';

//         playerAi.letterTable = [
//             { value: 'H', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'O', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'N', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'S', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'D', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'A', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//             { value: 'R', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
//         ];

//         const word1: PossibleWords = { word: 'maths', orientation: Orientation.Horizontal, line: 3, startIndex: 1, point: 10 };
//         const word2: PossibleWords = { word: 'rond', orientation: Orientation.Horizontal, line: 4, startIndex: 2, point: 9 };
//         const word3: PossibleWords = { word: 'thon', orientation: Orientation.Horizontal, line: 5, startIndex: 2, point: 6 };
//         const word4: PossibleWords = { word: 'thon', orientation: Orientation.Vertical, line: 3, startIndex: 3, point: 3 };
//         const word5: PossibleWords = { word: 'art', orientation: Orientation.Vertical, line: 3, startIndex: 1, point: 1 };
//         const word6: PossibleWords = { word: 'art', orientation: Orientation.Horizontal, line: 5, startIndex: 0, point: 5 };
//         const expectedPoss: PossibleWords[] = [];
//         expectedPoss.push(word1);
//         expectedPoss.push(word2);
//         expectedPoss.push(word3);
//         expectedPoss.push(word6);
//         expectedPoss.push(word4);
//         expectedPoss.push(word5);
//         placeStrategy.dictionary = myDictionary;
//         placeStrategy.pointingRange = { min: 1, max: 18 };
//         playerAiService.placeLetterService.isFirstRound = false;
//         playerAiService.placeLetterService.scrabbleBoard = scrabbleBoard;
//         playerAiService.gameSettingsService.gameSettings.level = 'Facile';

//         const spyOnCompute = spyOn<any>(placeStrategy, 'computeResults');
//         spyOn<any>(playerAiService.wordValidation, 'validateAllWordsOnBoard').and.returnValues(
//             { validation: true, score: 10 },
//             { validation: true, score: 9 },
//             { validation: true, score: 6 },
//             { validation: true, score: 5 },
//             { validation: true, score: 3 },
//             { validation: true, score: 1 },
//         );
//         await placeStrategy.execute(playerAiService);
//         expect(spyOnCompute).toHaveBeenCalledOnceWith(expectedPoss, playerAiService, false);
//     });
// });
