// import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ALL_EASEL_BONUS, BOARD_COLUMNS, BOARD_ROWS, BONUSES_POSITIONS, RESERVE } from '@app/classes/constants';
import { ScoreValidation } from '@app/classes/validation-score';
import { CommunicationService } from '@app/services/communication.service';
@Injectable({
    providedIn: 'root',
})
export class WordValidationService {
    private newWords: string[];
    private playedWords: Map<string, string[]>;
    private newPlayedWords: Map<string, string[]>;
    private newPositions: string[];
    private bonusesPositions: Map<string, string>;
    private validationState = false;
    private foundWords: string[];

    constructor(private httpServer: CommunicationService) {
        this.playedWords = new Map<string, string[]>();
        this.newPlayedWords = new Map<string, string[]>();
        this.newWords = new Array<string>();
        this.newPositions = new Array<string>();
        this.bonusesPositions = new Map<string, string>(BONUSES_POSITIONS);
        this.foundWords = new Array<string>();
    }

    findWords(words: string[]): string[] {
        return words
            .toString()
            .replace(/[,][,]+/gi, ' ')
            .replace(/[,]/gi, '')
            .split(' ');
    }

    addToPlayedWords(word: string, positions: string[], map: Map<string, string[]>): void {
        let mapValues = new Array<string>();
        if (map.has(word)) {
            mapValues = map.get(word) as string[];
            for (const position of positions) {
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
                (i) => (v: string) =>
                    (i = mainArray.indexOf(v, i) + 1)
            )(0),
        );
    }

    checkIfPlayed(word: string, positions: string[]): boolean {
        if (this.playedWords.has(word)) {
            const mapValues = this.playedWords.get(word) as string[];
            return this.containsArray(mapValues, positions);
        }
        return false;
    }

    getWordHorizontalOrVerticalPositions(word: string, indexLine: number, indexColumn: number, isRow: boolean): string[] {
        const positions: string[] = new Array<string>();
        for (const char of word) {
            if (isRow) {
                const indexChar = this.newWords.indexOf(char) + 1;
                positions.push(this.getCharPosition(indexLine) + indexChar.toString());
            } else {
                const indexChar = this.newWords.indexOf(char);
                const column = indexColumn + 1;
                positions.push(this.getCharPosition(indexChar) + column.toString());
            }
        }

        return positions;
    }

    passThroughAllRowsOrColumns(scrabbleBoard: string[][], isRow: boolean) {
        let x = 0;
        let y = 0;
        for (let i = 7; i < BOARD_ROWS; i++) {
            for (let j = 0; j < BOARD_COLUMNS; j++) {
                x = isRow ? i : j;
                y = isRow ? j : i;
                this.newWords.push(scrabbleBoard[x][y]);
            }
            this.foundWords = this.findWords(this.newWords);
            this.newPositions = new Array<string>(this.foundWords.length);

            for (const word of this.foundWords) {
                if (word.length >= 2) {
                    this.newPositions = this.getWordHorizontalOrVerticalPositions(word, x, y, isRow);
                    if (!this.checkIfPlayed(word, this.newPositions)) {
                        this.addToPlayedWords(word, this.newPositions, this.newPlayedWords);
                    }
                }
                this.newPositions = [];
            }
            this.newWords = [];
            this.foundWords = [];
        }
    }

    getCharPosition(line: number): string {
        const charRef = 'A';
        const asciiCode = charRef.charCodeAt(0) + line;
        return String.fromCharCode(asciiCode);
    }

    calculateTotalScore(score: number, words: Map<string, string[]>): number {
        let scoreWord = 0;
        for (const word of words.keys()) {
            const scoreLetter = this.calculateLettersScore(score, word, words.get(word) as string[]);
            scoreWord += this.applyBonusesWord(scoreLetter, words.get(word) as string[]);
        }
        return scoreWord;
    }

    calculateLettersScore(score: number, word: string, positions: string[]): number {
        for (let i = 0; i < word.length; i++) {
            let char = word.charAt(i);
            if (char.toUpperCase() === char) {
                char = '*';
            }
            for (const letter of RESERVE) {
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
        for (const positions of map.values()) {
            for (const position of positions) {
                if (this.bonusesPositions.has(position)) {
                    this.bonusesPositions.delete(position);
                }
            }
        }
    }

    applyBonusesWord(score: number, positions: string[]): number {
        for (const position of positions) {
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

    async validateAllWordsOnBoard(scrabbleBoard: string[][], isEaselSize: boolean, isRow: boolean): Promise<ScoreValidation> {
        let scoreTotal = 0;
        this.passThroughAllRowsOrColumns(scrabbleBoard, isRow);
        this.passThroughAllRowsOrColumns(scrabbleBoard, !isRow);
        this.validationState = await this.httpServer.validationPost(this.newPlayedWords).toPromise();
        if (!this.validationState) {
            this.newPlayedWords.clear();
            return { validation: this.validationState, score: scoreTotal };
        }

        scoreTotal += this.calculateTotalScore(scoreTotal, this.newPlayedWords);

        if (isEaselSize) {
            scoreTotal += ALL_EASEL_BONUS;
        }

        this.removeBonuses(this.newPlayedWords);

        for (const word of this.newPlayedWords.keys()) {
            this.addToPlayedWords(word, this.newPlayedWords.get(word) as string[], this.playedWords);
        }

        this.newPlayedWords.clear();

        return { validation: this.validationState, score: scoreTotal };
    }
}