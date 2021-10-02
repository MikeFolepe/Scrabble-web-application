import { EASEL_SIZE } from '@app/classes/constants';
import { PlayerIAComponent } from '@app/modules/game-view/components/player-ia/player-ia.component';
import { PlayStrategy } from './abstract-strategy.model';
import { PlayerIA } from './player-ia.model';
export class SwapLetter extends PlayStrategy {
    execute(player: PlayerIA, context: PlayerIAComponent): void {
        const numberOfLetterToChange = Math.floor(Math.random() * EASEL_SIZE);

        // If change not possible skip
        if (numberOfLetterToChange > context.letterService.getReserveSize()) {
            context.skip();
            return;
        }

        // Choose the index of letters to be changed
        const indexOfLetterToBeChanged: number[] = [];
        for (let i = 0; i < numberOfLetterToChange; i++) {
            indexOfLetterToBeChanged.push(Math.floor(Math.random() * EASEL_SIZE));
        }

        // For each letter chosen to be changed : 1. add it to reserve ; 2.get new letter
        for (const index of indexOfLetterToBeChanged) {
            // Potential issue with the use of EASEL_SIZE instead of letterTable.length
            context.letterService.addLetterToReserve(player.letterTable[indexOfLetterToBeChanged[index]].value);
            player.letterTable[indexOfLetterToBeChanged[index]] = context.letterService.getRandomLetter();
        }

        // Alert the context that AI Player swapped
        context.swap();
    }
}
