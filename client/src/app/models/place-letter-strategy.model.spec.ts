/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BOARD_COLUMNS, BOARD_ROWS } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { BoardPattern, Orientation, PatternInfo, PossibleWords } from '@app/classes/scrabble-board-pattern';
import { PlayerAI } from '@app/models/player-ai.model';
import { PlayerAIService } from '@app/services/player-ia.service';
import { PlaceLetters } from './place-letter-strategy.model';

describe('Place Letter', () => {
    let playerAi: PlayerAI;
    let placeStrategy: PlaceLetters;
    let playerAiService: PlayerAIService;
    const scrabbleBoard: string[][] = [];
    let letterTable: Letter[] = [];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        const id = 1;
        const name = 'PlayerAI';
        letterTable = [
            { value: 'A', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'B', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'C', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'D', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'E', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'F', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'G', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
        ];

        playerAi = new PlayerAI(id, name, letterTable, playerAiService);
        playerAiService = TestBed.inject(PlayerAIService);
        playerAiService.playerService.players[1] = playerAi;

        for (let i = 0; i < BOARD_COLUMNS; i++) {
            scrabbleBoard[i] = [];
            for (let j = 0; j < BOARD_ROWS; j++) {
                scrabbleBoard[i][j] = '';
            }
        }

        spyOn(playerAiService.sendMessageService, 'displayMessageByType');
    });

    it('should create an instance', () => {
        expect(playerAi).toBeTruthy();
        expect(playerAiService).toBeTruthy();
        expect(scrabbleBoard).toBeTruthy();
    });

    it('should create all patterns by replacing empty cases by playerHand letters pattern', () => {
        scrabbleBoard[0][3] = 'p';
        scrabbleBoard[1][3] = 'a';
        scrabbleBoard[2][3] = 'r';
        scrabbleBoard[3][3] = 'i';
        scrabbleBoard[4][3] = 's';
        scrabbleBoard[2][6] = 'o';
        scrabbleBoard[3][6] = 'u';
        scrabbleBoard[4][6] = 'r';
        scrabbleBoard[5][6] = 's';
        scrabbleBoard[3][2] = 'm';
        scrabbleBoard[3][4] = 'a';
        scrabbleBoard[3][5] = 'o';

        const isFirstRound = false;

        const horizontal: PatternInfo[] = [];
        const vertical: PatternInfo[] = [];

        horizontal.push({ line: 0, pattern: '^[abcdefg]*p[abcdefg]*$' });
        horizontal.push({ line: 1, pattern: '^[abcdefg]*a[abcdefg]*$' });
        horizontal.push({ line: 2, pattern: '^[abcdefg]*r[abcdefg]*o[abcdefg]*$' });
        horizontal.push({ line: 3, pattern: '^[abcdefg]*miaou[abcdefg]*$' });
        horizontal.push({ line: 4, pattern: '^[abcdefg]*s[abcdefg]*r[abcdefg]*$' });
        horizontal.push({ line: 5, pattern: '^[abcdefg]*s[abcdefg]*$' });

        vertical.push({ line: 2, pattern: '^[abcdefg]*m[abcdefg]*$' });
        vertical.push({ line: 3, pattern: '^paris[abcdefg]*$' });
        vertical.push({ line: 4, pattern: '^[abcdefg]*a[abcdefg]*$' });
        vertical.push({ line: 5, pattern: '^[abcdefg]*o[abcdefg]*$' });
        vertical.push({ line: 6, pattern: '^[abcdefg]*ours[abcdefg]*$' });

        const expected: BoardPattern = { horizontal, vertical };

        placeStrategy = new PlaceLetters({ min: 0, max: 100 });

        placeStrategy['initializeArray'](scrabbleBoard);

        expect(placeStrategy['generateAllPatterns']('[ABCDEFG]', isFirstRound)).toEqual(expected);
    });

    it('player hand pattern at first round', () => {
        const isFirstRound = true;
        const horizontal: PatternInfo[] = [{ line: 7, pattern: '^[abcdefg]*$' }];
        const vertical: PatternInfo[] = [{ line: 7, pattern: '^[abcdefg]*$' }];

        const expected: BoardPattern = { horizontal, vertical };

        placeStrategy = new PlaceLetters({ min: 0, max: 100 });

        placeStrategy['initializeArray'](scrabbleBoard);

        expect(placeStrategy['generateAllPatterns']('[ABCDEFG]', isFirstRound)).toEqual(expected);
    });

    it('should find all possible words based on pattern', () => {
        const horizontal: PatternInfo[] = [];
        const vertical: PatternInfo[] = [];
        horizontal.push({ line: 0, pattern: '^[mndacis]*a[mcndais]*$' });
        vertical.push({ line: 0, pattern: '^[mndacis]*o[mndacis]*$' });
        const patterns: BoardPattern = { horizontal, vertical };

        const randomDictionary: string[] = ['moi', 'canada', 'inf2610', 'moins', 'a', 'o'];

        const expected: PossibleWords[] = [];
        expected.push({ word: 'canada', orientation: Orientation.Horizontal, line: 0, startIdx: 0, point: 0 });
        expected.push({ word: 'moi', orientation: Orientation.Vertical, line: 0, startIdx: 0, point: 0 });
        expected.push({ word: 'moins', orientation: Orientation.Vertical, line: 0, startIdx: 0, point: 0 });

        placeStrategy = new PlaceLetters({ min: 0, max: 100 });

        expect(placeStrategy['generateAllWords'](randomDictionary, patterns)).toEqual(expected);
    });

    it('should retain only those he can play in letter quantity', () => {
        const possibleWords: PossibleWords[] = [];
        const word1: PossibleWords = { word: 'abc', orientation: Orientation.Horizontal, line: 0, startIdx: 0, point: 0 };
        const word2: PossibleWords = { word: 'aab', orientation: Orientation.Horizontal, line: 2, startIdx: 0, point: 0 };
        const word3: PossibleWords = { word: 'abz', orientation: Orientation.Horizontal, line: 4, startIdx: 0, point: 0 };

        possibleWords.push(word1);
        possibleWords.push(word2);
        possibleWords.push(word3);

        const expected: PossibleWords[] = [];
        expected.push(word1);
        expected.push(word3);

        scrabbleBoard[4][0] = 'z';
        placeStrategy = new PlaceLetters({ min: 0, max: 100 });
        placeStrategy['initializeArray'](scrabbleBoard);

        expect(placeStrategy['removeIfNotEnoughLetter'](possibleWords, playerAi)).toEqual(expected);
    });

    it('should remove all word that are no disposable on the scrabble board', () => {
        scrabbleBoard[0][0] = 'm';
        scrabbleBoard[0][2] = 'r';
        scrabbleBoard[0][5] = 'n';
        scrabbleBoard[2][0] = 'r';
        scrabbleBoard[5][0] = 'n';

        const word1: PossibleWords = { word: 'amar', orientation: Orientation.Horizontal, line: 0, startIdx: 0, point: 0 };
        const word2: PossibleWords = { word: 'maree', orientation: Orientation.Horizontal, line: 0, startIdx: 0, point: 0 };
        const word3: PossibleWords = { word: 'martin', orientation: Orientation.Horizontal, line: 0, startIdx: 0, point: 0 };
        const word4: PossibleWords = { word: 'mare', orientation: Orientation.Horizontal, line: 0, startIdx: 0, point: 0 };

        const word5: PossibleWords = { word: 'amar', orientation: Orientation.Vertical, line: 0, startIdx: 0, point: 0 };
        const word6: PossibleWords = { word: 'maree', orientation: Orientation.Vertical, line: 0, startIdx: 0, point: 0 };
        const word7: PossibleWords = { word: 'martin', orientation: Orientation.Vertical, line: 0, startIdx: 0, point: 0 };
        const word8: PossibleWords = { word: 'mare', orientation: Orientation.Vertical, line: 0, startIdx: 0, point: 0 };

        const possibleWord: PossibleWords[] = [];
        possibleWord.push(word1);
        possibleWord.push(word2);
        possibleWord.push(word3);
        possibleWord.push(word4);
        possibleWord.push(word5);
        possibleWord.push(word6);
        possibleWord.push(word7);
        possibleWord.push(word8);
        const expected: PossibleWords[] = [];
        expected.push(word3);
        expected.push(word4);
        expected.push(word7);
        expected.push(word8);

        placeStrategy = new PlaceLetters({ min: 0, max: 100 });
        placeStrategy['initializeArray'](scrabbleBoard);

        expect(placeStrategy['removeIfNotDisposable'](possibleWord)).toEqual(expected);
    });

    it('should play from the center at first round', async () => {
        jasmine.clock().install();
        const myDictionary: string[] = ['maths', 'math', 'lundi', 'mardi', 'on'];

        playerAi.letterTable = [
            { value: 'H', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'O', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'N', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'T', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'D', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'A', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'R', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
        ];

        placeStrategy.dictionary = myDictionary;
        placeStrategy.pointingRange = { min: 1, max: 4 };

        const spyOnPlace = spyOn<any>(playerAiService, 'place');

        const word1: PossibleWords = { word: 'on', orientation: Orientation.Horizontal, line: 7, startIdx: 7, point: 2 };
        const word2: PossibleWords = { word: 'on', orientation: Orientation.Vertical, line: 7, startIdx: 7, point: 2 };

        const allPoss: PossibleWords[] = [];
        allPoss.push(word1);
        allPoss.push(word2);

        const expectedMatching: PossibleWords[] = [];
        expectedMatching.push(word1);
        expectedMatching.push(word2);
        await placeStrategy.execute(playerAiService);
        jasmine.clock().tick(6000);
        expect(spyOnPlace).toHaveBeenCalledWith(word1);
        jasmine.clock().uninstall();
    });

    it('should swap if no possibility', () => {
        scrabbleBoard[3][1] = 'm';
        scrabbleBoard[3][2] = 'a';
        scrabbleBoard[3][3] = 't';
        scrabbleBoard[3][4] = 'h';
        scrabbleBoard[4][2] = 'r';
        scrabbleBoard[5][2] = 't';
        scrabbleBoard[4][3] = 'o';
        scrabbleBoard[5][3] = 'n';

        placeStrategy = new PlaceLetters({ min: 6, max: 10 });

        expect(placeStrategy['validateWord'](scrabbleBoard)).toBeFalse();
    });

    it('should remove word that will cause a new word not in dictionary', () => {
        const allPoss: PossibleWords[] = [{ word: 'ton', orientation: Orientation.Vertical, line: 3, startIdx: 3, point: 0 }];
        const NO_PLAYABLE_WORD = -1;

        scrabbleBoard[3][1] = 'm';
        scrabbleBoard[3][2] = 'a';
        scrabbleBoard[3][3] = 't';
        scrabbleBoard[3][4] = 'h';
        scrabbleBoard[4][2] = 'r';
        scrabbleBoard[5][2] = 't';

        playerAiService.placeLetterService.scrabbleBoard = scrabbleBoard;
        placeStrategy = new PlaceLetters({ min: 6, max: 10 });

        expect(placeStrategy['placementAttempt'](allPoss, playerAiService)).toEqual(NO_PLAYABLE_WORD);
    });

    it('should play alternatives when no matching pointing possibilities', async () => {
        const allPossibleWords: PossibleWords[] = [{ word: 'ton', orientation: Orientation.Vertical, line: 3, startIdx: 3, point: 0 }];
        const matchingPointingRangeWords: PossibleWords[] = [];

        placeStrategy = new PlaceLetters({ min: 6, max: 10 });
        const spyOnPlacementAttempt = spyOn<any>(placeStrategy, 'placementAttempt').and.callThrough();
        await placeStrategy['computeResults'](allPossibleWords, matchingPointingRangeWords, playerAiService);

        expect(spyOnPlacementAttempt).toHaveBeenCalledWith(allPossibleWords, playerAiService);
    });

    it('should swap when no possibilities', async () => {
        const allPossibleWords: PossibleWords[] = [];
        const matchingPointingRangeWords: PossibleWords[] = [];

        placeStrategy = new PlaceLetters({ min: 6, max: 10 });
        const spyOnPlacementAttempt = spyOn<any>(playerAiService, 'swap').and.callThrough();

        await placeStrategy['computeResults'](allPossibleWords, matchingPointingRangeWords, playerAiService);

        expect(spyOnPlacementAttempt).toHaveBeenCalledTimes(1);
    });

    it('regression test sample', () => {
        const myDictionary: string[] = ['thon', 'maths', 'rond', 'math', 'art', 'lundi', 'mardi'];

        scrabbleBoard[3][1] = 'm';
        scrabbleBoard[3][2] = 'a';
        scrabbleBoard[3][3] = 't';
        scrabbleBoard[3][4] = 'h';
        scrabbleBoard[4][2] = 'r';
        scrabbleBoard[5][2] = 't';

        playerAi.letterTable = [
            { value: 'H', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'O', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'N', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'S', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'D', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'A', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'R', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
        ];

        const word1: PossibleWords = { word: 'maths', orientation: Orientation.Horizontal, line: 3, startIdx: 1, point: 9 };
        const word2: PossibleWords = { word: 'rond', orientation: Orientation.Horizontal, line: 4, startIdx: 2, point: 10 };
        const word3: PossibleWords = { word: 'thon', orientation: Orientation.Horizontal, line: 5, startIdx: 2, point: 9 };
        const word4: PossibleWords = { word: 'thon', orientation: Orientation.Vertical, line: 3, startIdx: 3, point: 7 };
        const word5: PossibleWords = { word: 'art', orientation: Orientation.Vertical, line: 3, startIdx: 1, point: 3 };
        const word6: PossibleWords = { word: 'art', orientation: Orientation.Horizontal, line: 5, startIdx: 0, point: 5 };

        const expectedPoss: PossibleWords[] = [];
        expectedPoss.push(word2);
        expectedPoss.push(word1);
        expectedPoss.push(word3);
        expectedPoss.push(word4);
        expectedPoss.push(word6);
        expectedPoss.push(word5);

        const expectedMatching: PossibleWords[] = [];
        expectedMatching.push(word2);
        expectedMatching.push(word1);
        expectedMatching.push(word3);
        expectedMatching.push(word4);

        placeStrategy = new PlaceLetters({ min: 6, max: 10 });
        placeStrategy.dictionary = myDictionary;
        playerAiService.placeLetterService.isFirstRound = false;
        playerAiService.placeLetterService.scrabbleBoard = scrabbleBoard;
        const spyOnCompute = spyOn<any>(placeStrategy, 'computeResults');
        // const spyOnPlace = spyOn<any>(playerAiService, 'place');
        // const spyOnSwitchTurn = spyOn<any>(playerAiService.skipTurnService, 'switchTurn');

        placeStrategy.execute(playerAiService);

        expect(spyOnCompute).toHaveBeenCalledWith(expectedPoss, expectedMatching, playerAiService);
        // expect(spyOnPlace).toHaveBeenCalledTimes(1);
        // expect(spyOnSwitchTurn).toHaveBeenCalledTimes(1);
    });
});
