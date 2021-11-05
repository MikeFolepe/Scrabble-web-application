import { Injectable } from '@angular/core';
import { TypeMessage } from '@app/classes/enum';
import { ClientSocketService } from './client-socket.service';
import { GameSettingsService } from './game-settings.service';

@Injectable({
    providedIn: 'root',
})
export class SendMessageService {
    message: string = '';
    typeMessage: TypeMessage;
    private displayMessage: () => void;

    constructor(private clientSocketService: ClientSocketService, private gameSettingsService: GameSettingsService) {
        this.receiveMessageFromOpponent();
    }

    // displayMessage() will call the method from chatBoxComponent to display the message
    displayBound(fn: () => void) {
        this.displayMessage = fn;
    }

    displayMessageByType(message: string, typeMessage: TypeMessage) {
        this.message = message;
        this.typeMessage = typeMessage;
        if (this.typeMessage === TypeMessage.Player) {
            this.sendMessageToOpponent(this.message, this.gameSettingsService.gameSettings.playersName[0]);
        }
        this.displayMessage();
    }

    sendMessageToOpponent(message: string, myName: string) {
        this.clientSocketService.socket.emit('sendRoomMessage', 'Message de ' + myName + ' : ' + message, this.clientSocketService.roomId);
    }

    sendOpponentMessage(opponentMessage: string) {
        this.typeMessage = TypeMessage.Opponent;
        this.message = opponentMessage;
        this.displayMessage();
    }

    receiveMessageFromOpponent() {
        this.clientSocketService.socket.on('receiveRoomMessage', (message: string) => {
            this.sendOpponentMessage(message);
        });
    }
}
