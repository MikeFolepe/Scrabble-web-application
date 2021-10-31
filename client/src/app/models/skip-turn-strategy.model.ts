/* eslint-disable sort-imports */
import { PlayerAIService } from '@app/services/player-ia.service';
import { PlayStrategy } from './abstract-strategy.model';
export class SkipTurn extends PlayStrategy {
    execute(playerAiService: PlayerAIService): void {
        console.log('tour passé');
        setTimeout(() => {
            playerAiService.skipTurnService.switchTurn();
        }, 5000);
    }
}
