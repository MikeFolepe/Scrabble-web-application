import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TourService {
    tourSubject = new BehaviorSubject<boolean>(false);
    private tour: boolean;

    emitTour() {
        this.tourSubject.next(this.tour);
    }

    initializeTour(tour: boolean) {
        this.tour = tour;
        this.emitTour();
    }

    getTour(): boolean {
        return this.tour;
    }
}
