import { ChatboxService } from '@app/services/chatbox.service';
import { TourService } from '@app/services/tour.service';
import { Subscription } from 'rxjs';
import { BoardHandlerService } from '@app/services/board-handler.service';
import { AfterViewInit, HostListener, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { INDEX_PLAYER_AI, INDEX_REAL_PLAYER, ONESECOND_TIME } from '@app/classes/constants';
import { DebugService } from '@app/services/debug.service';
import { EndGameService } from '@app/services/end-game.service';
import { SendMessageService } from '@app/services/send-message.service';

@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    @ViewChild('chatBox') private chatBox: ElementRef;

    tourSubscription: Subscription = new Subscription();
    tour: boolean;

    typeMessage: string = '';
    message: string = '';

    listMessages: string[] = [];
    listTypes: string[] = [];
    debugMessage: { word: string; nbPt: number }[] = [];

    constructor(
        private chatBoxService: ChatboxService,
        private tourService: TourService,
        public debugService: DebugService,
        private sendMessageService: SendMessageService,
        public endGameService: EndGameService,
        private boardHandlerService: BoardHandlerService,
    ) {}

    // Disable the current placement on the board when a click occurs in the chatbox
    @HostListener('document:mouseup', ['$event'])
    @HostListener('document:contextmenu', ['$event'])
    clickInChatBox(event: MouseEvent) {
        if (this.chatBox.nativeElement.contains(event.target)) {
            this.boardHandlerService.cancelPlacement();
        }
    }

    ngOnInit(): void {
        this.tourSubscription = this.tourService.tourSubject.subscribe((tourSubject: boolean) => {
            this.tour = tourSubject;
        });
        this.tourService.emitTour();
        this.sendMessageService.displayBound(this.displayMessageByType.bind(this));
    }

    handleKeyEvent(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.chatBoxService.sendPlayerMessage(this.message);
            this.message = ''; // Clear input

            this.scrollToBottom();
        }
    }

    passButton() {
        this.message = '!passer';
        this.chatBoxService.sendPlayerMessage(this.message);
        this.message = '';
        this.scrollToBottom();
    }

    displayMessageByType() {
        this.listTypes.push(this.chatBoxService.typeMessage);
        this.listMessages.push(this.chatBoxService.message);
        this.scrollToBottom();
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
        setTimeout(() => {
            // Timeout is used to update the scroll after the last element added
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        }, 1);
    }

    ngAfterViewInit() {
        const findEnd = setInterval(() => {
            this.endGameService.checkEndGame();
            this.chatBoxService.displayFinalMessage(INDEX_REAL_PLAYER);
            this.chatBoxService.displayFinalMessage(INDEX_PLAYER_AI);
            this.endGameService.getFinalScore(INDEX_REAL_PLAYER);
            this.endGameService.getFinalScore(INDEX_PLAYER_AI);
            if (this.endGameService.isEndGame) {
                clearInterval(findEnd);
            }
        }, ONESECOND_TIME);
    }

    ngOnDestroy() {
        this.tourSubscription.unsubscribe();
    }
}
