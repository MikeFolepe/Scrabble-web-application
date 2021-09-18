export interface Player {
    id: number;
    nom: string;
    score: number;
    isTour: boolean;
    state: string;
}

export class PlayerService {
    player: Player;
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor() {
        // do nothing
        this.player.id++;
    }

    initializeName(playerName: string) {
        this.player.nom = playerName;
    }
}
