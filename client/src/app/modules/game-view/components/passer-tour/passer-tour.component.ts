import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TourService } from '@app/services/tour.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-passer-tour',
    templateUrl: './passer-tour.component.html',
    styleUrls: ['./passer-tour.component.scss'],
})
export class PasserTourComponent implements OnInit {
    @Output() checkTour: EventEmitter<boolean> = new EventEmitter();

    tour: boolean;
    tourSubscription: Subscription = new Subscription();
    constructor(private tourService: TourService) {}
    ngOnInit(): void {
        // Fais rien;
        this.tourSubscription = this.tourService.tourSubject.subscribe((tourSubject: boolean) => {
            this.tour = tourSubject;
        });
        this.tourService.emitTour();
    }

    toogleTour(): void {
        this.checkTour.emit(this.tour);
    }
}
