import { PlayStrategy } from '@app/models/abstract-strategy.model';
import { PlayerAI } from '@app/models/player-ai.model';
import { PlayerAIComponent } from '@app/modules/game-view/player-ai/player-ai.component';

export class SkipTurn extends PlayStrategy {
    execute(player: PlayerAI, context: PlayerAIComponent): void {
        // PlayerAIComponent will lunch a event that AI skipped
        context.skip();
    }
}
