/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { EASEL_SIZE, MIN_RESERVE_SIZE_TO_SWAP, RESERVE } from '@app/classes/constants';
import { Range } from '@app/classes/range';
import { board, Earning } from '@app/classes/scrabble-board';
import { Orientation, PossibleWords } from '@app/classes/scrabble-board-pattern';
import { Vec2 } from '@app/classes/vec2';
import { PlayerAI } from '@app/models/player-ai.model';
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

    generateRandomNumber(maxValue: number): number {
        return Math.floor(Number(Math.random()) * maxValue);
    }

    swap(): boolean {
        const playerAi = this.playerService.players[1] as PlayerAI;

        if (this.letterService.reserveSize < MIN_RESERVE_SIZE_TO_SWAP) {
            return false;
        }

        let numberOfLetterToChange: number;
        do {
            numberOfLetterToChange = this.generateRandomNumber(EASEL_SIZE);
        } while (numberOfLetterToChange === 0);

        // Choose the index of letters to be changed
        const indexOfLetterToBeChanged: number[] = [];
        for (let i = 0; i < numberOfLetterToChange; i++) {
            indexOfLetterToBeChanged.push(this.generateRandomNumber(EASEL_SIZE));
        }

        // For each letter chosen to be changed : 1. add it to reserve ; 2.get new letter
        for (const index of indexOfLetterToBeChanged) {
            this.letterService.addLetterToReserve(playerAi.letterTable[index].value);
            playerAi.letterTable[index] = this.letterService.getRandomLetter();
        }

        return true;
    }

    place(word: PossibleWords) {
        const startPos = word.orientation ? { x: word.startIdx, y: word.line } : { x: word.line, y: word.startIdx };
        const isValid = this.placeLetterService.place(startPos, word.orientation ? 'v' : 'h', word.word);

        if (!isValid) {
            this.swap();
            // dire que j'ai swap
        }
    }

    placeWordOnBoard(scrabbleBoard: string[][], word: string, start: Vec2, orientation: string) {
        for (let j = 0; orientation === 'h' && j < word.length; j++) {
            scrabbleBoard[start.x][start.y + j] = word[j];
        }

        for (let i = 0; orientation === 'v' && i < word.length; i++) {
            scrabbleBoard[start.x + i][start.y] = word[i];
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
