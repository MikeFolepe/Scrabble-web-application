import { Injectable, OnDestroy } from '@angular/core';
import { INDEX_REAL_PLAYER, MAX_NUMBER_OF_POSSIBILITY } from '@app/classes/constants';
import { Vec2 } from '@app/classes/vec2';
import { EndGameService } from '@app/services/end-game.service';
import { PassTourService } from '@app/services/pass-tour.service';
import { PlaceLetterService } from '@app/services/place-letter.service';
import { PlayerService } from '@app/services/player.service';
import { SwapLetterService } from '@app/services/swap-letter.service';
import { TourService } from '@app/services/tour.service';
import { Subscription } from 'rxjs';
import { DebugService } from './debug.service';
import { SendMessageService } from './send-message.service';

@Injectable({
    providedIn: 'root',
})
export class ChatboxService implements OnDestroy {
    tourSubscription: Subscription = new Subscription();
    tour: boolean;

    message: string = '';
    typeMessage: string = '';
    command: string = '';
    endGameEasel: string = '';

    debugMessage: { word: string; nbPt: number }[] = [{ word: 'papier', nbPt: 6 }];

    constructor(
        private tourService: TourService,
        private passTourService: PassTourService,
        private playerService: PlayerService,
        private swapLetterService: SwapLetterService,
        private placeLetterService: PlaceLetterService,
        private debugService: DebugService,
        private sendMessageService: SendMessageService,
        public endGameService: EndGameService,
    ) {
        this.initializeTourSubscription();
    }

    initializeTourSubscription() {
        this.tourSubscription = this.tourService.tourSubject.subscribe((tourSubject: boolean) => {
            this.tour = tourSubject;
        });
        this.tourService.emitTour();
    }

    sendPlayerMessage(message: string) {
        this.typeMessage = 'player';
        this.message = message;
        if (!this.isValid()) {
            this.sendMessageService.displayMessageByType(this.message, 'error');
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
    }

    executeDebug() {
        this.debugService.switchDebugMode();
        if (this.debugService.isDebugActive) {
            this.sendMessageService.displayMessageByType('affichages de débogage activés', 'system');
            this.displayDebugMessage();
        } else {
            this.sendMessageService.displayMessageByType('affichages de débogage désactivés', 'system');
        }
    }

    executeSkipTurn() {
        this.endGameService.actionsLog.push('passer');
        this.tour = this.tourService.getTour();
        if (this.tour) {
            this.sendMessageService.displayMessageByType(this.message, this.typeMessage);
            this.passTourService.writeMessage('!passer');
        } else {
            this.sendMessageService.displayMessageByType("ERREUR : Ce n'est pas ton tour", 'error');
        }
    }

    executeSwap() {
        this.endGameService.actionsLog.push('echanger');
        this.tour = this.tourService.getTour();
        if (this.tour) {
            const messageSplitted = this.message.split(/\s/);

            if (this.swapLetterService.swapCommand(messageSplitted[1], INDEX_REAL_PLAYER)) {
                this.message = this.playerService.getPlayers()[INDEX_REAL_PLAYER].name + ' : ' + this.message;
                this.sendMessageService.displayMessageByType(this.message, this.typeMessage);
                this.passTourService.writeMessage();
            }
        } else {
            this.sendMessageService.displayMessageByType("ERREUR : Ce n'est pas ton tour", 'error');
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
                x: Number(positionSplitted[1]) - 1,
                y: positionSplitted[0].charCodeAt(0) - 'a'.charCodeAt(0),
            };
            const orientation = positionSplitted[2];

            if (this.placeLetterService.placeCommand(position, orientation, messageSplitted[2], INDEX_REAL_PLAYER)) {
                this.sendMessageService.displayMessageByType(this.message, this.typeMessage);
                this.passTourService.writeMessage();
            }
        } else {
            this.typeMessage = 'error';
            this.message = "ERREUR : Ce n'est pas ton tour";
        }
    }

    isValid(): boolean {
        if (this.message[0] !== '!') {
            this.sendMessageService.displayMessageByType(this.message, this.typeMessage);
            return true; // If it's a normal message, it's always valid
        }
        // If it's a command, we call the validation
        return this.isInputValid() && this.isSyntaxValid();
    }

    isInputValid(): boolean {
        const debugInput = /^!debug/g;
        const passInput = /^!passer/g;
        const swapInput = /^!échanger/g;
        const placeInput = /^!placer/g;

        if (debugInput.test(this.message) || passInput.test(this.message) || swapInput.test(this.message) || placeInput.test(this.message)) {
            return true;
        }

        this.message = "ERREUR : L'entrée est invalide";
        return false;
    }

    isSyntaxValid(): boolean {
        const debugSyntax = /^!debug$/g;
        const passSyntax = /^!passer$/g;
        const swapSyntax = /^!échanger\s([a-z]|[*]){1,7}$/g;
        const placeSyntax = /^!placer\s([a-o]([1-9]|1[0-5])[hv])\s([a-zA-Z\u00C0-\u00FF]|[*])+/g;

        let isSyntaxValid = true;

        if (debugSyntax.test(this.message)) {
            this.command = 'debug';
        } else if (passSyntax.test(this.message)) {
            this.command = 'passer';
        } else if (swapSyntax.test(this.message)) {
            this.command = 'echanger';
        } else if (placeSyntax.test(this.message)) {
            this.command = 'placer';
        } else {
            isSyntaxValid = false;
            this.message = 'ERREUR : La syntaxe est invalide';
        }
        return isSyntaxValid;
    }

    // Method which check the different size of table of possibility for the debug
    displayDebugMessage(): void {
        const nbPossibilities = this.debugService.debugServiceMessage.length;
        if (nbPossibilities === 0) {
            this.sendMessageService.displayMessageByType('Aucune possibilité de placement trouvée!', 'system');
        } else {
            for (let i = 0; i < Math.min(MAX_NUMBER_OF_POSSIBILITY, nbPossibilities); i++) {
                this.message = this.debugService.debugServiceMessage[i].word + ': -- ' + this.debugService.debugServiceMessage[i].nbPt.toString();
                this.sendMessageService.displayMessageByType(this.message, 'system');
            }
        }
        this.debugService.clearDebugMessage();
    }

    displayFinalMessage(indexPlayer: number): void {
        if (!this.endGameService.isEndGame) return;
        this.sendMessageService.displayMessageByType('Fin de partie - lettres restantes', 'system');
        for (const letter of this.playerService.getLettersEasel(indexPlayer)) {
            this.endGameEasel += letter.value;
        }
        this.sendMessageService.displayMessageByType(this.playerService.players[indexPlayer].name + ' : ' + this.endGameEasel, 'system');
        // Clear the string
        this.endGameEasel = '';
    }

    ngOnDestroy() {
        this.tourSubscription.unsubscribe();
    }
}
