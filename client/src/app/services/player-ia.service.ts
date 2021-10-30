/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { RESERVE } from '@app/classes/constants';
import { Range } from '@app/classes/range';
import { board, Earning } from '@app/classes/scrabble-board';
import { Orientation, PossibleWords } from '@app/classes/scrabble-board-pattern';
import { Vec2 } from '@app/classes/vec2';
import { LetterService } from './letter.service';
import { PlaceLetterService } from './place-letter.service';
import { PlayerService } from './player.service';
import { SkipTurnService } from './skip-turn.service';
import { WordValidationService } from './word-validation.service';

const ROW_OFFSET = 65;
const COLUMN_OFFSET = 1;
const MULTIPLICATION_NEUTRAL = 1;

@Injectable({
    providedIn: 'root',
})
export class PlayerAIService {
    isFirstRound: boolean = true;
    isPlacementValid: boolean;

    constructor(
        // All services needed for AI Player functionnalities
        public placeLetterService: PlaceLetterService,
        public wordValidation: WordValidationService,
        public skipTurnService: SkipTurnService,
        public playerService: PlayerService,
        public letterService: LetterService,
    ) {}

    placeWordOnBoard(scrabbleBoard: string[][], word: string, start: Vec2, orientation: string) {
        for (let j = 0; orientation === 'h' && j < word.length; j++) {
            scrabbleBoard[start.x][j] = word[j];
        }

        for (let i = 0; orientation === 'h' && i < word.length; i++) {
            scrabbleBoard[i][start.y] = word[i];
        }

        return scrabbleBoard;
    }

    sortDecreasing = (word1: PossibleWords, word2: PossibleWords) => {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (word1.point > word2.point) return -1;
        if (word2.point < word1.point) return 1;
        return 0;
    };

    calculatePoints(allPossibleWords: PossibleWords[], scrabbleBoard: string[][]) {
        for (const word of allPossibleWords) {
            let totalPoint = 0;
            let wordFactor = 1;
            let matrixPos: Vec2;
            for (let i = 0; i < word.word.length; i++) {
                let key: string;

                if (word.orientation === Orientation.HorizontalOrientation) {
                    key = String.fromCharCode(word.line + ROW_OFFSET) + (word.startIdx + COLUMN_OFFSET + i).toString();
                    matrixPos = { x: word.line, y: word.startIdx + i };
                } else {
                    key = String.fromCharCode(word.startIdx + ROW_OFFSET + i) + (word.line + COLUMN_OFFSET).toString();
                    matrixPos = { x: word.startIdx + i, y: word.line };
                }
                // letter value : A = 1, B = 3, C = 3 ...etc
                const letterContribution: number = RESERVE[word.word[i].toUpperCase().charCodeAt(0) - ROW_OFFSET].points;
                // total earning for the letter (word[i]) at position (x, y)
                const earning: Earning = this.computeCell(key, letterContribution, matrixPos, scrabbleBoard);
                totalPoint += earning.letterPt;
                wordFactor *= earning.wordFactor;
            }

            word.point = totalPoint * wordFactor;
        }
    }

    sortDecreasingPoints(allPossibleWords: PossibleWords[]) {
        allPossibleWords.sort(this.sortDecreasing);
    }

    filterByRange(allPossibleWords: PossibleWords[], pointingRange: Range): PossibleWords[] {
        return allPossibleWords.filter((word) => word.point >= pointingRange.min && word.point <= pointingRange.max);
    }

    private bonusFactor(bonusFactor: number, matrixPos: Vec2, scrabbleBoard: string[][]): number {
        // check if there is a word on the matrixPos
        if (scrabbleBoard[matrixPos.x][matrixPos.y] === '') {
            return bonusFactor;
        }

        return MULTIPLICATION_NEUTRAL;
    }

    private computeCell(keyCell: string, letterValue: number, matrixPos: Vec2, scrabbleBoard: string[][]): Earning {
        // compute the earning (in letterFactor and wordFactor) of the cell at matrixPox
        let letterPt = 0;
        let wordFactor = 1;
        switch (board[keyCell as keyof typeof board]) {
            case 'doubleletter':
                letterPt = letterValue * this.bonusFactor(2, matrixPos, scrabbleBoard);
                break;
            case 'tripleletter':
                letterPt = letterValue * this.bonusFactor(3, matrixPos, scrabbleBoard);
                break;
            case 'doubleword':
                letterPt = letterValue;
                wordFactor *= this.bonusFactor(2, matrixPos, scrabbleBoard);
                break;
            case 'tripleword':
                letterPt = letterValue;
                wordFactor *= this.bonusFactor(3, matrixPos, scrabbleBoard);
                break;
            default:
                letterPt += letterValue;
                break;
        }

        return { letterPt, wordFactor };
    }
}
