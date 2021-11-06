/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BOARD_COLUMNS, BOARD_ROWS, RESERVE } from '@app/classes/constants';
import { Orientation, PossibleWords } from '@app/classes/scrabble-board-pattern';
import { Vec2 } from '@app/classes/vec2';
import { Player } from '@app/models/player.model';
import { PlayerAIService } from '@app/services/player-ia.service';
import { PlayerAI } from './../models/player-ai.model';

describe('PlayerAIService', () => {
    let service: PlayerAIService;
    const scrabbleBoard: string[][] = [];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
        }).compileComponents();
        service = TestBed.inject(PlayerAIService);
    });

    beforeEach(() => {
        for (let i = 0; i < BOARD_COLUMNS; i++) {
            scrabbleBoard[i] = [];
            for (let j = 0; j < BOARD_ROWS; j++) {
                scrabbleBoard[i][j] = '';
            }
        }
        const letterA = RESERVE[0];
        const letterB = RESERVE[1];
        const letterC = RESERVE[2];
        const letterD = RESERVE[3];

        const player = new Player(1, 'Player 1', [letterA, letterB, letterC, letterD]);
        const playerAi = new Player(2, 'Player 2', [letterA, letterB, letterC, letterD]);
        service.playerService.addPlayer(player);
        service.playerService.addPlayer(playerAi);

        spyOn(service.sendMessageService, 'displayMessageByType');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return bonus factor associated if bonus case (x;y) is empty', () => {
        const pos = { x: 5, y: 5 };
        const bonusFactorAssociated = 3;
        scrabbleBoard[pos.x][pos.y] = '';
        expect(service['bonusFactor'](bonusFactorAssociated, pos, scrabbleBoard)).toEqual(bonusFactorAssociated);
    });

    it('should return 1 if bonus case (x;y) is occupied', () => {
        const pos = { x: 5, y: 5 };
        const bonusFactorAssociated = 1;
        scrabbleBoard[pos.x][pos.y] = 'a';
        expect(service['bonusFactor'](bonusFactorAssociated, pos, scrabbleBoard)).toEqual(bonusFactorAssociated);
    });

    it('should calculate the total amount of bonus free cell', () => {
        const pos = 'H8';
        const matrixPos: Vec2 = { x: 7, y: 7 };
        const letter = 'a';
        const letterValue = 1;
        const expectedEarning = { letterPoint: 1, wordFactor: 1 };
        scrabbleBoard[matrixPos.x][matrixPos.y] = letter;

        expect(service['computeCell'](pos, letterValue, matrixPos, scrabbleBoard)).toEqual(expectedEarning);
    });

    it('should calculate the total amount of a letter bonus cell', () => {
        const pos = 'F6';
        const matrixPos: Vec2 = { x: 5, y: 5 };
        const bonusPos = 3;
        const letterValue = 1; /* attempting to place 'a' */
        const expectedEarning = { letterPoint: letterValue * bonusPos, wordFactor: 1 };

        expect(service['computeCell'](pos, letterValue, matrixPos, scrabbleBoard)).toEqual(expectedEarning);
    });

    it('should calculate the total amount of a word bonus cell', () => {
        const pos = 'B14';
        const matrixPos: Vec2 = { x: 1, y: 13 };
        const bonusPos = 2;
        const letterValue = 1; /* attempting to place 'a' */
        const expectedEarning = { letterPoint: letterValue, wordFactor: 1 * bonusPos };

        expect(service['computeCell'](pos, letterValue, matrixPos, scrabbleBoard)).toEqual(expectedEarning);
    });

    it('should calculate the total amount of a word horizontally with empty bonus word and letter', () => {
        const possWord: PossibleWords[] = [];
        possWord.push({ word: 'MAJID', orientation: Orientation.Horizontal, line: 14, startIdx: 0, point: 0 });
        const expectedEarning = 45;

        service.calculatePoints(possWord, scrabbleBoard);
        expect(possWord[0].point).toEqual(expectedEarning);
    });

    it('should calculate the total amount of a word vertically with bonus word and letter', () => {
        const possWord: PossibleWords[] = [];
        possWord.push({ word: 'MAJID', orientation: Orientation.Vertical, line: 5, startIdx: 13, point: 0 });
        const expectedEarning = 18;

        service.calculatePoints(possWord, scrabbleBoard);
        expect(possWord[0].point).toEqual(expectedEarning);
    });

    it('should place word on board horizontally', () => {
        const word = { word: 'MAJID', orientation: Orientation.Horizontal, line: 5, startIdx: 0, point: 0 };
        const expected = JSON.parse(JSON.stringify(scrabbleBoard));
        expected[5][0] = 'M';
        expected[5][1] = 'A';
        expected[5][2] = 'J';
        expected[5][3] = 'I';
        expected[5][4] = 'D';

        expect(service.placeWordOnBoard(scrabbleBoard, word.word, { x: word.line, y: word.startIdx }, word.orientation)).toEqual(expected);
    });

    it('should place word on board vertically', () => {
        const word = { word: 'MAJID', orientation: Orientation.Vertical, line: 5, startIdx: 0, point: 0 };
        const expected = JSON.parse(JSON.stringify(scrabbleBoard));
        expected[5][0] = 'M';
        expected[6][0] = 'A';
        expected[7][0] = 'J';
        expected[8][0] = 'I';
        expected[9][0] = 'D';

        expect(service.placeWordOnBoard(scrabbleBoard, word.word, { x: word.line, y: word.startIdx }, word.orientation)).toEqual(expected);
    });

    it('should sort words by points rewards', () => {
        const word8: PossibleWords = { word: 'mare', orientation: Orientation.Vertical, line: 0, startIdx: 0, point: 2 };
        const word1: PossibleWords = { word: 'amar', orientation: Orientation.Horizontal, line: 0, startIdx: 0, point: 15 };
        const word2: PossibleWords = { word: 'maree', orientation: Orientation.Horizontal, line: 0, startIdx: 0, point: 15 };
        const word3: PossibleWords = { word: 'martin', orientation: Orientation.Horizontal, line: 0, startIdx: 0, point: 3 };
        const word4: PossibleWords = { word: 'mare', orientation: Orientation.Horizontal, line: 0, startIdx: 0, point: 4 };

        const word5: PossibleWords = { word: 'amar', orientation: Orientation.Vertical, line: 0, startIdx: 0, point: 8 };
        const word6: PossibleWords = { word: 'maree', orientation: Orientation.Vertical, line: 0, startIdx: 0, point: 8 };
        const word7: PossibleWords = { word: 'martin', orientation: Orientation.Vertical, line: 0, startIdx: 0, point: 3 };

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
        expected.push(word1);
        expected.push(word2);
        expected.push(word5);
        expected.push(word6);
        expected.push(word4);
        expected.push(word3);
        expected.push(word7);
        expected.push(word8);

        service.sortDecreasingPoints(possibleWord);

        expect(possibleWord).toEqual(expected);
    });

    it('should remove words not matching the pointing range', () => {
        const word6: PossibleWords = { word: 'maree', orientation: Orientation.Vertical, line: 0, startIdx: 0, point: 8 };
        const word7: PossibleWords = { word: 'martin', orientation: Orientation.Vertical, line: 0, startIdx: 0, point: 9 };
        const word8: PossibleWords = { word: 'mare', orientation: Orientation.Vertical, line: 0, startIdx: 0, point: 10 };
        const word1: PossibleWords = { word: 'amar', orientation: Orientation.Horizontal, line: 0, startIdx: 0, point: 3 };
        const word3: PossibleWords = { word: 'martin', orientation: Orientation.Horizontal, line: 0, startIdx: 0, point: 5 };
        const word4: PossibleWords = { word: 'mare', orientation: Orientation.Horizontal, line: 0, startIdx: 0, point: 6 };
        const word2: PossibleWords = { word: 'maree', orientation: Orientation.Horizontal, line: 0, startIdx: 0, point: 4 };

        const word5: PossibleWords = { word: 'amar', orientation: Orientation.Vertical, line: 0, startIdx: 0, point: 6 };

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
        expected.push(word1);
        expected.push(word2);
        expected.push(word3);

        expect(service.filterByRange(possibleWord, { min: 1, max: 5 })).toEqual(expected);
    });

    it('should generate random numbers', () => {
        const max = 5;
        expect(service.generateRandomNumber(max)).toBeLessThan(max);
    });

    it('should ask placeLetterService to place some word on the board', async () => {
        const word = { word: 'MAJID', orientation: Orientation.Vertical, line: 5, startIdx: 0, point: 0 };
        const spyOnPlace = spyOn<any>(service.placeLetterService, 'placeCommand').and.returnValue(Promise.resolve(true));
        spyOn(service, 'swap');
        await service.place(word);
        expect(spyOnPlace).toHaveBeenCalledOnceWith({ x: word.line, y: word.startIdx }, word.orientation, word.word);
    });

    it('should swap if placement fails (placement should never fails from the AI placement)', async () => {
        const word = { word: 'MAJID', orientation: Orientation.Horizontal, line: 5, startIdx: 0, point: 0 };
        const spyOnPlace = spyOn<any>(service.placeLetterService, 'placeCommand').and.returnValue(Promise.resolve(false));
        const spyOnSwap = spyOn<any>(service, 'swap').and.returnValue(true);
        await service.place(word);
        expect(spyOnPlace).toHaveBeenCalledOnceWith({ x: word.startIdx, y: word.line }, word.orientation, word.word);
        expect(spyOnSwap).toHaveBeenCalledTimes(1);
    });

    it('should perform a swap when reserveSize >= 7', () => {
        const letterTable = [
            { value: 'A', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'B', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'C', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'E', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'E', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'E', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'G', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
        ];
        const copy = JSON.parse(JSON.stringify(letterTable));
        const playerAi = new PlayerAI(0, 'name', letterTable, service);
        service.playerService.players[1] = playerAi;
        const reserveLengthBeforeSwap = service.letterService.reserveSize;
        service.swap();

        expect(service.playerService.players[1].letterTable === copy).toEqual(false);
        expect(service.letterService.reserveSize === reserveLengthBeforeSwap).toEqual(true);
    });

    it('should perform a swap when reserveSize >= 7', () => {
        const letterTable = [
            { value: 'A', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'B', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'C', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'E', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'E', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'E', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'G', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
        ];
        const copy = JSON.parse(JSON.stringify(letterTable));
        const playerAi = new PlayerAI(0, 'name', letterTable, service);
        service.playerService.players[1] = playerAi;
        const reserveLengthBeforeSwap = service.letterService.reserveSize;
        service.swap();

        expect(service.playerService.players[1].letterTable === copy).toEqual(false);
        expect(service.letterService.reserveSize === reserveLengthBeforeSwap).toEqual(true);
    });

    it("shouldn't perform a swap when reserveSize < 7", () => {
        const letterTable = [
            { value: 'A', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'B', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'C', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'E', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'E', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'E', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
            { value: 'G', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
        ];
        const copy = JSON.parse(JSON.stringify(letterTable));
        const playerAi = new PlayerAI(0, 'name', letterTable, service);
        service.playerService.players[1] = playerAi;
        service.letterService.reserveSize = 6;
        const spyOnPick = spyOn<any>(service.letterService, 'getRandomLetter');
        service.swap();

        expect(spyOnPick).toHaveBeenCalledTimes(0);
        expect(service.playerService.players[1].letterTable).toEqual(copy);
        expect(service.letterService.reserveSize).toEqual(6);
    });
});
