import { Component, ElementRef, ViewChild } from '@angular/core';
import { PlaceLetterComponent } from '../place-letter/place-letter.component';

@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent {

    @ViewChild(PlaceLetterComponent) placeComponent: PlaceLetterComponent; // Constructeur de PlaceLetterComponent, donc fill la map
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    message: string = '';
    typeMessage: string = '';
    command: string = '';

    listMessages: string[] = [];
    listTypes: string[] = [];

    keyEvent(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.sendSystemMessage('Message du système');
            this.sendOpponentMessage('Le joueur virtuel fait...');
            this.sendPlayerCommand();

            this.message = ''; // Clear l'input
            setTimeout(() => {
                // Le timeout permet de scroll jusqu'au dernier élément ajouté
                this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
            }, 1);
        }
    }

    sendPlayerCommand() {
        if (this.isValid()) {
            this.typeMessage = 'player';
            this.listTypes.push(this.typeMessage);
        } else {
            this.typeMessage = 'error';
            this.listTypes.push(this.typeMessage);
        }
        // Call les fonctions respectives aux commandes

        switch (this.command) {
            case 'debug': {

                break;
            }
            case 'passer': {

                break;
            }
            case 'echanger': {

                break;
            }
            case 'placer': {
                let messageSplitted = this.message.split(/\s/);

                let positionSplitted = messageSplitted[1].split(/([0-9]+)/);

                let positionX = Number(positionSplitted[1]) - 1;             // String contenant le nombre de la position en x
                let positionY = positionSplitted[0].charCodeAt(0) - 97;      // String contenant la lettre représentant la position en y
                let orientation = positionSplitted[2];

                this.placeComponent.place(positionX, positionY, orientation, messageSplitted[2]);
                break;
            }
            default: {
                break;
            }
        }

        this.listMessages.push(this.message); // Add le message et update l'affichage de la chatbox
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

    // TODO VALIDATION
    isValid(): boolean {
        // Check les erreurs ici (syntaxe, invalide, impossible à exécuter)

        if (this.message[0] === '!') {
            // Si c'est une commande, on valide la syntaxe
            return this.isSyntaxValid() && this.isInputValid() && this.isPossible();
        }
        return true;
    }

    isSyntaxValid(): boolean {
        const regexDebug = /^!debug$/g;
        const regexPasser = /^!passer$/g;
        const regexEchanger = /^!échanger/g;
        const regexPlacer = /^!placer/g;

        if (regexDebug.test(this.message) || regexPasser.test(this.message) || regexEchanger.test(this.message) || regexPlacer.test(this.message)) {
            return true;
        }

        this.message = 'Erreur : La syntaxe est invalide';
        return false;
    }

    isInputValid(): boolean {
        const regexDebug = /^!debug$/g;
        const regexPasser = /^!passer$/g;
        const regexEchanger = /^!échanger\s([a-z]|[*]){1,7}$/g;
        const regexPlacer = /^!placer\s([a-o]([1-9]|1[0-5])[hv])\s([a-zA-Z]|[*])+/g;

        let valid = true;

        if (regexDebug.test(this.message)) {
            this.command = 'debug';
        } else if (regexPasser.test(this.message)) {
            this.command = 'passer';
        } else if (regexEchanger.test(this.message)) {
            this.command = 'echanger';
        } else if (regexPlacer.test(this.message)) {
            this.command = 'placer';
        } else {
            valid = false;
            this.message = "Erreur : L'entrée est invalide";
        }
        return valid;
    }

    isPossible(): boolean {
        return true;
    }

    scrollToBottom(): void {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }
}
