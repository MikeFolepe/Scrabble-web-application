/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { Component } from '@angular/core';
import { ALL_EASEL_BONUS, BONUSES_POSITIONS, dictionary, RESERVE, BOARD_ROWS, BOARD_COLUMNS } from '@app/classes/constants';
import { ScoreValidation } from '@app/classes/validation-score';

@Component({
    selector: 'app-word-validation',
    templateUrl: './word-validation.component.html',
    styleUrls: ['./word-validation.component.scss'],
})
export class WordValidationComponent {
    newWords: string[];
    playedWords: Map<string, string[]>;
    newPlayedWords: Map<string, string[]>;
    newPositions: string[];
    bonusesPositions: Map<string, string>;
    constructor() {
        this.playedWords = new Map<string, string[]>();
        this.newPlayedWords = new Map<string, string[]>();
        this.newWords = new Array<string>();
        this.newPositions = new Array<string>();
        this.bonusesPositions = new Map<string, string>(BONUSES_POSITIONS);
    }

    isValidInDictionary(word: string): boolean {
        if (word.length >= 2) {
            // eslint-disable-next-line prefer-const
            for (let item of dictionary) {
                if (word === item) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }

    findWords(words: string[]): string[] {
        return words
            .toString()
            .replace(/[,][,]+/gi, ' ')
            .replace(/[,]/gi, '')
            .split(' ');
    }

    addToPlayedWords(word: string, positions: any, map: any): void {
        let mapValues = new Array<string>();
        if (map.has(word)) {
            if (map.get(word) !== undefined) {
                mapValues = map.get(word);
            }
            for (let position of positions) {
                mapValues.push(position);
            }
            map.set(word, mapValues);
        } else {
            map.set(word, positions);
        }
    }

    containsArray(mainArray: string[], subArray: string[]): boolean {
        return subArray.every(
            (
                (i) => (v: any) =>
                    (i = mainArray.indexOf(v, i) + 1)
            )(0),
        );
    }

    checkIfNotPlayed(word: string, positions: string[]): boolean {
        let result = true;
        if (this.playedWords.has(word)) {
            if (this.playedWords.get(word) !== undefined) {
                let mapValues: any = this.playedWords.get(word);
                result = this.containsArray(mapValues, positions);
                return !result;
            }
        } else if (this.playedWords.size === 0) {
            for (let pos of this.newPlayedWords.values()) {
                result = this.containsArray(pos, positions);
                return !result;
            }
        }
        return result;
    }

    getWordPositionsHorizontal(word: string, index: number): string[] {
        let positions: string[] = new Array<string>();
        for (const char of word) {
            let indexChar = this.newWords.indexOf(char) + 1;
            positions.push(this.getCharPosition(index) + indexChar.toString());
        }

        return positions;
    }

    getWordPositionsVertical(word: string, index: number): string[] {
        let positions: string[] = new Array<string>();
        for (const char of word) {
            let indexChar = this.newWords.indexOf(char);
            let column = index + 1;
            positions.push(this.getCharPosition(indexChar) + column.toString());
        }
        return positions;
    }

    passTroughAllRows(scrabbleBoard: string[][]) {
        for (let i = 0; i < BOARD_ROWS; i++) {
            for (let k = 0; k < BOARD_COLUMNS; k++) {
                this.newWords.push(scrabbleBoard[i][k]);
            }
            const words = this.findWords(this.newWords);
            this.newPositions = new Array<string>(words.length);

            for (let word of words) {
                if (word.length >= 2) {
                    this.newPositions = this.getWordPositionsHorizontal(word, i);
                    if (this.checkIfNotPlayed(word, this.newPositions)) {
                        this.addToPlayedWords(word, this.newPositions, this.newPlayedWords);
                    }
                }
                this.newPositions = [];
            }
            this.newWords = [];
        }
    }

    passThroughAllColumns(scrabbleBoard: string[][]) {
        for (let k = 0; k < BOARD_COLUMNS; k++) {
            for (let i = 0; i < BOARD_ROWS; i++) {
                this.newWords.push(scrabbleBoard[i][k]);
            }
            const words = this.findWords(this.newWords);
            this.newPositions = new Array<string>(words.length);

            for (let word of words) {
                if (word.length >= 2) {
                    this.newPositions = this.getWordPositionsVertical(word, k);
                    if (this.checkIfNotPlayed(word, this.newPositions)) {
                        this.addToPlayedWords(word, this.newPositions, this.newPlayedWords);
                    }
                }
                this.newPositions = [];
            }
            this.newWords = [];
        }
    }

    getCharPosition(line: number): string {
        const charRef = 'A';
        let asciiCode = charRef.charCodeAt(0) + line;
        return String.fromCharCode(asciiCode);
    }

    calculateTotalScore(score: number, words: Map<string, string[]>): number {
        let scoreWord = 0;
        for (let word of words.keys()) {
            let scoreLetter = this.calculateLettersScore(score, word, words.get(word));
            scoreWord = this.applyBonusesWord(scoreLetter, word, words.get(word));
        }
        return scoreWord;
    }

    calculateLettersScore(score: number, word: string, positions: any): number {
        for (let i = 0; i < word.length; i++) {
            let char = word.charAt(i);
            if (char.toUpperCase() === char) {
                char = '*';
            }
            for (let letter of RESERVE) {
                if (char.toUpperCase() === letter.value) {
                    switch (this.bonusesPositions.get(positions[i])) {
                        case 'doubleletter': {
                            score += letter.points * 2;
                            break;
                        }
                        case 'tripleletter': {
                            score += letter.points * 3;
                            break;
                        }
                        default: {
                            score += letter.points;
                            break;
                        }
                    }
                }
            }
        }
        return score;
    }

    removeBonuses(map: Map<string, string[]>) {
        for (let positions of map.values()) {
            for (let position of positions) {
                if (this.bonusesPositions.has(position)) {
                    this.bonusesPositions.delete(position);
                }
            }
        }
    }

    applyBonusesWord(score: number, word: string, positions: any): number {
        for (let position of positions) {
            switch (this.bonusesPositions.get(position)) {
                case 'doubleword': {
                    score = score * 2;
                    break;
                }
                case 'tripleword': {
                    score = score * 3;
                    break;
                }
                default: {
                    break;
                }
            }
        }
        return score;
    }

    validateAllWordsOnBoard(scrabbleBoard: string[][] , isEaselSize: boolean): ScoreValidation {
        let scoreTotal = 0;
        this.passTroughAllRows(scrabbleBoard);
        this.passThroughAllColumns(scrabbleBoard);
        for (let word of this.newPlayedWords.keys()) {
            if (!this.isValidInDictionary(word)) {
                this.newPlayedWords.clear();
                return { validation: false, score: scoreTotal };
            }
        }
        scoreTotal += this.calculateTotalScore(scoreTotal, this.newPlayedWords);4

        if (isEaselSize) {
            scoreTotal += ALL_EASEL_BONUS;
        }

        this.removeBonuses(this.newPlayedWords);

        for (let word of this.newPlayedWords.keys()) {
            this.addToPlayedWords(word, this.newPlayedWords.get(word), this.playedWords);
        }

        this.newPlayedWords.clear();

        return { validation: true, score: scoreTotal };
    }
}
