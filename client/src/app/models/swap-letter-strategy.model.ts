import { EASEL_SIZE } from '@app/classes/constants';
import { PlayerAIComponent } from '@app/modules/game-view/components/player-ai/player-ai.component';
import { PlayStrategy } from './abstract-strategy.model';
import { PlayerAI } from './player-ai.model';
import { SkipTurn } from './skip-turn-strategy.model';

export class SwapLetter extends PlayStrategy {
    execute(player: PlayerAI, context: PlayerAIComponent): void {
        const numberOfLetterToChange = Math.floor(Math.random() * EASEL_SIZE);

        // If change not possible skip
        if (numberOfLetterToChange > context.letterService.reserveSize) {
            player.replaceStrategy(new SkipTurn());
            return;
        }

        // Choose the index of letters to be changed
        const indexOfLetterToBeChanged: number[] = [];
        for (let i = 0; i < numberOfLetterToChange; i++) {
            indexOfLetterToBeChanged.push(Math.floor(Math.random() * EASEL_SIZE));
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
