import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GameSettings } from '@app/classes/game-settings';
import { Player } from '@app/models/player.model';
import { PasserTourComponent } from '@app/modules/game-view/components/passer-tour/passer-tour.component';

// import { GameSettingsService } from '@app/services/game-settings.service';
// import { TourService } from '@app/services/tour.service';

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
    @ViewChild(PasserTourComponent) passer: PasserTourComponent;

    @Output()
    checkTime: EventEmitter<number> = new EventEmitter();
    players: Player[] = new Array<Player>();
    gameSettings: GameSettings;
    tour: boolean;
    minuteTemp: number;
    secondeTemp: number;

    // Temporals  Values  for  contents the cast of string to number for timer

    ngOnInit(): void {
        this.setTimer();
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
        }, 1000);
    }

    stopTimer(tour: boolean): void {
        this.tour = tour;
        this.secondeTemp = 0;
        this.minuteTemp = 0;
        this.checkTime.emit(this.secondeTemp);
    }
}
