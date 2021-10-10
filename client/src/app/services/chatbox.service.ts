import { Injectable, OnDestroy } from '@angular/core';
import { INDEX_REAL_PLAYER } from '@app/classes/constants';
import { Vec2 } from '@app/classes/vec2';
import { PassTourService } from '@app/services/pass-tour.service';
import { PlaceLetterService } from '@app/services/place-letter.service';
import { PlayerService } from '@app/services/player.service';
import { SwapLetterService } from '@app/services/swap-letter.service';
import { TourService } from '@app/services/tour.service';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ChatboxService implements OnDestroy {
    tourSubscription: Subscription = new Subscription();
    tour: boolean;

    message: string = '';
    typeMessage: string = '';
    command: string = '';

    debugOn: boolean = true;
    debugMessage: { word: string; nbPt: number }[] = [{ word: 'papier', nbPt: 6 }];

    private displayMessage: () => void;
    constructor(
        private tourService: TourService,
        private passTourService: PassTourService,
        private playerService: PlayerService,
        private swapLetterService: SwapLetterService,
        private placeLetterService: PlaceLetterService,
    ) {
        this.initializeTourSubcribtion();
    }

    initializeTourSubcribtion() {
        this.tourSubscription = this.tourService.tourSubject.subscribe((tourSubject: boolean) => {
            this.tour = tourSubject;
        });
        this.tourService.emitTour();
    }

    displayBinded(fn: () => void) {
        this.displayMessage = fn;
    }

    displayMessageByType(message: string, typeMessage: string) {
        this.message = message;
        this.typeMessage = typeMessage;
        this.displayMessage();
    }

    sendPlayerMessage(message: string) {
        this.typeMessage = 'player';
        this.message = message;
        if (!this.isValid()) {
            this.typeMessage = 'error';
        }
        switch (this.command) {
            case 'debug': {
                this.commandDebug();
                break;
            }
            case 'passer': {
                this.commandPassTurn();
                break;
            }
            case 'echanger': {
                this.commandSwap();
                break;
            }
            case 'placer': {
                this.commandPlace();
                break;
            }
            default: {
                break;
            }
        }
        this.command = ''; // reset value for next message
        this.displayMessage();
    }

    isValid(): boolean {
        if (this.message[0] !== '!') {
            return true; // If it's a normal message, it's always valid
        }
        // If it's a command, we call the validation
        return this.isInputValid() && this.isSyntaxValid();
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

    commandDebug() {
        if (this.debugOn) {
            this.typeMessage = 'system';
            this.message = 'affichages de débogage activés';
            this.displayMessage();
            this.displayDebugMessage();
            this.debugOn = false;
        } else {
            this.typeMessage = 'error';
            this.message = 'affichages de débogage désactivés';
            this.displayMessage();
            this.debugOn = true;
        }
    }
    commandPassTurn() {
        this.tour = this.tourService.getTour();
        if (this.tour) {
            this.passTourService.writeMessage('!passer');
        } else {
            this.typeMessage = 'error';
            this.message = 'ERREUR : La commande est impossible à réaliser';
        }
    }
    commandSwap() {
        this.tour = this.tourService.getTour();
        if (this.tour) {
            const messageSplitted = this.message.split(/\s/);

            if (this.swapLetterService.swap(messageSplitted[1], INDEX_REAL_PLAYER)) {
                this.message = this.playerService.getPlayers()[INDEX_REAL_PLAYER].name + ' : ' + this.message;
            } else {
                this.typeMessage = 'error';
                this.message = 'ERREUR : La commande est impossible à réaliser';
            }
        } else {
            this.typeMessage = 'error';
            this.message = "ERREUR : Ce n'est pas ton tour";
        }
    }
    commandPlace() {
        this.tour = this.tourService.getTour();
        if (this.tour) {
            const messageSplitted = this.message.split(/\s/);
            const positionSplitted = messageSplitted[1].split(/([0-9]+)/);

            // Vector containing start position of the word to place
            const position: Vec2 = {
                x: positionSplitted[0].charCodeAt(0) - 'a'.charCodeAt(0),
                y: Number(positionSplitted[1]) - 1,
            };
            const orientation = positionSplitted[2];

            if (this.placeLetterService.place(position, orientation, messageSplitted[2], INDEX_REAL_PLAYER) === false) {
                this.typeMessage = 'error';
                this.message = 'ERREUR : Le placement est invalide';
            }
            this.passTourService.writeMessage();
        } else {
            this.typeMessage = 'error';
            this.message = "ERREUR : Ce n'est pas ton tour";
        }
    }

    addMessageToDebug(message: { word: string; nbPt: number }[]) {
        this.debugMessage = message;
    }

    displayDebugMessage(): void {
        for (const alternative of this.debugMessage) {
            const x: string = alternative.word;
            this.typeMessage = 'system';
            this.message = x + ': -- ' + alternative.nbPt.toString();
            this.displayMessage();
        }
    }

    ngOnDestroy() {
        this.tourSubscription.unsubscribe();
    }
}
