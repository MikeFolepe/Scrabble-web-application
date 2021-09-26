import { PlayerIAComponent } from '@app/modules/game-view/components/player-ia/player-ia.component';
import dictionaryData from '../../assets/dictionnary.json';
import { PlayStrategy } from './abstract-strategy.model';
import { PlayerIA } from './player-ia.model';
export abstract class PlaceLetters extends PlayStrategy {
    protected dictionnary: string[] = JSON.parse(JSON.stringify(dictionaryData)).words;
    abstract execute(player: PlayerIA, context: PlayerIAComponent): void;
}
