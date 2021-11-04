import { Injectable } from '@angular/core';
import { TypeMessage } from '@app/classes/enum';

@Injectable({
    providedIn: 'root',
})
export class SendMessageService {
    message: string = '';
    typeMessage: TypeMessage;
    private displayMessage: () => void;

    // displayMessage() will call the method from chatBoxComponent to display the message
    displayBound(fn: () => void) {
        this.displayMessage = fn;
    }

    displayMessageByType(message: string, typeMessage: TypeMessage) {
        this.message = message;
        this.typeMessage = typeMessage;
        this.displayMessage();
    }
}
