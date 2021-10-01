/* eslint-disable no-invalid-this */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class PassTourService {
    //Method to update
    messageSource = new BehaviorSubject('default message');
    currentMessage = this.messageSource.asObservable();
    tour: boolean;
    updateFunc: () => void;
    updateTour(fn: () => void) {
        this.updateFunc = fn;
        // from now on, call func wherever you want inside this service
    }

    writeMessage(message: string) {
        this.messageSource.next(message);
        this.updateFunc();
    }
}
