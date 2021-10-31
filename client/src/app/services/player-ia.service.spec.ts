<<<<<<< HEAD
=======
/* eslint-disable sort-imports */
>>>>>>> b7bc76bb223ef4674011ed696c8d797922f78013
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { BOARD_COLUMNS, BOARD_ROWS } from '@app/classes/constants';
import { Orientation, PossibleWords } from '@app/classes/scrabble-board-pattern';
import { Vec2 } from '@app/classes/vec2';
import { PlayerAIService } from './player-ia.service';

describe('PlayerAIService', () => {
    let service: PlayerAIService;
    const scrabbleBoard: string[][] = [];

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PlayerAIService);
        for (let i = 0; i < BOARD_COLUMNS; i++) {
            scrabbleBoard[i] = [];
            for (let j = 0; j < BOARD_ROWS; j++) {
                scrabbleBoard[i][j] = '';
            }
        }
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return bonus factor associated if bonus case (x;y) is empty', () => {
        const pos = { x: 5, y: 5 };
        const bonusFactorAssociated = 3;
        scrabbleBoard[pos.x][pos.y] = '';
        // eslint-disable-next-line dot-notation
        expect(service['bonusFactor'](bonusFactorAssociated, pos, scrabbleBoard)).toEqual(bonusFactorAssociated);
    });

    it('should return 1 if bonus case (x;y) is occupied', () => {
        const pos = { x: 5, y: 5 };
        const bonusFactorAssociated = 1;
        scrabbleBoard[pos.x][pos.y] = 'a';
        // eslint-disable-next-line dot-notation
        expect(service['bonusFactor'](bonusFactorAssociated, pos, scrabbleBoard)).toEqual(bonusFactorAssociated);
    });

    it('should calculate the total amount of bonus free cell', () => {
        const pos = 'H8';
        const matrixPos: Vec2 = { x: 7, y: 7 };
        const letter = 'a';
        const letterValue = 1;
        const expectedEarning = { letterPt: 1, wordFactor: 1 };
        scrabbleBoard[matrixPos.x][matrixPos.y] = letter;

        // eslint-disable-next-line dot-notation
        expect(service['computeCell'](pos, letterValue, matrixPos, scrabbleBoard)).toEqual(expectedEarning);
    });

    it('should calculate the total amount of a letter bonus cell', () => {
        const pos = 'F6';
        const matrixPos: Vec2 = { x: 5, y: 5 };
        const bonusPos = 3;
        const letterValue = 1; /* attempting to place 'a' */
        const expectedEarning = { letterPt: letterValue * bonusPos, wordFactor: 1 };

        // eslint-disable-next-line dot-notation
        expect(service['computeCell'](pos, letterValue, matrixPos, scrabbleBoard)).toEqual(expectedEarning);
    });

    it('should calculate the total amount of a word bonus cell', () => {
        const pos = 'B14';
        const matrixPos: Vec2 = { x: 1, y: 13 };
        const bonusPos = 2;
        const letterValue = 1; /* attempting to place 'a' */
        const expectedEarning = { letterPt: letterValue, wordFactor: 1 * bonusPos };

        // eslint-disable-next-line dot-notation
        expect(service['computeCell'](pos, letterValue, matrixPos, scrabbleBoard)).toEqual(expectedEarning);
    });

    it('should calculate the total amount of a word horizontally with empty bonus word and letter', () => {
        const possWord: PossibleWords[] = [];
<<<<<<< HEAD
        possWord.push({ word: 'MAJID', orientation: Orientation.horizontal, line: 14, startIdx: 0, point: 0 });
=======
        possWord.push({ word: 'MAJID', orientation: Orientation.HorizontalOrientation, line: 14, startIdx: 0, point: 0 });
>>>>>>> b7bc76bb223ef4674011ed696c8d797922f78013
        const expectedEarning = 45;

        service.calculatePoints(possWord, scrabbleBoard);
        expect(possWord[0].point).toEqual(expectedEarning);
    });

    it('should calculate the total amount of a word vertically with bonus word and letter', () => {
        const possWord: PossibleWords[] = [];
<<<<<<< HEAD
        possWord.push({ word: 'MAJID', orientation: Orientation.vertical, line: 5, startIdx: 13, point: 0 });
=======
        possWord.push({ word: 'MAJID', orientation: Orientation.VerticalOrientation, line: 5, startIdx: 13, point: 0 });
>>>>>>> b7bc76bb223ef4674011ed696c8d797922f78013
        const expectedEarning = 18;

        service.calculatePoints(possWord, scrabbleBoard);
        expect(possWord[0].point).toEqual(expectedEarning);
    });
});
