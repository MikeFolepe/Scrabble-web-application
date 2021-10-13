import { PlayerAIComponent } from '@app/modules/game-view/components/player-ai/player-ai.component';
import { PlayStrategy } from './abstract-strategy.model';
import { PlayerAI } from './player-ai.model';
export class SkipTurn extends PlayStrategy {
    execute(player: PlayerAI, context: PlayerAIComponent): void {
        // PlayerAIComponent will lunch a event that AI skipped
        context.skip();
    }
}
