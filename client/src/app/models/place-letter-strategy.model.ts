import { BOARD_COLUMNS, BOARD_ROWS, CENTRAL_CASE_POSITION_X, INDEX_INVALID, INDEX_PLAYER_AI } from '@app/classes/constants';
import { Range } from '@app/classes/range';
import { BoardPattern, Orientation, PatternInfo, PossibleWords } from '@app/classes/scrabble-board-pattern';
import { PlayerAIService } from '@app/services/player-ia.service';
import * as dictionaryData from '@common/dictionary.json';
import { Vec2 } from '@common/vec2';
import { PlayerAI } from './player-ai.model';

export class PlaceLetterStrategy {
    dictionary: string[];
    private board: string[][][];

    constructor(public pointingRange: Range) {
        this.dictionary = JSON.parse(JSON.stringify(dictionaryData)).words;
        this.board = [];
    }

    async execute(playerAiService: PlayerAIService): Promise<void> {
        const playerAi = playerAiService.playerService.players[INDEX_PLAYER_AI] as PlayerAI;
        const isFirstRound = playerAiService.placeLetterService.isFirstRound;
        const scrabbleBoard = playerAiService.placeLetterService.scrabbleBoard;
        let allPossibleWords: PossibleWords[];
        let matchingPointingRangeWords: PossibleWords[] = [];

        this.initializeArray(scrabbleBoard);

        const patterns = this.generateAllPatterns(playerAi.getHand(), isFirstRound);
        allPossibleWords = this.generateAllWords(this.dictionary, patterns);
        allPossibleWords = this.removeIfNotEnoughLetter(allPossibleWords, playerAi);

        if (isFirstRound) {
            allPossibleWords.forEach((word) => (word.startIndex = CENTRAL_CASE_POSITION_X));
        } else {
            allPossibleWords = this.removeIfNotDisposable(allPossibleWords);
        }
        await playerAiService.calculatePoints(allPossibleWords, scrabbleBoard);
        playerAiService.sortDecreasingPoints(allPossibleWords);
        matchingPointingRangeWords = playerAiService.filterByRange(allPossibleWords, this.pointingRange);

        await this.computeResults(allPossibleWords, matchingPointingRangeWords, playerAiService);
        playerAiService.debugService.receiveAIDebugPossibilities(allPossibleWords.concat(matchingPointingRangeWords));
        playerAiService.endGameService.actionsLog.push('placer');
    }

    private async computeResults(
        allPossibleWords: PossibleWords[],
        matchingPointingRangeWords: PossibleWords[],
        playerAiService: PlayerAIService,
    ): Promise<void> {
        const noPlayableWord = -1;
        // First, try place word satisfying PointingRange.min < nbPt < PointingRange.max
        let index: number = this.placementAttempt(matchingPointingRangeWords, playerAiService);
        if (playerAiService.gameSettingsService.gameSettings.level === 'facile' && index !== noPlayableWord) {
            await playerAiService.place(matchingPointingRangeWords[index]);
            matchingPointingRangeWords.splice(index, 1);
            return;
        }

        // Second, try place the other words
        index = this.placementAttempt(allPossibleWords, playerAiService);
        // debugger;
        if (index !== noPlayableWord) {
            await playerAiService.place(allPossibleWords[index]);
            allPossibleWords.splice(index, 1);
            return;
        }

        // No possibilities for this turn, player will swap for more possibilities on next turn
        playerAiService.swap();
    }

    private placementAttempt(possibilities: PossibleWords[], playerAiService: PlayerAIService): number {
        let i = 0;
        const noPlayableWord = -1;
        for (i = 0; i < possibilities.length; i++) {
            const word = possibilities[i];
            const start: Vec2 = word.orientation ? { x: word.startIndex, y: word.line } : { x: word.line, y: word.startIndex };
            const orientation: Orientation = word.orientation;
            // Deep copy of the game scrabble board because of hypotetical placement
            let scrabbleBoard: string[][] = JSON.parse(JSON.stringify(playerAiService.placeLetterService.scrabbleBoard));
            // Place the hypotetic word on the copy of scrabble board
            scrabbleBoard = playerAiService.placeWordOnBoard(scrabbleBoard, word.word, start, orientation);
            // Pass the scrabble board for the validation
            const isValid = this.validateWord(scrabbleBoard);

            if (isValid) {
                return i;
            }
        }
        return noPlayableWord;
    }

    private initializeArray(scrabbleBoard: string[][]): void {
        const array: string[][][] = new Array(Object.keys(Orientation).length / 2);
        array[Orientation.Horizontal] = new Array(BOARD_COLUMNS);
        array[Orientation.Vertical] = new Array(BOARD_ROWS);
        // Initialize the tridimensional array representing the scrabble board
        // array[dimension][line][letter] <=> array[2 dimensions][15 line/dimensions][15 tile/row]
        for (let i = 0; i < BOARD_ROWS; i++) {
            array[Orientation.Horizontal][i] = scrabbleBoard[i];
            const column: string[] = [];
            for (let j = 0; j < BOARD_COLUMNS; j++) {
                column.push(scrabbleBoard[j][i]);
            }
            array[Orientation.Vertical][i] = column;
        }

        this.board = array;
    }

    private removeIfNotDisposable(allPossibleWords: PossibleWords[]): PossibleWords[] {
        const filteredWords: PossibleWords[] = [];
        const regex1 = new RegExp('(?<=[A-Za-z])(,?)(?=[A-Za-z])', 'g');
        const regex2 = new RegExp('[,]', 'g');
        const regex3 = new RegExp('[a-z]{1,}', 'g');
        for (const word of allPossibleWords) {
            let line = this.board[word.orientation][word.line]
                .map((element: string) => {
                    return element === '' ? ' ' : element;
                })
                .toString();
            line = line.replace(regex2, '');
            const radixes = this.board[word.orientation][word.line].toString().replace(regex1, '').match(regex3) as string[];
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
            const startIndex = wordToPlace.word.search(root);
            const endIdx = startIndex + root.length;
            for (let i = startIndex; i < endIdx; i++) {
                isEmptyCase[i] = false;
            }
        }

        for (let i = 0; i < isEmptyCase.length; i++) {
            // Construct the word skeleton by replacing empty tiles in the row by spaces
            // and the filled tiles by the letter value actually in the row
            pattern += isEmptyCase[i] ? ' ' : wordToPlace.word[i];
        }

        // Search this skeleton in the row
        const start = line.search(pattern);
        const end = start + wordToPlace.word.length - 1;

        if (start === INDEX_INVALID) {
            return false;
        }

        // If found set the starting positing for later placing
        wordToPlace.startIndex = start;
        // If found the word must not touch the adjacent words
        return this.isWordOverWriting(line, start, end, wordToPlace.word.length) === false;
    }

    private isWordOverWriting(line: string, startIndex: number, endIdx: number, wordLength: number): boolean {
        if (wordLength !== BOARD_ROWS) {
            const touchOtherWordByRight = startIndex === 0 && line[endIdx + 1] !== ' ';
            const touchOtherWordByLeft = endIdx === BOARD_ROWS && line[startIndex - 1] !== ' ';
            const touchOtherWordByRightOrLeft = startIndex !== 0 && endIdx !== BOARD_ROWS && line[startIndex - 1] !== ' ' && line[endIdx + 1] !== ' ';

            // The beginning and the end of the word must not touch another
            if (touchOtherWordByRight || touchOtherWordByLeft || touchOtherWordByRightOrLeft) {
                return true;
            }
        }
        return false;
    }

    private removeIfNotEnoughLetter(allPossibleWords: PossibleWords[], player: PlayerAI): PossibleWords[] {
        const filteredWords: PossibleWords[] = [];

        for (const word of allPossibleWords) {
            let isWordValid = true;
            for (const letter of word.word) {
                const regex1 = new RegExp(letter, 'g');
                const regex2 = new RegExp('[,]{1,}', 'g');
                const amountOfLetterNeeded: number = (word.word.match(regex1) || []).length;
                const amountOfLetterPresent: number = (this.board[word.orientation][word.line].toString().replace(regex2, '').match(regex1) || [])
                    .length;
                const playerAmount: number = player.playerQuantityOf(letter);

                if (amountOfLetterNeeded > playerAmount + amountOfLetterPresent) {
                    // Not add the words that need more letter than available
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

    private generateAllWords(dictionaryToLookAt: string[], patterns: BoardPattern): PossibleWords[] {
        // Generate all words satisfying the patterns found
        const allWords: PossibleWords[] = [];
        for (const pattern of patterns.horizontal) {
            const regex = new RegExp(pattern.pattern, 'g');
            for (const word of dictionaryToLookAt) {
                if (regex.test(word) && this.checkIfWordIsPresent(pattern.pattern, word)) {
                    allWords.push({ word, orientation: Orientation.Horizontal, line: pattern.line, startIndex: 0, point: 0 });
                }
            }
        }

        for (const pattern of patterns.vertical) {
            const regex = new RegExp(pattern.pattern, 'g');
            for (const word of dictionaryToLookAt) {
                if (regex.test(word) && this.checkIfWordIsPresent(pattern.pattern, word)) {
                    allWords.push({ word, orientation: Orientation.Vertical, line: pattern.line, startIndex: 0, point: 0 });
                }
            }
        }

        return allWords;
    }

    private checkIfWordIsPresent(pattern: string, word: string): boolean {
        const regex = new RegExp('(?<=[*])(([a-z]*)?)', 'g');
        const wordPresent = pattern.match(regex);

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
            // At first round the only pattern is the letter in the player's easel
            horizontal.push({ line: CENTRAL_CASE_POSITION_X, pattern: '^' + playerHand.toLowerCase() + '*$' });
            vertical.push({ line: CENTRAL_CASE_POSITION_X, pattern: '^' + playerHand.toLowerCase() + '*$' });
            return { horizontal, vertical };
        }

        horizontal = this.generatePattern(Orientation.Horizontal, playerHand);
        vertical = this.generatePattern(Orientation.Vertical, playerHand);

        return { horizontal, vertical };
    }

    private generatePattern(orientation: Orientation, playerHand: string): PatternInfo[] {
        const patternArray: PatternInfo[] = [];

        const regex1 = new RegExp('(?<=[A-Za-z])(,?)(?=[A-Za-z])', 'g');
        const regex2 = new RegExp('[,]{1,}', 'g');

        for (let line = 0; line < BOARD_COLUMNS; line++) {
            let pattern = this.board[orientation][line]
                .toString()
                .replace(regex1, '')
                .replace(regex2, playerHand + '*')
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

        // Place the word on the scrabble board to check the situation it would cause
        this.initializeArray(scrabbleBoard);
        const wordsOnBoard: string[] = [];

        const regex1 = new RegExp('[,]', 'g');
        const regex2 = new RegExp('[ ]{1}', 'g');

        // Capture all groups of 2 letters or more
        const maxDimensions = Object.keys(Orientation).length / 2;

        for (let dimension = 0; dimension < maxDimensions; dimension++) {
            for (let i = 0; i < BOARD_COLUMNS; i++) {
                this.board[dimension][i]
                    .map((element: string) => {
                        return element === '' ? ' ' : element;
                    })
                    .toString()
                    .replace(regex1, '')
                    .split(regex2)
                    .forEach((word) => {
                        if (word.length > 1 && word !== '') wordsOnBoard.push(word);
                    });
            }
        }

        // Check if all groups of at least 2 letters are in the dictionary
        for (const word of wordsOnBoard) {
            const found = this.dictionary.find((element) => element === word);
            if (found === undefined) {
                this.board = save;
                return false;
            }
        }

        // Restore the board
        this.board = save;
        return true;
    }
}
