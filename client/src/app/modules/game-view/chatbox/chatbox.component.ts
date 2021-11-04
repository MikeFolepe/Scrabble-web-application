import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { BoardHandlerService } from '@app/services/board-handler.service';
import { ChatboxService } from '@app/services/chatbox.service';
import { ClientSocketService } from '@app/services/client-socket.service';
import { EndGameService } from '@app/services/end-game.service';
import { GameSettingsService } from '@app/services/game-settings.service';
// eslint-disable-next-line sort-imports
import { INDEX_PLAYER_AI, INDEX_REAL_PLAYER, ONE_SECOND_DELAY } from '@app/classes/constants';
import { SendMessageService } from '@app/services/send-message.service';
import { TypeMessage } from '@app/classes/enum';

@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit, AfterViewInit {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    message: string = '';
    listMessages: string[] = [];
    listTypes: TypeMessage[] = [];

    // Used to access TypeMessage enum in the HTML
    htmlTypeMessage = TypeMessage;

    private typeMessage: TypeMessage;

    constructor(
        private chatBoxService: ChatboxService,
        private sendMessageService: SendMessageService,
        public endGameService: EndGameService,
        private boardHandlerService: BoardHandlerService,
        private clientSocketService: ClientSocketService,
        private gameSettingsService: GameSettingsService,
    ) {}

    // Disable the current placement on the board when a click occurs in the chatbox
    @HostListener('mouseup', ['$event'])
    @HostListener('contextmenu', ['$event'])
    clickInChatBox() {
        this.boardHandlerService.cancelPlacement();
    }

    ngOnInit(): void {
        this.sendMessageService.displayBound(this.displayMessageByType.bind(this));
        this.receiveMessageFromOpponent();
    }

    handleKeyEvent(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.chatBoxService.sendPlayerMessage(this.message);
            this.sendMessageToOpponent(this.message, this.gameSettingsService.gameSettings.playersName[0]);
            // Clear input
            this.message = '';

            this.scrollToBottom();
        }
    }

    displayMessageByType() {
        this.listTypes.push(this.sendMessageService.typeMessage);
        this.listMessages.push(this.sendMessageService.message);
        this.scrollToBottom();
    }

    sendSystemMessage(systemMessage: string) {
        this.typeMessage = TypeMessage.System;
        this.listTypes.push(this.typeMessage);
        this.listMessages.push(systemMessage);
    }

    sendMessageToOpponent(message: string, myName: string) {
        this.clientSocketService.socket.emit('sendRoomMessage', 'Message de ' + myName + ' : ' + message, this.clientSocketService.roomId);
    }

    receiveMessageFromOpponent() {
        this.clientSocketService.socket.on('receiveRoomMessage', (message: string) => {
            this.sendOpponentMessage(message);
        });
    }

    sendOpponentMessage(opponentMessage: string) {
        this.typeMessage = TypeMessage.Opponent;
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
        }, ONE_SECOND_DELAY);
    }
}
