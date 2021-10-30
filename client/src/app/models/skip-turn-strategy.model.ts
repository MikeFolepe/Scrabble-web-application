/* eslint-disable sort-imports */
import { PlayerAIService } from '@app/services/player-ia.service';
import { PlayStrategy } from './abstract-strategy.model';
export class SkipTurn extends PlayStrategy {
    execute(playerAiService: PlayerAIService): void {
        playerAiService.skipTurnService.switchTurn();
        console.log('tour passé');
    }
}
