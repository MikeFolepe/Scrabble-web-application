import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { INDEX_PLAYER_ONE, INDEX_PLAYER_TWO, ONE_SECOND_DELAY } from '@app/classes/constants';
import { TypeMessage } from '@app/classes/enum';
import { BoardHandlerService } from '@app/services/board-handler.service';
import { ChatboxService } from '@app/services/chatbox.service';
import { EndGameService } from '@app/services/end-game.service';
import { SendMessageService } from '@app/services/send-message.service';
import { SkipTurnService } from '@app/services/skip-turn.service';

@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit, AfterViewInit {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    message: string;
    listMessages: string[];
    listTypes: TypeMessage[];

    // Used to access TypeMessage enum in the HTML
    htmlTypeMessage = TypeMessage;

    private typeMessage: TypeMessage;

    constructor(
        private chatBoxService: ChatboxService,
        private sendMessageService: SendMessageService,
        public endGameService: EndGameService,
        private boardHandlerService: BoardHandlerService,
        private skipTurnService: SkipTurnService,
    ) {
        this.message = '';
        this.listMessages = [];
        this.listTypes = [];
    }

    // Disable the current placement on the board when a click occurs in the chatbox
    @HostListener('mouseup', ['$event'])
    @HostListener('contextmenu', ['$event'])
    clickInChatBox(): void {
        this.boardHandlerService.cancelPlacement();
    }

    ngOnInit(): void {
        this.sendMessageService.displayBound(this.displayMessageByType.bind(this));
    }

    handleKeyEvent(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.chatBoxService.sendPlayerMessage(this.message);
            this.message = ''; // Clear input

            this.scrollToBottom();
        }
    }

    displayMessageByType(): void {
        this.listTypes.push(this.sendMessageService.typeMessage);
        this.listMessages.push(this.sendMessageService.message);
        this.scrollToBottom();
    }

    sendSystemMessage(systemMessage: string): void {
        this.typeMessage = TypeMessage.System;
        this.listTypes.push(this.typeMessage);
        this.listMessages.push(systemMessage);
    }

    scrollToBottom(): void {
        setTimeout(() => {
            // Timeout is used to update the scroll after the last element added
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        }, 1);
    }

    ngAfterViewInit(): void {
        const findEnd = setInterval(() => {
            this.endGameService.checkEndGame();
            this.chatBoxService.displayFinalMessage(INDEX_PLAYER_ONE);
            this.chatBoxService.displayFinalMessage(INDEX_PLAYER_TWO);
            this.endGameService.getFinalScore(INDEX_PLAYER_ONE);
            this.endGameService.getFinalScore(INDEX_PLAYER_TWO);
            if (this.endGameService.isEndGame) {
                this.skipTurnService.stopTimer();
                clearInterval(findEnd);
            }
        }, ONE_SECOND_DELAY);
    }
}
