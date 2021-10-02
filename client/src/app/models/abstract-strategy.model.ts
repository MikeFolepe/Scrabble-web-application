import { PlayerAIComponent } from '@app/modules/game-view/components/player-ia/player-ia.component';
import { PlayerIA } from './player-ia.model';
export abstract class PlayStrategy {
    abstract execute(player: PlayerIA, context: PlayerAIComponent): void;
}
