import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ONESECOND_TIME } from '@app/classes/constants';
import { PassTourService } from '@app/services/pass-tour.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-countdown',
    templateUrl: './countdown.component.html',
    styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent implements OnInit, OnDestroy {
    // Decorator pour les inputs
    @Input() seconds: string;
    @Input() minutes: string;

    @Output()
    checkTime: EventEmitter<number> = new EventEmitter();
    // Values  that will contain the time casted in number
    minutesInt: number;
    secondsInt: number;
    message: string;
    passSubscription: Subscription = new Subscription();
    constructor(private passTourService: PassTourService) {}

    ngOnInit(): void {
        setTimeout(() => {
            this.setTimer();
        }, ONESECOND_TIME);
        this.passSubscription = this.passTourService.currentMessage.subscribe((message) => (this.message = message));
        this.passTourService.updateTour(this.stopTimer.bind(this));
    }

    // Set time always after a define interval of 1second and repeat it
    setTimer(): void {
        this.minutesInt = parseInt(this.minutes, 10);
        this.secondsInt = parseInt(this.seconds, 10);
        const intervalID = setInterval(() => {
            if (this.secondsInt === 0 && this.minutesInt !== 0) {
                this.minutesInt = this.minutesInt - 1;
                this.secondsInt = 59;
            } else if (this.secondsInt === 0 && this.minutesInt === 0) {
                this.checkTime.emit(this.secondsInt);
                clearInterval(intervalID);
            } else {
                this.secondsInt -= 1;
            }
        }, ONESECOND_TIME);
    }

    stopTimer(): void {
        if (this.message === '!passer') {
            this.secondsInt = 0;
            this.minutesInt = 0;
            this.checkTime.emit(this.secondsInt);
        }
    }

    ngOnDestroy(): void {
        this.passSubscription.unsubscribe();
    }
}
