import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatboxService } from '@app/services/chatbox.service';
import { TourService } from '@app/services/tour.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit, OnDestroy {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    tourSubscription: Subscription = new Subscription();
    tour: boolean;

    typeMessage: string = '';
    message: string = '';

    listMessages: string[] = [];
    listTypes: string[] = [];
    debugMessage: { word: string; nbPt: number }[] = [];

    constructor(private chatBoxService: ChatboxService, private tourService: TourService) {}

    ngOnInit(): void {
        this.tourSubscription = this.tourService.tourSubject.subscribe((tourSubject: boolean) => {
            this.tour = tourSubject;
        });
        this.tourService.emitTour();
        this.chatBoxService.displayBinded(this.displayAnyMessageByType.bind(this));
    }

    handleKeyEvent(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.chatBoxService.sendPlayerMessage(this.message);
            this.message = ''; // Clear l'input

            setTimeout(() => {
                // Timeout is used to update the scroll after the last element added
                this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
            }, 1);
        }
    }

    passButton() {
        this.message = '!passer';
        this.chatBoxService.sendPlayerMessage(this.message);
        this.message = '';
    }

    displayAnyMessageByType() {
        this.listTypes.push(this.chatBoxService.typeMessage);
        this.listMessages.push(this.chatBoxService.message);
    }

    sendSystemMessage(systemMessage: string) {
        this.typeMessage = 'system';
        this.listTypes.push(this.typeMessage);
        this.listMessages.push(systemMessage);
    }

    sendOpponentMessage(opponentMessage: string) {
        this.typeMessage = 'opponent';
        this.listTypes.push(this.typeMessage);
        this.listMessages.push(opponentMessage);
    }

    scrollToBottom(): void {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }

    ngOnDestroy() {
        this.tourSubscription.unsubscribe();
    }
}
