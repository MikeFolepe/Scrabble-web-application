import { Component, OnDestroy, OnInit } from '@angular/core';
import { PassTourService } from '@app/services/pass-tour.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-pass-tour',
    templateUrl: './pass-tour.component.html',
    styleUrls: ['./pass-tour.component.scss'],
})
export class PassTourComponent implements OnInit, OnDestroy {
    message: string;
    passSubscription: Subscription = new Subscription();

    constructor(private passTourService: PassTourService) {}
    ngOnInit(): void {
        this.passSubscription = this.passTourService.currentMessage.subscribe((message) => (this.message = message));
    }

    toggleTour(): void {
        this.passTourService.writeMessage('!passer');
    }
    ngOnDestroy() {
        this.passSubscription.unsubscribe();
    }
}
