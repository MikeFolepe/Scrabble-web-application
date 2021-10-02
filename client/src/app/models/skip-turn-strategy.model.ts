import { PlayerAIComponent } from '@app/modules/game-view/components/player-ia/player-ia.component';
import { PlayStrategy } from './abstract-strategy.model';
import { PlayerIA } from './player-ia.model';
export class SkipTurn extends PlayStrategy {
    execute(player: PlayerIA, context: PlayerAIComponent): void {
        // PlayerIAComponent will lunch a event that IA skipped
        context.skip();
    }
}
