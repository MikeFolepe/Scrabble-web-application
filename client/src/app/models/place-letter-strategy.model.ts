/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable max-lines */
import { BOARD_COLUMNS, BOARD_ROWS, CENTRAL_CASE_POSITION_X, DICTIONARY, INDEX_PLAYER_AI } from '@app/classes/constants';
import { Range } from '@app/classes/range';
import { BoardPattern, Orientation, PatternInfo, PossibleWords } from '@app/classes/scrabble-board-pattern';
import { Vec2 } from '@app/classes/vec2';
import { PlayerAIComponent } from '@app/modules/game-view/components/player-ai/player-ai.component';
import { PlayStrategy } from './abstract-strategy.model';
import { PlayerAI } from './player-ai.model';
import { SwapLetter } from './swap-letter-strategy.model';

export class PlaceLetters extends PlayStrategy {
    dictionary: string[] = DICTIONARY;
    private board: string[][][] = [];
    constructor(public pointingRange: Range) {
        super();
    }

    execute(player: PlayerAI, context: PlayerAIComponent): void {
        this.initializeArray(context.placeLetterService.scrabbleBoard);
        let allPossibleWords: PossibleWords[];
        let matchingPointingRangeWords: PossibleWords[] = [];

        const patterns = this.generateAllPatterns(player.getHand(), context.playerAIService.isFirstRound);
        allPossibleWords = this.generateAllWords(this.dictionary, patterns);
        allPossibleWords = this.removeIfNotEnoughLetter(allPossibleWords, context.aiPlayer);

        if (context.playerAIService.isFirstRound) {
            allPossibleWords.forEach((word) => (word.startIdx = CENTRAL_CASE_POSITION_X));
        } else {
            allPossibleWords = this.removeIfNotDisposable(allPossibleWords);
        }

        context.playerAIService.calculatePoints(allPossibleWords, context.placeLetterService.scrabbleBoard);
        context.playerAIService.sortDecreasingPoints(allPossibleWords);
        matchingPointingRangeWords = context.playerAIService.filterByRange(allPossibleWords, this.pointingRange);

        this.computeResults(allPossibleWords, matchingPointingRangeWords, context);
        //context.switchTurn();
    }

    computeResults(allPossibleWords: PossibleWords[], matchingPointingRangeWords: PossibleWords[], context: PlayerAIComponent): void {
        // debugger;
        if (matchingPointingRangeWords.length !== 0 && this.attempt(matchingPointingRangeWords, context)) {
            context.playerService.refillEasel(1);
            context.sendPossibilities(matchingPointingRangeWords);
            return;
        } else if (allPossibleWords.length !== 0 && this.attempt(allPossibleWords, context)) {
            context.playerService.refillEasel(1);
            context.sendPossibilities(allPossibleWords);
            return;
        } else {
            context.aiPlayer.replaceStrategy(new SwapLetter());
        }
    }

    attempt(possibilities: PossibleWords[], context: PlayerAIComponent): boolean {
        let attempt = 0;
        do {
            const randomIdx = Math.floor(Math.random() * possibilities.length);
            const word = possibilities[randomIdx];
            let start: Vec2;
            let orientation: string;
            if (word.orientation === Orientation.horizontal) {
                start = { x: word.line, y: word.startIdx };
                orientation = 'h';
            } else {
                start = { x: word.startIdx, y: word.line };
                orientation = 'v';
            }
            context.placeLetterService.placeMethodAdapter({ start, orientation, word: word.word, indexPlayer: INDEX_PLAYER_AI });
            attempt++;
        } while (attempt < possibilities.length && context.playerAIService.isFirstRound === false);
        return context.playerAIService.isPlacementValid;
    }

    initializeArray(scrabbleBoard: string[][]) {
        const array: string[][][] = new Array(Object.keys(Orientation).length / 2);
        array[Orientation.horizontal] = new Array(BOARD_COLUMNS);
        array[Orientation.vertical] = new Array(BOARD_ROWS);

        for (let i = 0; i < BOARD_ROWS; i++) {
            array[Orientation.horizontal][i] = scrabbleBoard[i];
            const column: string[] = [];
            for (let j = 0; j < BOARD_COLUMNS; j++) {
                column.push(scrabbleBoard[j][i]);
            }
            array[Orientation.vertical][i] = column;
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
            const radix = this.board[word.orientation][word.line].toString().replace(re1, '').match(re3) as string[];
            if (this.isWordNotOverflowing(line, word.word, radix) && this.isWordFitting(line, word, radix)) {
                filteredWords.push(word);
            }
        }

        return filteredWords;
    }

    isWordNotOverflowing(line: string, wordToPlace: string, radix: string[]): boolean {
        const startIdxWord = wordToPlace.indexOf(radix[0]);

        const startIdxRadix = line.indexOf(radix[radix.length - 1]);
        const endIdxRadix = startIdxRadix + radix.length;

        if (startIdxWord > line.search(radix[0])) {
            return false;
        }

        if (radix[0] !== radix[radix.length - 1] && endIdxRadix >= BOARD_COLUMNS) {
            return false;
        }

        return true;
    }

    isWordFitting(line: string, wordToPlace: PossibleWords, radix: string[]): boolean {
        const isEmptyCase = new Array<boolean>(wordToPlace.word.length);
        isEmptyCase.fill(true);

        let pattern = '';

        for (const root of radix) {
            const startIdx = wordToPlace.word.search(root);
            const endIdx = startIdx + root.length;
            for (let i = startIdx; i < endIdx; i++) {
                isEmptyCase[i] = false;
            }
        }

        for (let i = 0; i < isEmptyCase.length; i++) {
            if (isEmptyCase[i]) {
                pattern += ' ';
            } else {
                pattern += wordToPlace.word[i];
            }
        }

        const start = line.search(pattern);
        const end = start + wordToPlace.word.length - 1;

        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (start === -1) {
            return false;
            // indisposable
        }

        wordToPlace.startIdx = start;
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        return this.isWordOverwritting(line, start, end, wordToPlace.word.length) === false;
    }

    isWordOverwritting(line: string, startIdx: number, endIdx: number, wordLength: number): boolean {
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
                if (regExp.test(word) && this.notMatchWordAlrdyPrsnt(pattern.pattern, word)) {
                    allWords.push({ word, orientation: Orientation.horizontal, line: pattern.line, startIdx: 0, point: 0 });
                }
            }
        }

        for (const pattern of patterns.vertical) {
            const regExp = new RegExp(pattern.pattern, 'g');
            for (const word of dictionaryToLookAt) {
                if (regExp.test(word) && this.notMatchWordAlrdyPrsnt(pattern.pattern, word)) {
                    allWords.push({ word, orientation: Orientation.vertical, line: pattern.line, startIdx: 0, point: 0 });
                }
            }
        }

        return allWords;
    }

    notMatchWordAlrdyPrsnt(pattern: string, word: string): boolean {
        const re = new RegExp('(?<=[*])(([a-z]*)?)', 'g');
        const wordAlrdyPrsnt = pattern.match(re);

        for (let i = 0; wordAlrdyPrsnt !== null && i < wordAlrdyPrsnt.length; i++) {
            if (wordAlrdyPrsnt[i] === word) {
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
            let pattern = this.board[Orientation.horizontal][rowIndex]
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
            let pattern = this.board[Orientation.vertical][columnIndex]
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
}
