import { Component, OnDestroy, OnInit } from '@angular/core';
import { PassTurnService } from '@app/services/pass-turn.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-pass-turn',
    templateUrl: './pass-turn.component.html',
    styleUrls: ['./pass-turn.component.scss'],
})
export class PassTurnComponent implements OnInit, OnDestroy {
    message: string;
    passSubscription: Subscription = new Subscription();

    constructor(private passTurnService: PassTurnService) {}
    ngOnInit(): void {
        this.passSubscription = this.passTurnService.currentMessage.subscribe((message) => (this.message = message));
    }

    toggleTurn(): void {
        this.passTurnService.writeMessage('!passer');
    }
    ngOnDestroy() {
        this.passSubscription.unsubscribe();
    }
}
