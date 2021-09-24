import { Injectable } from '@angular/core';
import { Player } from '@app/models/player.model';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    playerSubject = new Subject<Player[]>();
    private players: Player[] = new Array<Player>();
    emitPlayers() {
        this.playerSubject.next(this.players.slice());
    }

    addPlayer(user: Player) {
        this.players.push(user);
        this.emitPlayers();
    }
}
