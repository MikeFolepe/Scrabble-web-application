import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SendMessageService {
    message: string = '';
    typeMessage: string = '';
    private displayMessage: () => void;

    // displayMessage() will call the method from chatBoxComponent to display the message
    displayBinded(fn: () => void) {
        this.displayMessage = fn;
    }

    displayMessageByType(message: string, typeMessage: string) {
        this.message = message;
        this.typeMessage = typeMessage;
        this.displayMessage();
    }
}
