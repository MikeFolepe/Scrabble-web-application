import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TourService {
    tourSubject = new BehaviorSubject<boolean>(false);
    private isTour: boolean;
    emitTurn() {
        this.tourSubject.next(this.isTour);
    }

    initializeTurn(isTour: boolean) {
        this.isTour = isTour;
        this.emitTurn();
    }

    isTurn(): boolean {
        return this.isTour;
    }
}
