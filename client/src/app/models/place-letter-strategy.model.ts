import { PlayStrategy } from './abstract-strategy.model';
import { PlayerIA } from './player-ia.model';
export abstract class PlaceLetters extends PlayStrategy {
    abstract execute(player: PlayerIA): void;
}
