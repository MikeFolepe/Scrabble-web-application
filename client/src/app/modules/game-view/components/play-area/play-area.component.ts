import { Component, OnInit, OnDestroy } from '@angular/core';
import { EndGameService } from '@app/services/end-game.service';
import { ChatboxService } from '@app/services/chatbox.service';
import { Subscription } from 'rxjs';
import { TourService } from '@app/services/tour.service';

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements OnInit, OnDestroy {
    turnSubscription: Subscription = new Subscription();
    turn: boolean;

    constructor(public endGameService: EndGameService, private chatBoxService: ChatboxService, private turnService: TourService) {}

    ngOnInit(): void {
        this.turnSubscription = this.turnService.tourSubject.subscribe((tourSubject: boolean) => {
            this.turn = tourSubject;
        });
        this.turnService.emitTour();
    }

    passButton() {
        this.chatBoxService.sendPlayerMessage('!passer');
    }

    ngOnDestroy() {
        this.turnSubscription.unsubscribe();
    }
}
