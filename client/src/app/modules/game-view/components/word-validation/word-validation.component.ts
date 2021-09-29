/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { Component } from '@angular/core';
import dictionaryData from 'src/assets/dictionnary.json';
import { LETTER_VALUES, BONUSES_POSITIONS } from '@app/classes/constants';
import { ScoreValidation } from '@app/classes/validation-score';

@Component({
    selector: 'app-word-validation',
    templateUrl: './word-validation.component.html',
    styleUrls: ['./word-validation.component.scss'],
})
export class WordValidationComponent {
    dictionary: string[];
    newWords: string[];
    playedWords: Map<string, string[]>;
    newPlayedWords: Map<string, string[]>;
    newPositions: string[];
    
    constructor() {
        this.dictionary = JSON.parse(JSON.stringify(dictionaryData)).words;
        this.playedWords = new Map<string, string[]>();
        this.newPlayedWords = new Map<string, string[]>();
        this.newWords = new Array<string>();
        this.newPositions = new Array<string>();
    }

    isValidInDictionary(word: string): boolean {
        if (word.length >= 2) {
            // eslint-disable-next-line prefer-const
            for (let item of this.dictionary) {
                if (word === item) {
                    return true;
                }
            }
            return false;
        }
        retucrn false;
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
        if (this.playedWords.has(word)) {
            if (this.playedWords.get(word) !== undefined) {
                let mapValues: any = this.playedWords.get(word);
                let result = this.containsArray(mapValues, positions);
                return !result;
            }
            return true;
        }
        return true;
    }

    getWordPositions(word: string, index: number): string[] {
        let positions: string[] = new Array<string>();
        if (word !== '') {
            for (const char of word) {
                let indexChar = this.newWords.indexOf(char);
                positions.push(this.getCharPosition(index) + indexChar.toString());
            }
        }

        return positions;
    }

    passTroughAllLines(scrabbleBoard: string[][]) {
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                this.newWords.push(scrabbleBoard[i][j]);
                const words = this.findWords(this.newWords);
                this.newPositions = new Array<string>(words.length);

                for (let word of words) {
                    this.newPositions = this.getWordPositions(word, i);

                    if (this.checkIfNotPlayed(word, this.newPositions)) {
                        this.addToPlayedWords(word, this.newPositions, this.newPlayedWords);
                    }
                    this.newPositions = [];
                }
                this.newWords = [];
            }
        }
    }

    passThroughAllColumns(scrabbleBoard: string[][]) {
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                this.newWords.push(scrabbleBoard[j][i]);
                const words = this.findWords(this.newWords);
                this.newPositions = new Array<string>(words.length);

                for (let word of words) {
                    this.newPositions = this.getWordPositions(word, j);

                    if (this.checkIfNotPlayed(word, this.newPositions)) {
                        this.addToPlayedWords(word, this.newPositions, this.newPlayedWords);
                    }
                    this.newPositions = [];
                }
                this.newWords = [];
            }
        }
    }

    getCharPosition(line: number): string {
        const charRef = 'A';
        let asciiCode = charRef.charCodeAt(0) + line;
        return String.fromCharCode(asciiCode);
    }

    calculateTotalScore(score: number, words: Map<string, string[]>): number {

        for (let word of words.keys()){
            this.calculateLettersScore(score, word, words.get(word));
            this.applyBonusesWord(score, word, words.get(word));
        }
        return score;
    }

    calculateLettersScore(score: number, word: string, positions: any) {
        for (let letter of LETTER_VALUES) {
            for (let i = 0; i < word.length; i++) {
                if (word.charAt(i).toUpperCase() === letter.letter) {
                    switch (BONUSES_POSITIONS.get(positions[i])) {
                        case 'doubleletter': {
                            score += letter.value * 2;
                            break;
                        }
                        case 'tripleletter': {
                            score += letter.value * 3;
                            break;
                        }
                        default: {
                            score += letter.value;
                            break;
                        }
                    }
                }
            }
        }
    }

    removeBonuses(map: Map<string, string[]>) {
        for (let positions of map.values()) {
            for (let position of positions) {
                if (BONUSES_POSITIONS.has(position)) {
                    BONUSES_POSITIONS.delete(position);
                }
            }

        }
    }

    applyBonusesWord(score: number, word: string, positions: any) {
        for (let position of positions) {
            switch (BONUSES_POSITIONS.get(position)) {
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
    }

    validateAllWordsOnBoard(scrabbleBoard: string[][]): ScoreValidation {
        let scoreTotal = 0;
        this.passTroughAllLines(scrabbleBoard);
        this.passThroughAllColumns(scrabbleBoard);
        for (let word of this.newPlayedWords.keys()) {
            if (!this.isValidInDictionary(word)) {
                return { validation: false, score: scoreTotal };
            }
        }
        scoreTotal += this.calculateTotalScore(scoreTotal, this.newPlayedWords);
        this.removeBonuses(this.newPlayedWords);

        for (let word of this.newPlayedWords.keys()) {
            this.addToPlayedWords(word, this.newPlayedWords.get(word), this.playedWords);
        }

        return { validation: true, score: scoreTotal };
    }
}




