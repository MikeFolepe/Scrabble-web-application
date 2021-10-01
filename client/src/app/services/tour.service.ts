import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TourService {
    tourSubject = new BehaviorSubject<boolean>(false);
    private isTurn: boolean;

    emitTurn() {
        this.tourSubject.next(this.isTurn);
    }

    initializeTurn(isTour: boolean) {
        this.isTurn = isTour;
        this.emitTurn();
    }

    getTurn(): boolean {
        return this.isTurn;
    }
}
