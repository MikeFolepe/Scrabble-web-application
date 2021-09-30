import { BOARD_COLUMNS, BOARD_ROWS, CENTRAL_CASE_POSX, CENTRAL_CASE_POSY, dictionary, INDEX_PLAYER_IA, RESERVE } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { Range } from '@app/classes/range';
import { board } from '@app/classes/scrabble-board';
import { Vec2 } from '@app/classes/vec2';
import { PlayerIAComponent } from '@app/modules/game-view/components/player-ia/player-ia.component';
import { PlayStrategy } from './abstract-strategy.model';
import { PlayerIA } from './player-ia.model';

const ROW_OFFSET = 65; /* = 'A' */
const COLUMN_OFFSET = 1; /* Array starting at 0 */
const WORDOVERFLOWS = -1;

export class PlaceLetters extends PlayStrategy {
    constructor(private pointingRange: Range) {
        super();
    }

    execute(player: PlayerIA, context: PlayerIAComponent): void {
        // get the player's hand to generate a pattern containing
        // only player's disponible letters
        let pattern: string = this.pattern(player.letterTable);
        let randomX: number = CENTRAL_CASE_POSX;
        let randomY: number = CENTRAL_CASE_POSY;

        if (!context.isFirstRound) {
            do {
                randomX = new Date().getTime() % BOARD_COLUMNS;
                randomY = new Date().getTime() % BOARD_ROWS;
            } while (context.scrabbleBoard[randomX][randomY] === '');
            // get the player's hand to generate a pattern containing
            // a character already on the scrabbleBoard + player's disponible letters (only)
            pattern = this.pattern(player.letterTable, context.scrabbleBoard[randomX][randomY]);
        }

        // debugger;

        // generate all possibilities matching the pattern
        const allPossibleWord: string[] = this.generateAllPossibilities(pattern);
        // remove those who nb(char(x)) > nb(char(x of player's hand))
        const possibleWord: string[] = this.generatePossibilities(allPossibleWord, player);
        // Choose within the possibilities
        this.choosePossibility(possibleWord, context, { x: randomX, y: randomY });
    }
    private pattern(letterTable: Letter[], startingChar = ''): string {
        let pattern = '^[';

        if (startingChar !== '') {
            pattern = '^[' + startingChar + '][';
        }

        for (const letter of letterTable) {
            pattern += letter.value;
        }
        pattern += ']+$';

        return pattern;
    }

    private generateAllPossibilities(pattern: string): string[] {
        const allPossibleWord: string[] = [];
        const re = new RegExp(pattern, 'igm');
        for (const word of dictionary) {
            // test all word and retain those who satisfies the pattern
            if (re.test(word)) {
                allPossibleWord.push(word);
            }
        }
        return allPossibleWord;
    }

    private generatePossibilities(allPossibleWord: string[], player: PlayerIA): string[] {
        const possibleWord: string[] = [];
        // Into all possible word...
        for (const word of allPossibleWord) {
            let isValidWord = true;
            // ...pick those who letter's quantity matches the player letter quantity
            for (const letter of word) {
                const re = new RegExp(letter, 'g');
                const count: number = (word.match(re) || []).length;

                if (count > this.playerQuantityOf(letter, player)) {
                    isValidWord = false;
                    break;
                }
            }

            if (isValidWord) {
                possibleWord.push(word);
            }
        }
        return possibleWord;
    }

    private choosePossibility(possibleWord: string[], context: PlayerIAComponent, startPos: Vec2): void {
        const MAX_POINTING = 6;
        const randomPointing = new Date().getTime() % MAX_POINTING;
        const randomOrientation: string = ['h', 'v'][new Date().getTime() % ['h', 'v'].length];
        let randomPointingFound = false;
        let alternativePointingFound = false;
        const priorityPossibilities: string[] = [];
        const alternativePossibilities: string[] = [];

        // Whitin all the possible words separate those who matches this turn randomPointing
        // from those who doesn't matches the randomPointing but are in range min < x < max
        for (const word of possibleWord) {
            const nbPt = this.calculatePoint(startPos, randomOrientation, word, context.scrabbleBoard);
            if (nbPt === randomPointing) {
                randomPointingFound = true;
                priorityPossibilities.push(word);
            } else if (nbPt <= this.pointingRange.max && nbPt > this.pointingRange.min) {
                alternativePointingFound = true;
                alternativePossibilities.push(word);
            }
        }
        debugger;

        // If a word matching this turn randomPointing is found place it on the scrabble board
        if (randomPointingFound) {
            context.place({
                start: startPos,
                orientation: randomOrientation,
                word: priorityPossibilities[new Date().getTime() % priorityPossibilities.length],
                indexPlayer: INDEX_PLAYER_IA,
            });
            // set le score du joueur
        }
        // If there isn't word matching this turn randomPointing but exists alternatives place it as well
        else if (!randomPointingFound && alternativePointingFound) {
            context.place({
                start: startPos,
                orientation: randomOrientation,
                word: alternativePossibilities[new Date().getTime() % alternativePossibilities.length],
                indexPlayer: INDEX_PLAYER_IA,
            });
            // set le score du joueur
        }
        // If there isn't word matching this turn randomPointing & existing alternatives skip the turn
        else if (!randomPointingFound && !alternativePointingFound) {
            context.skip();
        }
    }

    private playerQuantityOf(letter: string, player: PlayerIA): number {
        let quantity = 0;

        for (const playerLetter of player.letterTable) {
            if (playerLetter.value === letter) {
                quantity++;
            }
        }
        return quantity;
    }

    private bonusFactor(bonusFactor: number, matrixPos: Vec2, scrabbleBoard: string[][]): number {
        // check if there is a word on the matrixPos and applies or not the wordFactor
        if (scrabbleBoard[matrixPos.x][matrixPos.y] === '') {
            return bonusFactor;
        }

        // There is already a word on the matrixPos
        // No bonus
        return 1;
    }

    private calculatePoint(startPos: Vec2, orientation: string, word: string, scrabbleBoard: string[][]): number {
        // If the word will overflow quit
        if (orientation === 'h' && startPos.x + word.length > BOARD_COLUMNS) {
            return WORDOVERFLOWS;
        }
        if (orientation === 'v' && startPos.y + word.length > BOARD_ROWS) {
            return WORDOVERFLOWS;
        }
        let totalPoint = 0;
        let wordFactor = 1;

        // For each letter compute it's value and bonus earning
        for (let i = 0; i < word.length; i++) {
            // A0 < key < O15 to find the right bonus from board variable (see import)
            let key: string;
            // current position in word earning point calculation
            let matrixPos: Vec2;
            if (orientation === 'h') {
                key = String.fromCharCode(startPos.x + ROW_OFFSET) + (startPos.y + COLUMN_OFFSET + i).toString();
                matrixPos = { x: startPos.x, y: startPos.y + i };
            } else {
                key = String.fromCharCode(startPos.x + ROW_OFFSET + i) + (startPos.y + COLUMN_OFFSET).toString();
                matrixPos = { x: startPos.x + i, y: startPos.y };
            }
            // letter value : A = 1, B = 3, C = 3 ...etc
            const letterContribution: number = RESERVE[word[i].toUpperCase().charCodeAt(0) - ROW_OFFSET].points;
            // total earning for the letter (word[i]) at position (x, y)
            const earning: { letterPt: number; wordFactor: number } = this.computeCell(key, letterContribution, matrixPos, scrabbleBoard);
            totalPoint += earning.letterPt;
            wordFactor *= earning.wordFactor;
        }

        return totalPoint * wordFactor;
    }

    private computeCell(keyCell: string, letterValue: number, matrixPos: Vec2, scrabbleBoard: string[][]): { letterPt: number; wordFactor: number } {
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
