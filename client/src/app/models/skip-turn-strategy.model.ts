import { PlayStrategy } from './abstract-strategy.model';
import { PlayerIA } from './player-ia.model';
export class SkipTurn extends PlayStrategy {
    execute(player: PlayerIA): void {
        // do nothing
        // TODO: warn context that the ia skipped his turn
    }
}
