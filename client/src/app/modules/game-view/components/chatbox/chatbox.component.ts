
import { Vec2 } from '@app/classes/vec2';
import { PlaceLetterComponent } from '../place-letter/place-letter.component';
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
    @ViewChild(PlaceLetterComponent) placeComponent: PlaceLetterComponent;
    @ViewChild(PassTourComponent) passer: PassTourComponent;
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    tourSubscription: Subscription = new Subscription();
    tour: boolean;
    message: string = '';
    typeMessage: string = '';
    command: string = '';

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
            // Si valide, call les fonctions respectives aux commandes
            switch (this.command) {
                case 'debug': {

                    break;
                }
                case 'passer': {
                    
                    this.switchTour();
                    break;
                }
                case 'echanger': {

                    break;
                }
                case 'placer': {
                    let messageSplitted = this.message.split(/\s/);

                    let positionSplitted = messageSplitted[1].split(/([0-9]+)/);

                    // Vecteur contenant la position de départ du mot qu'on veut placer
                    let position: Vec2 = {
                        x: Number(positionSplitted[1]) - 1,
                        y: positionSplitted[0].charCodeAt(0) - 97
                    };
                    let orientation = positionSplitted[2];

                    if (this.placeComponent.place(position, orientation, messageSplitted[2]) === false) {
                        this.typeMessage = 'error';
                        this.message = "ERREUR : La commande est impossible à réaliser";
                    }
                    break;
                }
                default: {
                    break;
                }
            }
        }
        else {   // Si invalide -> erreur
            this.typeMessage = 'error';
        }
        this.command = '';
        this.listTypes.push(this.typeMessage);
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

    isValid(): boolean {
        // Check les erreurs ici (syntaxe, invalide)

        if (this.message[0] === '!') {
            // Si c'est une commande, on la valide
            return this.isInputValid() && this.isSyntaxValid();
        }
        return true;
    }

    isInputValid(): boolean {
        const regexDebug = /^!debug/g;
        const regexPasser = /^!passer/g;
        const regexEchanger = /^!échanger/g;
        const regexPlacer = /^!placer/g;

        if (regexDebug.test(this.message) || regexPasser.test(this.message) || regexEchanger.test(this.message) || regexPlacer.test(this.message)) {
            return true;
        }

        this.message = "ERREUR : L'entrée est invalide";
        return false;
    }

    isSyntaxValid(): boolean {
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
            this.message = "ERREUR : La syntaxe est invalide";
        }
        return valid;
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
