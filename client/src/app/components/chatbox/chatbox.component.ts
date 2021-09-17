import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent {
    // https://stackoverflow.com/questions/35232731/angular-2-scroll-to-bottom-chat-style

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    message: string = '';
    type: string = '';
    listMessages: string[] = [];
    listTypes: string[] = [];

    constructor() {}

    keyEvent(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.sendSystemMessage('Message du système');
            this.sendOpponentMessage('Le joueur virtuel fait...');
            this.sendPlayerCommand();
            console.log(this.listMessages);
            console.log(this.listTypes);
            this.message = ''; // Clear l'input
            this.scrollToBottom();
        }
    }

    sendPlayerCommand() {
        if (this.validate()) {
            this.type = 'player';
            this.listTypes.push(this.type);
        } else {
            this.type = 'error';
            this.listTypes.push(this.type);
        }
        this.listMessages.push(this.message); // Add le message et update l'affichage de la chatbox
    }

    sendSystemMessage(systemMessage: string) {
        this.type = 'system';
        this.listTypes.push(this.type);
        this.listMessages.push(systemMessage);
    }

    sendOpponentMessage(opponentMessage: string) {
        this.type = 'opponent';
        this.listTypes.push(this.type);
        this.listMessages.push(opponentMessage);
    }

    // TODO VALIDATION
    validate(): boolean {
        // Check les erreurs ici (syntaxe, invalide, impossible à exécuter)
        return true;
    }

    scrollToBottom(): void {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }
}
