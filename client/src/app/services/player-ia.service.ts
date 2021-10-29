import { Injectable } from '@angular/core';
import { RESERVE } from '@app/classes/constants';
import { Range } from '@app/classes/range';
import { board, Earning } from '@app/classes/scrabble-board';
import { Orientation, PossibleWords } from '@app/classes/scrabble-board-pattern';
import { Vec2 } from '@app/classes/vec2';

const ROW_OFFSET = 65;
const COLUMN_OFFSET = 1;
const MULTIPLICATION_NEUTRAL = 1;

@Injectable({
    providedIn: 'root',
})
export class PlayerAIService {
    isFirstRound: boolean = true;
    isPlacementValid: boolean;
    sortDecreasing = (word1: PossibleWords, word2: PossibleWords) => {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (word1.point > word2.point) return -1;
        if (word1.point < word2.point) return 1;
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
