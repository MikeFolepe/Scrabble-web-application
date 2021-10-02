import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { INDEX_REAL_PLAYER } from '@app/classes/constants';
import { Vec2 } from '@app/classes/vec2';
import { PassTurnComponent } from '@app/modules/game-view/components/pass-turn/pass-turn.component';
import { PlaceLetterComponent } from '@app/modules/game-view/components/place-letter/place-letter.component';
import { PlayerService } from '@app/services/player.service';
import { TourService } from '@app/services/tour.service';
import { Subscription } from 'rxjs';
import { SwapLetterComponent } from '@app/modules/game-view/components/swap-letter/swap-letter.component';

@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss'],
})
export class ChatBoxComponent implements OnInit, OnDestroy {
    @ViewChild(PassTurnComponent) passTurn: PassTurnComponent;
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
    debugMessage: { word: string; nbPt: number }[] = [];

    constructor(private tourService: TourService, private playerService: PlayerService) {}

    ngOnInit(): void {
        this.tourSubscription = this.tourService.tourSubject.subscribe((tourSubject: boolean) => {
            this.tour = tourSubject;
        });
        this.tourService.emitTour();
    }
    handleKeyEvent(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.sendSystemMessage('Message du système');
            this.sendOpponentMessage('Le joueur virtuel fait...');
            this.sendPlayerCommand();
            this.message = '';

            setTimeout(() => {
                this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
            }, 1);
        }
    }

    sendPlayerCommand() {
        if (this.isValid()) {
            this.typeMessage = 'player';
            switch (this.command) {
                case 'debug': {
                    if (this.debugOn) {
                        this.sendSystemMessage('affichages de débogage activés');
                        this.displayDebugMessage();
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
                    if (this.tourService.getTour()) {
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
                    if (this.tourService.getTour()) {
                        const messageSplitted = this.message.split(/\s/);

                        const positionSplitted = messageSplitted[1].split(/([0-9]+)/);

                        const position: Vec2 = {
                            x: positionSplitted[0].charCodeAt(0) - 'a'.charCodeAt(0),
                            y: Number(positionSplitted[1]) - 1,
                        };
                        const orientation = positionSplitted[2];

                        if (this.placeComponent.place(position, orientation, messageSplitted[2], INDEX_REAL_PLAYER) === false) {
                            this.typeMessage = 'error';
                            this.message = 'ERREUR : Le placement est invalide';
                        }
                        this.passTurn.toggleTurn();
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
            this.typeMessage = 'error';
        }
        this.command = '';
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
            return this.isInputValid() && this.isSyntaxValid();
        }
        return true;
    }

    isInputValid(): boolean {
        const regexDebug = /^!debug/g;
        const regexPass = /^!passer/g;
        const regexChange = /^!échanger/g;
        const regexPlace = /^!placer/g;

        if (regexDebug.test(this.message) || regexPass.test(this.message) || regexChange.test(this.message) || regexPlace.test(this.message)) {
            return true;
        }

        this.message = "ERREUR : L'entrée est invalide";
        return false;
    }

    isSyntaxValid(): boolean {
        const regexDebug = /^!debug$/g;
        const regexPass = /^!passer$/g;
        const regexChange = /^!échanger\s([a-z]|[*]){1,7}$/g;
        const regexPlace = /^!placer\s([a-o]([1-9]|1[0-5])[hv])\s([a-zA-Z\u00C0-\u00FF]|[*])+/g;

        let valid = true;

        if (regexDebug.test(this.message)) {
            this.command = 'debug';
        } else if (regexPass.test(this.message)) {
            this.command = 'passer';
        } else if (regexChange.test(this.message)) {
            this.command = 'echanger';
        } else if (regexPlace.test(this.message)) {
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
        if (this.tour) {
            this.passTurn.toggleTurn();
            this.sendSystemMessage('!passer');
        } else {
            this.sendSystemMessage('Commande impossible à realiser !');
        }
    }

    receiveAIdebugMessage(table: { word: string; nbPt: number }[]): void {
        this.debugMessage = table;
    }

    displayDebugMessage(): void {
        if (this.debugMessage.length === 0) {
            this.sendSystemMessage('Aucune alternative de placement trouvé ');
        } else {
            for (const alternative of this.debugMessage) {
                const x: string = alternative.word;
                this.sendSystemMessage(x + ': -- ' + alternative.nbPt.toString());
            }
        }
    }

    ngOnDestroy() {
        this.tourSubscription.unsubscribe();
    }
}
