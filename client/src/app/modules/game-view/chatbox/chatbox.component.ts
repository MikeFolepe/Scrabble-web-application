import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { INDEX_PLAYER_AI, INDEX_REAL_PLAYER, ONE_SECOND_TIME } from '@app/classes/constants';
import { BoardHandlerService } from '@app/services/board-handler.service';
import { ChatboxService } from '@app/services/chatbox.service';
import { DebugService } from '@app/services/debug.service';
import { EndGameService } from '@app/services/end-game.service';
import { SendMessageService } from '@app/services/send-message.service';
import { GameSettingsService } from '@app/services/game-settings.service';
import { ClientSocketService } from './../../../services/client-socket.service';

@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit, AfterViewInit {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    typeMessage: string = '';
    message: string = '';

    listMessages: string[] = [];
    listTypes: string[] = [];
    debugMessage: { word: string; nbPt: number }[] = [];
    // Table to stock debug message from IA test avec des strings aléatoires

    constructor(
        private chatBoxService: ChatboxService,
        public debugService: DebugService,
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
            this.message = ''; // Clear input

            this.scrollToBottom();
        }
    }

    displayMessageByType() {
        this.listTypes.push(this.sendMessageService.typeMessage);
        this.listMessages.push(this.sendMessageService.message);
        this.scrollToBottom();
    }

    sendSystemMessage(systemMessage: string) {
        this.typeMessage = 'system';
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
        }, ONE_SECOND_TIME);
    }
}
