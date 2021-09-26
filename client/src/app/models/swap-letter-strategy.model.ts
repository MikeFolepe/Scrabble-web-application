import { EASEL_SIZE } from '@app/classes/constants';
import { PlayerIAComponent } from '@app/modules/game-view/components/player-ia/player-ia.component';
import { PlayStrategy } from './abstract-strategy.model';
import { PlayerIA } from './player-ia.model';
export class SwapLetter extends PlayStrategy {
    execute(player: PlayerIA, context: PlayerIAComponent): void {
        // number [0, 7[
        const numberOfLetterToChange = new Date().getTime() % EASEL_SIZE;

        if (
            numberOfLetterToChange - numberOfLetterToChange /* Verifier que la reserve a autant de lettres que le nombre d'echange 
        généré*/
        ) {
            context.swap();
            return;
        }
        for (let index = 0; index < numberOfLetterToChange; index++) {
            // index of the letter to be replaced from the player's letter array
            // const letterToBeReplaced = new Date().getTime() % EASEL_SIZE;
            // the new letter picked in replacement
            // player.letterTable[letterToBeReplaced] = context.letterService.swapLetter(player.letterTable[letterToBeReplaced]);
        }
        // Event emetting
        context.swap();
    }
}
