import { Component, OnDestroy, OnInit } from '@angular/core';
import { PassTourService } from '@app/services/pass-turn.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-pass-turn',
    templateUrl: './pass-turn.component.html',
    styleUrls: ['./pass-turn.component.scss'],
})
export class PassTurnComponent implements OnInit, OnDestroy {
    message: string;
    passSubscription: Subscription = new Subscription();

    constructor(private passTourService: PassTourService) {}
    ngOnInit(): void {
        this.passSubscription = this.passTourService.currentMessage.subscribe((message) => (this.message = message));
    }

    toggleTurn(): void {
        this.passTourService.writeMessage('!passer');
    }
    ngOnDestroy() {
        this.passSubscription.unsubscribe();
    }
}
