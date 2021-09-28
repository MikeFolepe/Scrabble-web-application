import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ONESECOND_TIME } from '@app/classes/constants';
import { PassTourService } from '@app/services/pass-tour.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-countdown',
    templateUrl: './countdown.component.html',
    styleUrls: ['./countdown.component.scss'],
    template: '{{countDown|async|formatTime}}',
})
export class CountdownComponent implements OnInit {
    // Decorator pour les inputs
    @Input() seconds: string;
    @Input() minutes: string;

    @Output()
    checkTime: EventEmitter<number> = new EventEmitter();
    // Temporals  Values  for  contents the cast of string to number for timer
    minuteTemp: number;
    secondeTemp: number;
    message: string;
    passSubsciption: Subscription = new Subscription();

    constructor(private passtourService: PassTourService) {}
    ngOnInit(): void {
        setTimeout(() => {
            this.setTimer();
        }, ONESECOND_TIME);
        this.passSubsciption = this.passtourService.currentMessage.subscribe((message) => (this.message = message));
        this.passtourService.updateTour(this.stopTimer.bind(this));
    }

    // Set le time always after a define interval of 1second and repeat it
    setTimer() {
        this.minuteTemp = parseInt(this.minutes, 10);
        this.secondeTemp = parseInt(this.seconds, 10);
        const intervalID = setInterval(() => {
            if (this.secondeTemp - 1 === -1) {
                this.minuteTemp = this.minuteTemp - 1;
                this.secondeTemp = 59;
            } else {
                this.secondeTemp -= 1;
            }
            if (this.secondeTemp === 0 && this.minuteTemp === 0) {
                this.checkTime.emit(this.secondeTemp);
                clearInterval(intervalID);
            }
        }, ONESECOND_TIME);
    }

    stopTimer(): void {
        if (this.message === '!passer') {
            this.secondeTemp = 0;
            this.minuteTemp = 0;
            this.checkTime.emit(this.secondeTemp);
        }
    }
}
