import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { INDEX_PLAYER_AI, INDEX_REAL_PLAYER, ONE_SECOND_TIME } from '@app/classes/constants';
// import { PlayerService } from '@app/services/player.service';
// import { SkipTurnService } from '@app/services/skip-turn.service';
import { ChatboxService } from '@app/services/chatbox.service';
import { DebugService } from '@app/services/debug.service';
import { EndGameService } from '@app/services/end-game.service';
import { ClientSocketService } from './../../../services/client-socket.service';

@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit, AfterViewInit {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    // turnSubscription: Subscription = new Subscription();
    // turn: boolean;

    typeMessage: string = '';
    message: string = '';

    listMessages: string[] = [];
    listTypes: string[] = [];
    debugMessage: { word: string; nbPt: number }[] = [];
    // Table to stock debug message from IA test avec des strings aléatoires

    constructor(
        private chatBoxService: ChatboxService,
        public debugService: DebugService,
        public endGameService: EndGameService,
        private clientSocketService: ClientSocketService,
    ) {}

    ngOnInit(): void {
        this.chatBoxService.bindDisplay(this.displayAnyMessageByType.bind(this));
        this.clientSocketService.socket.on('receiveRoomMessage', (message: string) => {
            console.log(message);
            setTimeout(() => {
                this.sendOpponentMessage(message);
            }, 500);
        });
    }

    handleKeyEvent(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.chatBoxService.sendPlayerMessage(this.message);
            this.clientSocketService.socket.emit('sendRoomMessage', this.message, this.clientSocketService.roomId);
            this.message = ''; // Clear l'input

            setTimeout(() => {
                // Timeout is used to update the scroll after the last element added
                this.scrollToBottom();
            }, 1);
        }
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
