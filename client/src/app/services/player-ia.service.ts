import { Injectable } from '@angular/core';
import { DELAY_TO_PASS_TURN, EASEL_SIZE, INDEX_PLAYER_AI, MIN_RESERVE_SIZE_TO_SWAP, ONE_SECOND_DELAY } from '@app/classes/constants';
import { TypeMessage } from '@app/classes/enum';
import { Range } from '@app/classes/range';
import { Orientation, PossibleWords } from '@app/classes/scrabble-board-pattern';
import { PlayerAI } from '@app/models/player-ai.model';
import { Vec2 } from '@common/vec2';
import { ChatboxService } from './chatbox.service';
import { DebugService } from './debug.service';
import { EndGameService } from './end-game.service';
import { GameSettingsService } from './game-settings.service';
import { LetterService } from './letter.service';
import { PlaceLetterService } from './place-letter.service';
import { PlayerService } from './player.service';
import { RandomBonusesService } from './random-bonuses.service';
import { SendMessageService } from './send-message.service';
import { SkipTurnService } from './skip-turn.service';
import { WordValidationService } from './word-validation.service';

@Injectable({
    providedIn: 'root',
})
export class PlayerAIService {
    constructor(
        // All services needed for AI Player functionnalities
        public placeLetterService: PlaceLetterService,
        public wordValidation: WordValidationService,
        public skipTurnService: SkipTurnService,
        public playerService: PlayerService,
        public letterService: LetterService,
        public endGameService: EndGameService,
        public chatBoxService: ChatboxService,
        public debugService: DebugService,
        public sendMessageService: SendMessageService,
        public randomBonusService: RandomBonusesService,
        public wordValidationService: WordValidationService,
        public gameSettingsService: GameSettingsService,
    ) {}

    skip(): void {
        setTimeout(() => {
            this.skipTurnService.switchTurn();
            this.sendMessageService.displayMessageByType(this.playerService.players[INDEX_PLAYER_AI].name + ' : ' + '!passer ', TypeMessage.Opponent);
        }, DELAY_TO_PASS_TURN);
    }

    generateRandomNumber(maxValue: number): number {
        return Math.floor(Number(Math.random()) * maxValue);
    }

    swap(isDifficultMode: boolean): boolean {
        const playerAi = this.playerService.players[1] as PlayerAI;
        const lettersToSwap: string[] = [];

        if (this.letterService.reserveSize < MIN_RESERVE_SIZE_TO_SWAP) {
            return false;
        }

        let numberOfLetterToChange: number;
        do {
            numberOfLetterToChange = this.generateRandomNumber(EASEL_SIZE);
        } while (numberOfLetterToChange === 0);

        if (isDifficultMode) numberOfLetterToChange = EASEL_SIZE;

        // Choose the index of letters to be changed
        const indexOfLetterToBeChanged: number[] = [];
        while (indexOfLetterToBeChanged.length < numberOfLetterToChange) {
            const candidateInt = this.generateRandomNumber(EASEL_SIZE);
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            if (indexOfLetterToBeChanged.indexOf(candidateInt) === -1) {
                indexOfLetterToBeChanged.push(candidateInt);
            }
        }

        for (const index of indexOfLetterToBeChanged) {
            lettersToSwap.push(playerAi.letterTable[index].value.toLowerCase());
        }

        // For each letter chosen to be changed : 1. add it to reserve ; 2.get new letter
        for (const index of indexOfLetterToBeChanged) {
            this.letterService.addLetterToReserve(playerAi.letterTable[index].value);
            playerAi.letterTable[index] = this.letterService.getRandomLetter();
        }

        this.sendMessageService.displayMessageByType(
            this.playerService.players[INDEX_PLAYER_AI].name + ' : ' + '!échanger ' + lettersToSwap,
            TypeMessage.Opponent,
        );

        setTimeout(() => {
            this.skipTurnService.switchTurn();
        }, DELAY_TO_PASS_TURN);
        return true;
    }

    async place(word: PossibleWords): Promise<void> {
        const playerAi = this.playerService.players[1] as PlayerAI;
        console.log(playerAi.getHand());
        const startPos = word.orientation ? { x: word.line, y: word.startIndex } : { x: word.startIndex, y: word.line };
        const isValid = await this.placeLetterService.placeCommand(startPos, word.orientation, word.word);
        if (isValid) {
            const column = (startPos.x + 1).toString();
            const row: string = String.fromCharCode(startPos.y + 'a'.charCodeAt(0));
            const charOrientation = word.orientation === Orientation.Horizontal ? 'h' : 'v';
            setTimeout(() => {
                this.sendMessageService.displayMessageByType(
                    this.playerService.players[INDEX_PLAYER_AI].name + ' : ' + '!placer ' + row + column + charOrientation + ' ' + word.word,
                    TypeMessage.Opponent,
                );
            }, ONE_SECOND_DELAY);
            console.log(playerAi.getHand());

            return;
        }
    }

    placeWordOnBoard(scrabbleBoard: string[][], word: string, start: Vec2, orientation: Orientation): string[][] {
        for (let j = 0; orientation === Orientation.Horizontal && j < word.length; j++) {
            scrabbleBoard[start.x][start.y + j] = word[j];
        }

        for (let i = 0; orientation === Orientation.Vertical && i < word.length; i++) {
            scrabbleBoard[start.x + i][start.y] = word[i];
        }

        return scrabbleBoard;
    }

    sortDecreasing = (word1: PossibleWords, word2: PossibleWords) => {
        const EQUAL_SORT_NUMBER = 0;
        const BIGGER_SORT_NUMBER = 1;
        const SMALLER_SORT_NUMBER = -1;

        if (word1.point === word2.point) return EQUAL_SORT_NUMBER;
        return word1.point < word2.point ? BIGGER_SORT_NUMBER : SMALLER_SORT_NUMBER;
    };

    async calculatePoints(allPossibleWords: PossibleWords[]): Promise<PossibleWords[]> {
        console.log(allPossibleWords);
        for (const word of allPossibleWords) {
            const start: Vec2 = word.orientation ? { x: word.startIndex, y: word.line } : { x: word.line, y: word.startIndex };
            const orientation: Orientation = word.orientation;
            const currentBoard = JSON.parse(JSON.stringify(this.placeLetterService.scrabbleBoard));
            const updatedBoard = this.placeWordOnBoard(currentBoard, word.word, start, orientation);
            const scoreValidation = await this.wordValidation.validateAllWordsOnBoard(
                updatedBoard,
                word.word.length === EASEL_SIZE + 1,
                word.orientation === Orientation.Horizontal,
                false,
            );
            word.point = scoreValidation.validation ? scoreValidation.score : 0;
            if (word.point === 0) console.log(word);
        }
        allPossibleWords = allPossibleWords.filter((word) => word.point > 0);
        return allPossibleWords;
    }

    sortDecreasingPoints(allPossibleWords: PossibleWords[]): void {
        allPossibleWords.sort(this.sortDecreasing);
    }

    filterByRange(allPossibleWords: PossibleWords[], pointingRange: Range): PossibleWords[] {
        return allPossibleWords.filter((word) => word.point >= pointingRange.min && word.point <= pointingRange.max);
    }
}
