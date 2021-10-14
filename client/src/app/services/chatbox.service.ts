import { Injectable, OnDestroy } from '@angular/core';
import { INDEX_REAL_PLAYER, MAX_NUMBER_OF_POSSIBILITY, ONE_POSSIBILITY, TWO_POSSIBILITY } from '@app/classes/constants';
import { Vec2 } from '@app/classes/vec2';
import { EndGameService } from '@app/services/end-game.service';
import { PassTourService } from '@app/services/pass-tour.service';
import { PlaceLetterService } from '@app/services/place-letter.service';
import { PlayerService } from '@app/services/player.service';
import { SwapLetterService } from '@app/services/swap-letter.service';
import { TourService } from '@app/services/tour.service';
import { Subscription } from 'rxjs';
import { DebugService } from './debug.service';

@Injectable({
    providedIn: 'root',
})
export class ChatboxService implements OnDestroy {
    tourSubscription: Subscription = new Subscription();
    tour: boolean;

    message: string = '';
    typeMessage: string = '';
    command: string = '';
    easelResume: string = '';

    debugMessage: { word: string; nbPt: number }[] = [{ word: 'papier', nbPt: 6 }];

    private displayMessage: () => void;
    constructor(
        private tourService: TourService,
        private passTourService: PassTourService,
        private playerService: PlayerService,
        private swapLetterService: SwapLetterService,
        private placeLetterService: PlaceLetterService,
        private debugService: DebugService,
        public endGameService: EndGameService,
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
                this.executeDebug();
                break;
            }
            case 'passer': {
                this.executeSkipTurn();
                break;
            }
            case 'echanger': {
                this.executeSwap();
                break;
            }
            case 'placer': {
                this.executePlace();
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

        let isSyntaxValid = true;

        if (regexDebug.test(this.message)) {
            this.command = 'debug';
        } else if (regexPasser.test(this.message)) {
            this.command = 'passer';
        } else if (regexEchanger.test(this.message)) {
            this.command = 'echanger';
        } else if (regexPlacer.test(this.message)) {
            this.command = 'placer';
        } else {
            isSyntaxValid = false;
            this.message = 'ERREUR : La syntaxe est invalide';
        }
        return isSyntaxValid;
    }

    executeDebug() {
        this.debugService.switchDebugMode();
        if (this.debugService.isDebugActive) {
            this.typeMessage = 'system';
            this.message = 'affichages de débogage activés';
            this.displayMessage();
            this.displayDebugMessage();
        } else {
            this.typeMessage = 'system';
            this.message = 'affichages de débogage désactivés';
        }
    }
    executeSkipTurn() {
        this.endGameService.actionsLog.push('passer');
        this.tour = this.tourService.getTour();
        if (this.tour) {
            this.passTourService.writeMessage('!passer');
        } else {
            this.typeMessage = 'error';
            this.message = "ERREUR : Ce n'est pas ton tour";
        }
    }
    executeSwap() {
        this.endGameService.actionsLog.push('echanger');
        this.tour = this.tourService.getTour();
        if (this.tour) {
            const messageSplitted = this.message.split(/\s/);

            if (this.swapLetterService.swap(messageSplitted[1], INDEX_REAL_PLAYER)) {
                this.message = this.playerService.getPlayers()[INDEX_REAL_PLAYER].name + ' : ' + this.message;
            } else {
                this.typeMessage = 'error';
                this.message = 'ERREUR : La commande est impossible à réaliser';
            }
            this.passTourService.writeMessage();
        } else {
            this.typeMessage = 'error';
            this.message = "ERREUR : Ce n'est pas ton tour";
        }
    }
    executePlace() {
        this.endGameService.actionsLog.push('placer');
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

    // method which check the différents size of table of possibilty for the debug
    displayDebugMessage(): void {
        switch (this.debugService.debugServiceMessage.length) {
            case 0: {
                this.typeMessage = 'system';
                this.message = 'Aucune possibilité de placement trouvés!';
                break;
            }
            case 1: {
                for (let i = 0; i < ONE_POSSIBILITY; i++) {
                    this.typeMessage = 'system';
                    this.message = this.debugService.debugServiceMessage[i].word + ': -- ' + this.debugService.debugServiceMessage[i].nbPt.toString();
                }
                break;
            }
            case 2: {
                for (let i = 0; i < TWO_POSSIBILITY; i++) {
                    this.typeMessage = 'system';
                    this.message = this.debugService.debugServiceMessage[i].word + ': -- ' + this.debugService.debugServiceMessage[i].nbPt.toString();
                }

                break;
            }
            default: {
                for (let i = 0; i < MAX_NUMBER_OF_POSSIBILITY; i++) {
                    this.typeMessage = 'system';
                    this.message = this.debugService.debugServiceMessage[i].word + ': -- ' + this.debugService.debugServiceMessage[i].nbPt.toString();
                }
                break;
            }
        }
        this.debugService.clearDebugMessage();
    }

    displayFinalMessage(index: number): void {
        if (!this.endGameService.isEndGame) return;
        this.displayMessageByType('Fin de partie - lettres restantes', 'system');
        for (const easel of this.playerService.getLettersEasel(index)) {
            this.easelResume += easel.value;
        }
        this.displayMessageByType(this.playerService.players[index].name + ':' + this.easelResume, 'system');
        // Vider la string
        this.easelResume = '';
    }

    ngOnDestroy() {
        this.tourSubscription.unsubscribe();
    }
}
