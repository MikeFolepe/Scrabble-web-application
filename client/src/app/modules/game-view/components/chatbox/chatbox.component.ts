import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { INDEX_REAL_PLAYER } from '@app/classes/constants';
import { Vec2 } from '@app/classes/vec2';
import { PassTourComponent } from '@app/modules/game-view/components/pass-tour/pass-tour.component';
// eslint-disable-next-line no-restricted-imports
import { PlaceLetterComponent } from '@app/modules/game-view/components/place-letter/place-letter.component';
import { PlayerService } from '@app/services/player.service';
import { TourService } from '@app/services/tour.service';
import { Subscription } from 'rxjs';
// eslint-disable-next-line no-restricted-imports
import { SwapLetterComponent } from '../swap-letter/swap-letter.component';

@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit, OnDestroy {
    @ViewChild(PassTourComponent) pass: PassTourComponent;
    @ViewChild(PlaceLetterComponent) placeComponent: PlaceLetterComponent;
    @ViewChild(SwapLetterComponent) swapComponent: SwapLetterComponent;
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    tourSubscription: Subscription = new Subscription();
    tour: boolean;

    debugOn: boolean = true;

    typeMessage: string = '';
    message: string = '';
    command: string = '';

    listMessages: string[] = [];
    listTypes: string[] = [];
    debugmessage: { word: string; nbPt: number }[] = [{ word: 'papier', nbPt: 6 }];
    // Table to stock debug message from IA test avec des trings aléatoire

    constructor(private tourService: TourService, private playerService: PlayerService) {}

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
            this.message = ''; // Clear l'input

            setTimeout(() => {
                // Timeout is used to update the scroll after the last element added
                this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
            }, 1);
        }
    }

    sendPlayerCommand() {
        if (this.isValid()) {
            this.typeMessage = 'player';
            // If the command is valid, we call the respective command from here
            switch (this.command) {
                case 'debug': {
                    if (this.debugOn) {
                        this.sendSystemMessage('affichages de débogage activés');
                        this.displaymessage();
                        this.debugOn = false;
                    } else {
                        this.sendSystemMessage('affichages de débogage désactivés');
                        this.debugOn = true;
                    }
                    break;
                }
                case 'passer': {
                    this.switchTour();
                    break;
                }
                case 'echanger': {
                    // this.getTour();
                    this.tour = this.tourService.getTour();
                    if (this.tour === true) {
                        const messageSplitted = this.message.split(/\s/);

                        if (this.swapComponent.swap(messageSplitted[1], INDEX_REAL_PLAYER)) {
                            this.message = this.playerService.getPlayers()[INDEX_REAL_PLAYER].name + ' : ' + this.message;
                        } else {
                            this.typeMessage = 'error';
                            this.message = 'ERREUR : La commande est impossible à réaliser';
                        }
                    } else {
                        this.typeMessage = 'error';
                        this.message = "ERREUR : Ce n'est pas ton tour";
                    }
                    break;
                }
                case 'placer': {
                    this.tour = this.tourService.getTour();
                    if (this.tour === true) {
                        const messageSplitted = this.message.split(/\s/);

                        const positionSplitted = messageSplitted[1].split(/([0-9]+)/);

                        // Vecteur contenant la position de départ du mot qu'on veut placer
                        const position: Vec2 = {
                            x: positionSplitted[0].charCodeAt(0) - 'a'.charCodeAt(0),
                            y: Number(positionSplitted[1]) - 1,
                        };
                        const orientation = positionSplitted[2];

                        if (this.placeComponent.place(position, orientation, messageSplitted[2], INDEX_REAL_PLAYER) === false) {
                            this.typeMessage = 'error';
                            this.message = 'ERREUR : Le placement est invalide';
                        }
                        this.pass.toogleTour();
                    } else {
                        this.typeMessage = 'error';
                        this.message = "ERREUR : Ce n'est pas ton tour";
                    }
                    break;
                }
                default: {
                    break;
                }
            }
        } else {
            // If command is invalid
            this.typeMessage = 'error';
        }
        this.command = '';
        // Add message and its type to the logs
        this.listTypes.push(this.typeMessage);
        this.listMessages.push(this.message);
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
        if (this.message[0] === '!') {
            // If it's a command, we call the validation
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
        const regexPlacer = /^!placer\s([a-o]([1-9]|1[0-5])[hv])\s([a-zA-Z\u00C0-\u00FF]|[*])+/g;

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
            this.message = 'ERREUR : La syntaxe est invalide';
        }
        return valid;
    }

    scrollToBottom(): void {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }

    switchTour() {
        this.tour = this.tourService.getTour();
        if (this.tour === true) {
            this.pass.toogleTour();
            this.sendSystemMessage('!passer');
        } else {
            this.sendSystemMessage('Commande impossible à realiser !');
        }
    }

    receiveAImessage(table: { word: string; nbPt: number }[]): void {
        this.debugmessage = table;
    }

    displaymessage(): void {
        for (const alternative of this.debugmessage) {
            const x: string = alternative.word;
            this.sendSystemMessage(x + ': -- ' + alternative.nbPt.toString());
        }
    }


    ngOnDestroy() {
        this.tourSubscription.unsubscribe();
    }
}
