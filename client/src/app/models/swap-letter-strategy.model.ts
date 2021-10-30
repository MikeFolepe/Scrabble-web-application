/* eslint-disable sort-imports */
import { EASEL_SIZE, MIN_RESERVE_SIZE_TO_SWAP } from '@app/classes/constants';
import { PlayerAIService } from '@app/services/player-ia.service';
import { PlayStrategy } from './abstract-strategy.model';
import { PlayerAI } from './player-ai.model';
import { SkipTurn } from './skip-turn-strategy.model';

export class SwapLetter extends PlayStrategy {
    execute(playerAiService: PlayerAIService): void {
        const playerAi = playerAiService.playerService.players[1] as PlayerAI;

        if (playerAiService.letterService.reserveSize < MIN_RESERVE_SIZE_TO_SWAP) {
            playerAi.replaceStrategy(new SkipTurn());
            return;
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
            playerAiService.letterService.addLetterToReserve(playerAi.letterTable[index].value);
            playerAi.letterTable[index] = playerAiService.letterService.getRandomLetter();
        }
        // Alert the context that AI Player swapped
        console.log('jai swap');
    }
}
