import { Injectable } from '@angular/core';
import { ClientSocketService } from './client-socket.service';
import { GameSettingsService } from './game-settings.service';

@Injectable({
    providedIn: 'root',
})
export class SendMessageService {
    message: string = '';
    typeMessage: string = '';
    private displayMessage: () => void;

    constructor(private clientSocketService: ClientSocketService, private gameSettingsService: GameSettingsService) {
        this.receiveMessageFromOpponent();
    }

    // displayMessage() will call the method from chatBoxComponent to display the message
    displayBound(fn: () => void) {
        this.displayMessage = fn;
    }

    displayMessageByType(message: string, typeMessage: string) {
        this.message = message;
        this.typeMessage = typeMessage;
        // TODO Switch case by command
        if (this.typeMessage === 'player') {
            this.sendMessageToOpponent(this.message, this.gameSettingsService.gameSettings.playersName[0]);
        }
        this.displayMessage();
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
        this.message = opponentMessage;
        this.displayMessage();
    }
}
