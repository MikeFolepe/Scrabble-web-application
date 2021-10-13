// import { PlayerService } from '@app/services/player.service';
// import { SkipTurnService } from '@app/services/skip-turn.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatboxService } from '@app/services/chatbox.service';
import { DebugService } from '@app/services/debug.service';

@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    // turnSubscription: Subscription = new Subscription();
    // turn: boolean;

    typeMessage: string = '';
    message: string = '';

    listMessages: string[] = [];
    listTypes: string[] = [];
    debugMessage: { word: string; nbPt: number }[] = [];
    // Table to stock debug message from IA test avec des strings aléatoires

    constructor(private chatBoxService: ChatboxService, public debugService: DebugService) {}

    ngOnInit(): void {
        //     this.tourSubscription = this.tourService.tourSubject.subscribe((tourSubject: boolean) => {
        //         this.tour = tourSubject;
        //     });
        //     this.tourService.emitTour();
        this.chatBoxService.bindDisplay(this.displayAnyMessageByType.bind(this));
    }

    handleKeyEvent(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.chatBoxService.sendPlayerMessage(this.message);
            this.message = ''; // Clear l'input

            setTimeout(() => {
                // Timeout is used to update the scroll after the last element added
                this.scrollToBottom();
            }, 1);
        }
    }

    // passButton() {
    //     this.message = '!passer';
    //     this.chatBoxService.sendPlayerMessage(this.message);
    //     this.message = '';
    // }

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
}
