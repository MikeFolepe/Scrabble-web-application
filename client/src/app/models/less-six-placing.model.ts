import { PlayerIAComponent } from '@app/modules/game-view/components/player-ia/player-ia.component';
import { PlaceLetters } from './place-letter-strategy.model';
import { PlayerIA } from './player-ia.model';

export class LessSix extends PlaceLetters {
    // Matrice de jeu (Etienne)

    execute(player: PlayerIA, context: PlayerIAComponent): void {
        // Pointing value [0, 6[
        // const MAX_POINTING = 6;
        // let randomPointing = new Date().getTime() % MAX_POINTING;
        // randomPointing++;
        // Step1: Pour chaque mot dans la matrice vérifier comment on peut rajouter des mots pour
        // faire de nouvelles lettres (ex: mer;amer) et verfier si le nombre de point qu'il rapporte
        // est egale au pointage visé de ce tour ET que c'est un placement valide (Etienne)
        // Step2: Si c'est bon on lance un évenement disant que le joueur a placer sinon on skippe le tour
    }
}
