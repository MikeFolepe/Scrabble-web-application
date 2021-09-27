import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PassTourComponent } from '@app/modules/game-view/components/pass-tour/pass-tour.component';
import { TourService } from '@app/services/tour.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit, OnDestroy {
    // https://stackoverflow.com/questions/35232731/angular-2-scroll-to-bottom-chat-style
    @ViewChild(PassTourComponent) passer: PassTourComponent;
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    tourSubscription: Subscription = new Subscription();
    tour: boolean;
    message: string = '';
    // subscription: Subscription;
    type: string = '';
    listMessages: string[] = [];
    listTypes: string[] = [];

    constructor(private tourService: TourService) {}

    ngOnInit(): void {
        this.tourSubscription = this.tourService.tourSubject.subscribe((tourSubject: boolean) => {
            this.tour = tourSubject;
        });
        this.tourService.emitTour();
    }
    keyEvent(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.sendSystemMessage('Message du système');
            this.sendOpponentMessage('Le joueur virtuel fait...');
            this.sendPlayerCommand();
            // Check the entry if equals at the command !passer and switch the tour
            if (this.message === '!passer') {
                this.switchTour();
            }
            this.message = ''; // Clear l'input
            setTimeout(() => {
                // Le timeout permet de scroll jusqu'au dernier élément ajouté
                this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
            }, 1);
        }
    }

    sendPlayerCommand() {
        if (this.isValid()) {
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
        const regexPlacer = /^!placer\s[a-o]([1-9]|1[0-5])\s[hv]\s[a-zA-Z]+/g;

        if (regexDebug.test(this.message) || regexPasser.test(this.message) || regexPlacer.test(this.message) || regexEchanger.test(this.message)) {
            return true;
        }
        this.message = "Erreur : L'entrée est invalide";
        return false;
    }
    isPossible(): boolean {
        return true;
    }

    scrollToBottom(): void {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }

    switchTour() {
        this.tourSubscription = this.tourService.tourSubject.subscribe((tourSubject: boolean) => {
            this.tour = tourSubject;
        });
        this.tourService.emitTour();
        if (this.tour === true) {
            this.passer.toogleTour();
        } else {
            this.sendSystemMessage('vous ne pouvez pas effectuer cette commande, attendez votre tour');
        }
    }
    ngOnDestroy() {
        this.tourSubscription.unsubscribe();
    }
}
