/* eslint-disable sort-imports */
import {
    BOARD_COLUMNS,
    BOARD_ROWS,
    CENTRAL_CASE_POSITION_X,
    DICTIONARY,
    INDEX_PLAYER_AI,
    INVALID,
    MAX_DIMENSIONS,
    NO_PLAYABLE_WORD,
    WAITING_AFTER_PLAYED
} from '@app/classes/constants';
import { Range } from '@app/classes/range';
import { BoardPattern, Orientation, PatternInfo, PossibleWords } from '@app/classes/scrabble-board-pattern';
import { Vec2 } from '@app/classes/vec2';
import { PlayerAIService } from '@app/services/player-ia.service';
import { PlayerAI } from './player-ai.model';
export class PlaceLetters {
    dictionary: string[];
    private board: string[][][];
    constructor(public pointingRange: Range) {
        this.dictionary = DICTIONARY;
        this.board = [];
    }

    execute(playerAiService: PlayerAIService): void {
        const playerAi = playerAiService.playerService.players[INDEX_PLAYER_AI] as PlayerAI;
        const isFirstRound = playerAiService.placeLetterService.isFirstRound;
        const scrabbleBoard = playerAiService.placeLetterService.scrabbleBoard;

        this.initializeArray(scrabbleBoard);
        let allPossibleWords: PossibleWords[];
        let matchingPointingRangeWords: PossibleWords[] = [];

        const patterns = this.generateAllPatterns(playerAi.getHand(), isFirstRound);
        allPossibleWords = this.generateAllWords(this.dictionary, patterns);
        allPossibleWords = this.removeIfNotEnoughLetter(allPossibleWords, playerAi);

        if (isFirstRound) {
            allPossibleWords.forEach((word) => (word.startIdx = CENTRAL_CASE_POSITION_X));
        } else {
            allPossibleWords = this.removeIfNotDisposable(allPossibleWords);
        }

        playerAiService.calculatePoints(allPossibleWords, scrabbleBoard);
        playerAiService.sortDecreasingPoints(allPossibleWords);
        matchingPointingRangeWords = playerAiService.filterByRange(allPossibleWords, this.pointingRange);

        this.computeResults(allPossibleWords, matchingPointingRangeWords, playerAiService);

        setTimeout(() => {
            playerAiService.debugService.receiveAIDebugPossibilities(allPossibleWords.concat(matchingPointingRangeWords));
            playerAiService.endGameService.actionsLog.push('placer');
            // TODO: DIRE A LA CHATBOX
            playerAiService.skipTurnService.switchTurn();
        }, WAITING_AFTER_PLAYED);
    }

    private computeResults(allPossibleWords: PossibleWords[], matchingPointingRangeWords: PossibleWords[], playerAiService: PlayerAIService): void {
        let index: number = this.placementAttempt(matchingPointingRangeWords, playerAiService);
        if (index !== NO_PLAYABLE_WORD) {
            playerAiService.place(matchingPointingRangeWords[index]);
            matchingPointingRangeWords.splice(index, 1);
            return;
        }

        index = this.placementAttempt(allPossibleWords, playerAiService);
        if (index !== NO_PLAYABLE_WORD) {
            playerAiService.place(allPossibleWords[index]);
            allPossibleWords.splice(index, 1);
            return;
        }

        playerAiService.swap();
    }

    private placementAttempt(possibilities: PossibleWords[], playerAiService: PlayerAIService): number {
        let i = 0;

        for (i = 0; i < possibilities.length; i++) {
            const word = possibilities[i];
            let start: Vec2;
            let orientation: string;
            if (word.orientation === Orientation.HorizontalOrientation) {
                start = { x: word.line, y: word.startIdx };
                orientation = 'h';
            } else {
                start = { x: word.startIdx, y: word.line };
                orientation = 'v';
            }

            let scrabbleBoard: string[][] = JSON.parse(JSON.stringify(playerAiService.placeLetterService.scrabbleBoard));
            scrabbleBoard = playerAiService.placeWordOnBoard(scrabbleBoard, word.word, start, orientation);
            const isValid = this.validateWord(scrabbleBoard);

            if (isValid) {
                return i;
            }
        }

        return NO_PLAYABLE_WORD;
    }

    private initializeArray(scrabbleBoard: string[][]) {
        const array: string[][][] = new Array(Object.keys(Orientation).length / 2);
        array[Orientation.HorizontalOrientation] = new Array(BOARD_COLUMNS);
        array[Orientation.VerticalOrientation] = new Array(BOARD_ROWS);

        for (let i = 0; i < BOARD_ROWS; i++) {
            array[Orientation.HorizontalOrientation][i] = scrabbleBoard[i];
            const column: string[] = [];
            for (let j = 0; j < BOARD_COLUMNS; j++) {
                column.push(scrabbleBoard[j][i]);
            }
            array[Orientation.VerticalOrientation][i] = column;
        }

        this.board = array;
    }

    private removeIfNotDisposable(allPossibleWords: PossibleWords[]): PossibleWords[] {
        const filteredWords: PossibleWords[] = [];
        const re1 = new RegExp('(?<=[A-Za-z])(,?)(?=[A-Za-z])', 'g');
        const re2 = new RegExp('[,]', 'g');
        const re3 = new RegExp('[a-z]{1,}', 'g');
        for (const word of allPossibleWords) {
            let line = this.board[word.orientation][word.line]
                .map((element: string) => {
                    return element === '' ? ' ' : element;
                })
                .toString();
            line = line.replace(re2, '');
            const radixes = this.board[word.orientation][word.line].toString().replace(re1, '').match(re3) as string[];
            if (this.isWordFitting(line, word, radixes)) {
                filteredWords.push(word);
            }
        }

        return filteredWords;
    }

    private isWordFitting(line: string, wordToPlace: PossibleWords, radixes: string[]): boolean {
        const isEmptyCase = new Array<boolean>(wordToPlace.word.length);
        isEmptyCase.fill(true);

        let pattern = '';

        for (const root of radixes) {
            const startIdx = wordToPlace.word.search(root);
            const endIdx = startIdx + root.length;
            for (let i = startIdx; i < endIdx; i++) {
                isEmptyCase[i] = false;
            }
        }

        for (let i = 0; i < isEmptyCase.length; i++) {
            pattern += isEmptyCase[i] ? ' ' : wordToPlace.word[i];
        }

        const start = line.search(pattern);
        const end = start + wordToPlace.word.length - 1;

        if (start === INVALID) {
            return false;
        }

        wordToPlace.startIdx = start;
        return this.isWordOverWriting(line, start, end, wordToPlace.word.length) === false;
    }

    private isWordOverWriting(line: string, startIdx: number, endIdx: number, wordLength: number): boolean {
        if (wordLength !== BOARD_ROWS) {
            const touchOtherWordByRight = startIdx === 0 && line[endIdx + 1] !== ' ';
            const touchOtherWordByLeft = endIdx === BOARD_ROWS && line[startIdx - 1] !== ' ';
            const touchOtherWordByRightOrLeft = startIdx !== 0 && endIdx !== BOARD_ROWS && line[startIdx - 1] !== ' ' && line[endIdx + 1] !== ' ';
            if (touchOtherWordByRight || touchOtherWordByLeft || touchOtherWordByRightOrLeft) {
                return true;
            }
        }
        return false;
    }

    private removeIfNotEnoughLetter(allPossibleWords: PossibleWords[], player: PlayerAI) {
        const filteredWords: PossibleWords[] = [];

        for (const word of allPossibleWords) {
            let isWordValid = true;
            for (const letter of word.word) {
                const re = new RegExp(letter, 'g');
                const re1 = new RegExp('[,]{1,}', 'g');
                const amountOfLetterNeeded: number = (word.word.match(re) || []).length;
                const amountOfLetterPresent: number = (this.board[word.orientation][word.line].toString().replace(re1, '').match(re) || []).length;
                const playerAmount: number = player.playerQuantityOf(letter);

                if (amountOfLetterNeeded > playerAmount + amountOfLetterPresent) {
                    isWordValid = false;
                    break;
                }
            }

            if (isWordValid) {
                filteredWords.push(word);
            }
        }

        return filteredWords;
    }

    private generateAllWords(dictionaryToLookAt: string[], patterns: BoardPattern) {
        const allWords: PossibleWords[] = [];

        for (const pattern of patterns.horizontal) {
            const regExp = new RegExp(pattern.pattern, 'g');
            for (const word of dictionaryToLookAt) {
                if (regExp.test(word) && this.checkIfWordIsPresent(pattern.pattern, word)) {
                    allWords.push({ word, orientation: Orientation.HorizontalOrientation, line: pattern.line, startIdx: 0, point: 0 });
                }
            }
        }

        for (const pattern of patterns.vertical) {
            const regExp = new RegExp(pattern.pattern, 'g');
            for (const word of dictionaryToLookAt) {
                if (regExp.test(word) && this.checkIfWordIsPresent(pattern.pattern, word)) {
                    allWords.push({ word, orientation: Orientation.VerticalOrientation, line: pattern.line, startIdx: 0, point: 0 });
                }
            }
        }

        return allWords;
    }

    private checkIfWordIsPresent(pattern: string, word: string): boolean {
        const re = new RegExp('(?<=[*])(([a-z]*)?)', 'g');
        const wordPresent = pattern.match(re);

        for (let i = 0; wordPresent !== null && i < wordPresent.length; i++) {
            if (wordPresent[i] === word) {
                return false;
            }
        }

        return true;
    }

    private generateAllPatterns(playerHand: string, isFirstRound: boolean): BoardPattern {
        let horizontal: PatternInfo[] = [];
        let vertical: PatternInfo[] = [];

        if (isFirstRound) {
            horizontal.push({ line: CENTRAL_CASE_POSITION_X, pattern: '^' + playerHand.toLowerCase() + '*$' });
            vertical.push({ line: CENTRAL_CASE_POSITION_X, pattern: '^' + playerHand.toLowerCase() + '*$' });
            return { horizontal, vertical };
        }

        horizontal = this.generatePattern(Orientation.HorizontalOrientation, playerHand);
        vertical = this.generatePattern(Orientation.VerticalOrientation, playerHand);

        return { horizontal, vertical };
    }

    private generatePattern(orientation: Orientation, playerHand: string): PatternInfo[] {
        const patternArray: PatternInfo[] = [];

        const re1 = new RegExp('(?<=[A-Za-z])(,?)(?=[A-Za-z])', 'g');
        const re2 = new RegExp('[,]{1,}', 'g');

        for (let line = 0; line < BOARD_COLUMNS; line++) {
            let pattern = this.board[orientation][line]
                .toString()
                .replace(re1, '')
                .replace(re2, playerHand + '*')
                .toLowerCase();
            // If it's not an empty row
            if (pattern !== playerHand.toLowerCase() + '*') {
                pattern = '^' + pattern + '$';
                patternArray.push({ line, pattern });
            }
        }

        return patternArray;
    }

    private validateWord(scrabbleBoard: string[][]): boolean {
        const save = JSON.parse(JSON.stringify(this.board));

        this.initializeArray(scrabbleBoard);
        const wordsOnBoard: string[] = [];

        const re1 = new RegExp('[,]', 'g');
        const re2 = new RegExp('[ ]{1}', 'g');

        for (let dimension = 0; dimension < MAX_DIMENSIONS; dimension++) {
            for (let i = 0; i < BOARD_COLUMNS; i++) {
                this.board[dimension][i]
                    .map((element: string) => {
                        return element === '' ? ' ' : element;
                    })
                    .toString()
                    .replace(re1, '')
                    .split(re2)
                    .forEach((word) => {
                        if (word.length > 1 && word !== '') wordsOnBoard.push(word);
                    });
            }
        }

        for (const word of wordsOnBoard) {
            const found = this.dictionary.find((element) => element === word);
            if (found === undefined) {
                this.board = save;
                return false;
            }
        }

        this.board = save;
        return true;
    }
}
