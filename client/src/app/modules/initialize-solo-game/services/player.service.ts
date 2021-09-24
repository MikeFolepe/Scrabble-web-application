export interface Player {
    id: number;
    nom: string;
    score: number;
    isTour: boolean;
    state: string;
}

export class PlayerService {
    player: Player;

    initializeName(playerName: string) {
        this.player.nom = playerName;
    }
}
