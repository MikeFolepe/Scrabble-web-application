import { PlayStrategy } from './abstract-strategy.model';
import { PlayerIA } from './player-ia.model';
export class SwapLetter extends PlayStrategy {
    execute(player: PlayerIA): void {
        // REQUIS: Pour l’échange de lettres, le JV choisit une ou plusieurs lettres aléatoirement
        // parmi celles que contient son chevalet puis les échange.
        // Advenant le cas où la réserve ne compte pas suffisamment de lettres pour faire l’échange voulu,
        // le joueur virtuel passe plutôt son tour
        // TODO: Avoir acces aux methodes getRandomLetters() et isEmpty() du service reserve
        // solution : injection.
    }
}
