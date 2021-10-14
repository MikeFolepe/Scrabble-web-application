import { PlayerAIComponent } from '@app/modules/game-view/components/player-ai/player-ai.component';
import { PlayerAI } from './player-ai.model';
export abstract class PlayStrategy {
    abstract execute(player: PlayerAI, context: PlayerAIComponent): void;
}
