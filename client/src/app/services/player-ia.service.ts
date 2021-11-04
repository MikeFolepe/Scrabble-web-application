import { Board, Earning } from '@app/classes/scrabble-board';
import { Orientation, PossibleWords } from '@app/classes/scrabble-board-pattern';
import { Injectable } from '@angular/core';
import { RESERVE } from '@app/classes/constants';
import { Range } from '@app/classes/range';
import { Vec2 } from '@app/classes/vec2';

const ROW_OFFSET = 65;
const COLUMN_OFFSET = 1;

@Injectable({
    providedIn: 'root',
})
export class PlayerAIService {
    isFirstRound: boolean = true;
    isPlacementValid: boolean;

    calculatePoints(allPossibleWords: PossibleWords[], scrabbleBoard: string[][]) {
        for (const word of allPossibleWords) {
            let totalPoint = 0;
            let wordFactor = 1;
            for (let i = 0; i < word.word.length; i++) {
                let key: string;
                let matrixPos: Vec2;

                if (word.orientation === Orientation.Horizontal) {
                    key = String.fromCharCode(word.line + ROW_OFFSET) + (word.startIdx + COLUMN_OFFSET + i).toString();
                    matrixPos = { x: word.line, y: word.startIdx + i };
                } else {
                    key = String.fromCharCode(word.startIdx + ROW_OFFSET + i) + (word.line + COLUMN_OFFSET).toString();
                    matrixPos = { x: word.startIdx + i, y: word.line };
                }
                // Letter value : A = 1, B = 3, C = 3 ...etc
                const letterContribution: number = RESERVE[word.word[i].toUpperCase().charCodeAt(0) - ROW_OFFSET].points;
                // Total earning for the letter (word[i]) at position (x, y)
                const earning: Earning = this.computeCell(key, letterContribution, matrixPos, scrabbleBoard);
                totalPoint += earning.letterPoint;
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
        const MULTIPLICATION_NEUTRAL = 1;
        // Check if there is a word on the matrixPos
        return scrabbleBoard[matrixPos.x][matrixPos.y] === '' ? bonusFactor : MULTIPLICATION_NEUTRAL;
    }

    private computeCell(keyCell: string, letterValue: number, matrixPos: Vec2, scrabbleBoard: string[][]): Earning {
        // compute the earning (in letterFactor and wordFactor) of the cell at matrixPox
        let letterPoint = 0;
        let wordFactor = 1;
        switch (Board[keyCell as keyof typeof Board]) {
            case 'doubleletter':
                letterPoint = letterValue * this.bonusFactor(2, matrixPos, scrabbleBoard);
                break;
            case 'tripleletter':
                letterPoint = letterValue * this.bonusFactor(3, matrixPos, scrabbleBoard);
                break;
            case 'doubleword':
                letterPoint = letterValue;
                wordFactor *= this.bonusFactor(2, matrixPos, scrabbleBoard);
                break;
            case 'tripleword':
                letterPoint = letterValue;
                wordFactor *= this.bonusFactor(3, matrixPos, scrabbleBoard);
                break;
            default:
                letterPoint += letterValue;
                break;
        }

        return { letterPoint, wordFactor };
    }

    private sortDecreasing = (word1: PossibleWords, word2: PossibleWords) => {
        const EQUAL_SORT_NUMBER = 0;
        const BIGGER_SORT_NUMBER = 1;
        const SMALLER_SORT_NUMBER = -1;

        if (word1.point === word2.point) return EQUAL_SORT_NUMBER;
        return word1.point < word2.point ? BIGGER_SORT_NUMBER : SMALLER_SORT_NUMBER;
    };
}
