// /* eslint-disable sort-imports */
// import { TestBed } from '@angular/core/testing';
// import { BOARD_COLUMNS, BOARD_ROWS } from '@app/classes/constants';
// import { Letter } from '@app/classes/letter';
// import { BoardPattern, Orientation, PatternInfo, PossibleWords } from '@app/classes/scrabble-board-pattern';
// import { PlaceLetters } from '@app/models/place-letter-strategy.model';
// import { PlayerAI } from '@app/models/player-ai.model';
// import { PlayerAIComponent } from '@app/modules/game-view/player-ai/player-ai.component';
// import { LetterService } from '@app/services/letter.service';

// describe('Place Letter', () => {
//     let playerAI: PlayerAI;
//     let placeStrategy: PlaceLetters;
//     let context: PlayerAIComponent;
//     const scrabbleBoard: string[][] = [];
//     let letterTable: Letter[] = [];
//     let letterService: LetterService;

//     beforeEach(() => {
//         const id = 1;
//         const name = 'PlayerAI';
//         letterTable = [
//             { value: 'A', quantity: 0, points: 0 },
//             { value: 'B', quantity: 0, points: 0 },
//             { value: 'C', quantity: 0, points: 0 },
//             { value: 'D', quantity: 0, points: 0 },
//             { value: 'E', quantity: 0, points: 0 },
//             { value: 'F', quantity: 0, points: 0 },
//             { value: 'G', quantity: 0, points: 0 },
//         ];

//         playerAI = new PlayerAI(id, name, letterTable);
//         placeStrategy = new PlaceLetters({ min: 1, max: 10 });
//         context = TestBed.createComponent(PlayerAIComponent).componentInstance;
//         letterService = TestBed.inject(LetterService);

//         for (let i = 0; i < BOARD_COLUMNS; i++) {
//             scrabbleBoard[i] = [];
//             for (let j = 0; j < BOARD_ROWS; j++) {
//                 scrabbleBoard[i][j] = '';
//             }
//         }
//     });

//     it('should create an instance', () => {
//         expect(playerAI).toBeTruthy();
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

//         const isNotFirstTour = false;

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

//         placeStrategy.initializeArray(scrabbleBoard);
//         // eslint-disable-next-line dot-notation
//         expect(placeStrategy['generateAllPatterns']('[ABCDEFG]', isNotFirstTour)).toEqual(expected);
//     });

//     it('should find all possible words based on pattern', () => {
//         const horizontal: PatternInfo[] = [];
//         const vertical: PatternInfo[] = [];
//         horizontal.push({ line: 0, pattern: '^[mndacis]*a[mcndais]*$' });
//         vertical.push({ line: 0, pattern: '^[mndacis]*o[mndacis]*$' });
//         const patterns: BoardPattern = { horizontal, vertical };

//         const randomDictionary: string[] = ['moi', 'canada', 'inf2610', 'moins', 'a', 'o'];

//         const expected: PossibleWords[] = [];
//         expected.push({ word: 'canada', orientation: Orientation.HorizontalOrientation, line: 0, startIdx: 0, point: 0 });
//         expected.push({ word: 'moi', orientation: Orientation.VerticalOrientation, line: 0, startIdx: 0, point: 0 });
//         expected.push({ word: 'moins', orientation: Orientation.VerticalOrientation, line: 0, startIdx: 0, point: 0 });

//         expect(placeStrategy.generateAllWords(randomDictionary, patterns)).toEqual(expected);
//     });

//     it('should retain only those he can play in letter quantity', () => {
//         const possibleWords: PossibleWords[] = [];
//         const word1: PossibleWords = { word: 'abc', orientation: Orientation.HorizontalOrientation, line: 0, startIdx: 0, point: 0 };
//         const word2: PossibleWords = { word: 'aab', orientation: Orientation.HorizontalOrientation, line: 2, startIdx: 0, point: 0 };
//         const word3: PossibleWords = { word: 'abz', orientation: Orientation.HorizontalOrientation, line: 4, startIdx: 0, point: 0 };

//         possibleWords.push(word1);
//         possibleWords.push(word2);
//         possibleWords.push(word3);

//         const expected: PossibleWords[] = [];
//         expected.push(word1);
//         expected.push(word3);

//         playerAI.letterTable = letterTable;
//         scrabbleBoard[4][0] = 'z';
//         placeStrategy.initializeArray(scrabbleBoard);

//         expect(placeStrategy.removeIfNotEnoughLetter(possibleWords, playerAI)).toEqual(expected);
//     });

//     // it('should remove all word that are no disposable on the scrabble board', () => {
//     //     scrabbleBoard[0][0] = 'm';
//     //     scrabbleBoard[0][2] = 'r';
//     //     scrabbleBoard[0][5] = 'n';
//     //     scrabbleBoard[2][0] = 'r';
//     //     scrabbleBoard[5][0] = 'n';

//     //     const word1: PossibleWords = { word: 'amar', orientation: Orientation.HorizontalOrientation, line: 0, startIdx: 0, point: 0 };
//     //     const word2: PossibleWords = { word: 'maree', orientation: Orientation.HorizontalOrientation, line: 0, startIdx: 0, point: 0 };
//     //     const word3: PossibleWords = { word: 'martin', orientation: Orientation.HorizontalOrientation, line: 0, startIdx: 0, point: 0 };
//     //     const word4: PossibleWords = { word: 'mare', orientation: Orientation.HorizontalOrientation, line: 0, startIdx: 0, point: 0 };

//     //     const word5: PossibleWords = { word: 'amar', orientation: Orientation.VerticalOrientation, line: 0, startIdx: 0, point: 0 };
//     //     const word6: PossibleWords = { word: 'maree', orientation: Orientation.VerticalOrientation, line: 0, startIdx: 0, point: 0 };
//     //     const word7: PossibleWords = { word: 'martin', orientation: Orientation.VerticalOrientation, line: 0, startIdx: 0, point: 0 };
//     //     const word8: PossibleWords = { word: 'mare', orientation: Orientation.VerticalOrientation, line: 0, startIdx: 0, point: 0 };

//     //     const possibleWord: PossibleWords[] = [];
//     //     possibleWord.push(word1);
//     //     possibleWord.push(word2);
//     //     possibleWord.push(word3);
//     //     possibleWord.push(word4);
//     //     possibleWord.push(word5);
//     //     possibleWord.push(word6);
//     //     possibleWord.push(word7);
//     //     possibleWord.push(word8);
//     //     const expected: PossibleWords[] = [];
//     //     expected.push(word3);
//     //     expected.push(word4);
//     //     expected.push(word7);
//     //     expected.push(word8);

//     //     placeStrategy.initializeArray(scrabbleBoard);

//     //     expect(placeStrategy.removeIfNotDisposable(possibleWord)).toEqual(expected);
//     // });

//     it('should play from the center at first round', () => {
//         const myDictionary: string[] = ['maths', 'rond', 'math', 'lundi', 'mardi'];

//         context.aiPlayer = playerAI;
//         context.letterService = letterService;
//         context.placeLetterService.scrabbleBoard = scrabbleBoard;
//         context.playerAIService.isFirstRound = true;
//         playerAI.strategy = placeStrategy;
//         playerAI.letterTable = [
//             { value: 'H', quantity: 0, points: 0 },
//             { value: 'O', quantity: 0, points: 0 },
//             { value: 'N', quantity: 0, points: 0 },
//             { value: 'T', quantity: 0, points: 0 },
//             { value: 'D', quantity: 0, points: 0 },
//             { value: 'A', quantity: 0, points: 0 },
//             { value: 'R', quantity: 0, points: 0 },
//         ];

//         placeStrategy.dictionary = myDictionary;
//         placeStrategy.pointingRange = { min: 1, max: 4 };

//         const spy = spyOn(placeStrategy, 'computeResults');

//         const word1: PossibleWords = { word: 'rond', orientation: Orientation.HorizontalOrientation, line: 7, startIdx: 7, point: 5 };
//         const word2: PossibleWords = { word: 'rond', orientation: Orientation.VerticalOrientation, line: 7, startIdx: 7, point: 5 };

//         const expectedPoss: PossibleWords[] = [];
//         expectedPoss.push(word1);
//         expectedPoss.push(word2);

//         const expectedMatching: PossibleWords[] = [];

//         placeStrategy.execute(playerAI, context);

//         expect(spy).toHaveBeenCalledWith(expectedPoss, expectedMatching, context);
//     });

//     // it('regression test', () => {
//     //     const myDictionary: string[] = ['thon', 'maths', 'rond', 'math', 'art', 'lundi', 'mardi'];

//     //     scrabbleBoard[3][1] = 'm';
//     //     scrabbleBoard[3][2] = 'a';
//     //     scrabbleBoard[3][3] = 't';
//     //     scrabbleBoard[3][4] = 'h';
//     //     scrabbleBoard[4][2] = 'r';
//     //     scrabbleBoard[5][2] = 't';

//     //     context.aiPlayer = playerAI;
//     //     context.letterService = letterService;
//     //     context.placeLetterService.scrabbleBoard = scrabbleBoard;
//     //     context.playerAIService.isFirstRound = false;
//     //     playerAI.strategy = placeStrategy;
//     //     playerAI.letterTable = [
//     //         { value: 'H', quantity: 0, points: 0 },
//     //         { value: 'O', quantity: 0, points: 0 },
//     //         { value: 'N', quantity: 0, points: 0 },
//     //         { value: 'S', quantity: 0, points: 0 },
//     //         { value: 'D', quantity: 0, points: 0 },
//     //         { value: 'A', quantity: 0, points: 0 },
//     //         { value: 'R', quantity: 0, points: 0 },
//     //     ];

//     //     placeStrategy.dictionary = myDictionary;
//     //     placeStrategy.pointingRange = { min: 6, max: 10 };

//     //     const spy = spyOn(placeStrategy, 'computeResults');

//     //     const word1: PossibleWords = { word: 'maths', orientation: Orientation.HorizontalOrientation, line: 3, startIdx: 1, point: 9 };
//     //     const word2: PossibleWords = { word: 'rond', orientation: Orientation.HorizontalOrientation, line: 4, startIdx: 2, point: 10 };
//     //     const word3: PossibleWords = { word: 'thon', orientation: Orientation.HorizontalOrientation, line: 5, startIdx: 2, point: 9 };
//     //     const word4: PossibleWords = { word: 'thon', orientation: Orientation.VerticalOrientation, line: 3, startIdx: 3, point: 7 };
//     //     const word5: PossibleWords = { word: 'art', orientation: Orientation.VerticalOrientation, line: 3, startIdx: 1, point: 3 };
//     //     const word6: PossibleWords = { word: 'art', orientation: Orientation.HorizontalOrientation, line: 5, startIdx: 0, point: 5 };

//     //     const expectedPoss: PossibleWords[] = [];
//     //     expectedPoss.push(word2);
//     //     expectedPoss.push(word1);
//     //     expectedPoss.push(word3);
//     //     expectedPoss.push(word4);
//     //     expectedPoss.push(word6);
//     //     expectedPoss.push(word5);

//     //     const expectedMatching: PossibleWords[] = [];
//     //     expectedMatching.push(word2);
//     //     expectedMatching.push(word1);
//     //     expectedMatching.push(word3);
//     //     expectedMatching.push(word4);

//     //     placeStrategy.execute(playerAI, context);

//     //     expect(spy).toHaveBeenCalledWith(expectedPoss, expectedMatching, context);
//     // });
// });
