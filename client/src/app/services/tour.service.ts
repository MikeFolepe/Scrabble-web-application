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

    initializeTurn(isTurn: boolean) {
        this.isTurn = isTurn;
        this.emitTurn();
    }

    getTurn(): boolean {
        return this.isTurn;
    }
}
