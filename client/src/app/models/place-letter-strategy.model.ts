/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable sort-imports */
import { BOARD_COLUMNS, BOARD_ROWS, CENTRAL_CASE_POSITION_X, DICTIONARY } from '@app/classes/constants';
import { Range } from '@app/classes/range';
import { BoardPattern, Orientation, PatternInfo, PossibleWords } from '@app/classes/scrabble-board-pattern';
import { Vec2 } from '@app/classes/vec2';
import { PlayerAIService } from '@app/services/player-ia.service';
import { PlayStrategy } from './abstract-strategy.model';
import { PlayerAI } from './player-ai.model';

const NO_PLAYABLE_WORD = -1;
export class PlaceLetters extends PlayStrategy {
    dictionary: string[];
    private board: string[][][];
    constructor(public pointingRange: Range) {
        super();
        this.dictionary = DICTIONARY;
        this.board = [];
    }

    execute(playerAiService: PlayerAIService): void {
        const playerAi = playerAiService.playerService.players[1] as PlayerAI;
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
            playerAiService.skipTurnService.switchTurn();
        }, 5000);
    }

    computeResults(allPossibleWords: PossibleWords[], matchingPointingRangeWords: PossibleWords[], playerAiService: PlayerAIService): void {
        let idx: number = this.attempt(matchingPointingRangeWords, playerAiService);
        if (idx !== NO_PLAYABLE_WORD) {
            console.log("j'ai joué : " + matchingPointingRangeWords[idx].word);
            console.log(matchingPointingRangeWords[idx]);
            console.log(playerAiService.playerService.players[1].letterTable);
            playerAiService.place(matchingPointingRangeWords[idx]);
            return;
        }

        idx = this.attempt(allPossibleWords, playerAiService);
        if (idx !== NO_PLAYABLE_WORD) {
            console.log("j'ai joué : " + allPossibleWords[idx].word);
            console.log(allPossibleWords[idx]);
            console.log(playerAiService.playerService.players[1].letterTable);
            playerAiService.place(allPossibleWords[idx]);
            return;
        }

        console.log("j'ai été forcé de changer de strategie : je swap");
        playerAiService.swap();
    }

    attempt(possibilities: PossibleWords[], playerAiService: PlayerAIService): number {
        let result = { validation: false, score: 0 };
        let i = 0;

        for (i = 0; i < possibilities.length && result.validation === false; i++) {
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
            result = playerAiService.wordValidation.validateAllWordsOnBoard(scrabbleBoard, word.word.length === 7, orientation === 'h', true);

            if (result.validation === true) {
                console.log(this.validateWord(scrabbleBoard));
                return i;
            }
        }

        return NO_PLAYABLE_WORD;
    }

    initializeArray(scrabbleBoard: string[][]) {
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

    removeIfNotDisposable(allPossibleWords: PossibleWords[]): PossibleWords[] {
        const filteredWords: PossibleWords[] = [];
        const re1 = new RegExp('(?<=[A-Za-z])(,?)(?=[A-Za-z])', 'g');
        const re2 = new RegExp('[,]', 'g');
        const re3 = new RegExp('[a-z]{1,}', 'g');
        for (const word of allPossibleWords) {
            let line = this.board[word.orientation][word.line]
                .map((element: string) => {
                    if (element === '') return ' ';
                    else {
                        return element;
                    }
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

    isWordFitting(line: string, wordToPlace: PossibleWords, radixes: string[]): boolean {
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

        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        // search function returns -1 if not found so as we are only calling -1 a single time, we decided to keep it like this
        if (start === -1) {
            return false;
        }

        wordToPlace.startIdx = start;
        return this.isWordOverWriting(line, start, end, wordToPlace.word.length) === false;
    }

    isWordOverWriting(line: string, startIdx: number, endIdx: number, wordLength: number): boolean {
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

    removeIfNotEnoughLetter(allPossibleWords: PossibleWords[], player: PlayerAI) {
        const filteredWords: PossibleWords[] = [];

        for (const word of allPossibleWords) {
            let isWordValid = true;
            for (const letter of word.word) {
                const re = new RegExp(letter, 'g');
                const re1 = new RegExp('[,]{1,}', 'g');
                const amntOfLetterNeeded: number = (word.word.match(re) || []).length;
                const amntOfLetterAlrdyPrsnt: number = (this.board[word.orientation][word.line].toString().replace(re1, '').match(re) || []).length;
                const plQ: number = player.playerQuantityOf(letter);

                if (amntOfLetterNeeded > plQ + amntOfLetterAlrdyPrsnt) {
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

    generateAllWords(dictionaryToLookAt: string[], patterns: BoardPattern) {
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

    checkIfWordIsPresent(pattern: string, word: string): boolean {
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
        const horizontal: PatternInfo[] = [];
        const vertical: PatternInfo[] = [];

        if (isFirstRound) {
            horizontal.push({ line: CENTRAL_CASE_POSITION_X, pattern: '^' + playerHand.toLowerCase() + '*$' });
            vertical.push({ line: CENTRAL_CASE_POSITION_X, pattern: '^' + playerHand.toLowerCase() + '*$' });
            return { horizontal, vertical };
        }

        const re1 = new RegExp('(?<=[A-Za-z])(,?)(?=[A-Za-z])', 'g');
        const re2 = new RegExp('[,]{1,}', 'g');

        for (let rowIndex = 0; rowIndex < BOARD_COLUMNS; rowIndex++) {
            let pattern = this.board[Orientation.HorizontalOrientation][rowIndex]
                .toString()
                .replace(re1, '')
                .replace(re2, playerHand + '*')
                .toLowerCase();
            // If it's not an empty row
            if (pattern !== playerHand.toLowerCase() + '*') {
                pattern = '^' + pattern + '$';
                horizontal.push({ line: rowIndex, pattern });
            }
        }
        for (let columnIndex = 0; columnIndex < BOARD_COLUMNS; columnIndex++) {
            let pattern = this.board[Orientation.VerticalOrientation][columnIndex]
                .toString()
                .replace(re1, '')
                .replace(re2, playerHand + '*')
                .toLowerCase();
            // If it's not an empty row
            if (pattern !== playerHand.toLowerCase() + '*') {
                pattern = '^' + pattern + '$';
                vertical.push({ line: columnIndex, pattern });
            }
        }

        return { horizontal, vertical };
    }

    validateWord(scrabbleBoard: string[][]): boolean {
        const save = JSON.parse(JSON.stringify(this.board));

        this.initializeArray(scrabbleBoard);
        let wordsOnBoard: string[] = [];

        const re1 = new RegExp('[,]', 'g');
        const re2 = new RegExp('[ ]{1}', 'g');

        for (let i = 0; i < BOARD_COLUMNS; i++) {
            this.board[0][i]
                .map((element: string) => {
                    if (element === '') return ' ';
                    else {
                        return element;
                    }
                })
                .toString()
                .replace(re1, '')
                .split(re2)
                .forEach((x) => {
                    if (x.length > 1) wordsOnBoard.push(x);
                });

            this.board[1][i]
                .map((element: string) => {
                    if (element === '') return ' ';
                    else {
                        return element;
                    }
                })
                .toString()
                .replace(re1, '')
                .split(re2)
                .forEach((x) => {
                    if (x.length > 1) wordsOnBoard.push(x);
                });
        }
        wordsOnBoard = wordsOnBoard.filter((element) => {
            return element !== '';
        });
        console.log(wordsOnBoard);
        for (let i = 0; i < wordsOnBoard.length && wordsOnBoard[i].length > 1; i++) {
            const found = this.dictionary.find((element) => element === wordsOnBoard[i]);
            if (found === undefined) {
                this.board = save;
                console.log(wordsOnBoard[i] + " n'est pas dans le dico");
                return false;
            }
        }

        this.board = save;
        return true;
    }
}
