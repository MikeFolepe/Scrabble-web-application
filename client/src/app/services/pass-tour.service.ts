/* eslint-disable no-invalid-this */
import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
import { TourService } from './tour.service';

@Injectable({
    providedIn: 'root',
})
export class PassTourService {
    // Method to update
    // messageSource = new BehaviorSubject('default message');
    // currentMessage = this.messageSource.asObservable();
    tour: boolean;
    updateFunc: () => void;
    constructor(private tourService: TourService) {}
    updateTour(fn: () => void) {
        this.updateFunc = fn;
        // from now on, call func wherever you want inside this service
    }

    switchTour(tour: boolean): void {
        if (tour === false) {
            this.tour = true;
            this.tourService.initializeTour(this.tour);
            this.updateFunc();
        } else if (tour === true) {
            this.tour = false;
            this.tourService.initializeTour(this.tour);
            this.updateFunc();
        }
    }
}
