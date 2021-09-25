import { PlayerIA } from './player-ia.model';
export abstract class PlayStrategy {
    abstract execute(player: PlayerIA): void;
}
