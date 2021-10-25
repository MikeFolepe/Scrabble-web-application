import { EASEL_SIZE, MIN_RESERVE_SIZE_TO_SWAP } from '@app/classes/constants';
import { PlayerAIComponent } from '@app/modules/game-view/components/player-ai/player-ai.component';
import { PlayStrategy } from './abstract-strategy.model';
import { PlayerAI } from './player-ai.model';
import { SkipTurn } from './skip-turn-strategy.model';

export class SwapLetter extends PlayStrategy {
    execute(player: PlayerAI, context: PlayerAIComponent): void {
        if (context.letterService.reserveSize < MIN_RESERVE_SIZE_TO_SWAP) {
            player.replaceStrategy(new SkipTurn());
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
            context.letterService.addLetterToReserve(player.letterTable[index].value);
            player.letterTable[index] = context.letterService.getRandomLetter();
        }
        // Alert the context that AI Player swapped
        context.swap();
    }
}
