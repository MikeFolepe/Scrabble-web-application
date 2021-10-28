import { Injectable, OnDestroy } from '@angular/core';
import { INDEX_REAL_PLAYER, MAX_NUMBER_OF_POSSIBILITY } from '@app/classes/constants';
import { Vec2 } from '@app/classes/vec2';
import { EndGameService } from '@app/services/end-game.service';
import { LetterService } from '@app/services/letter.service';
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
    endGameEasel: string = '';

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
        public letterService: LetterService,
    ) {
        this.initializeTourSubscription();
    }

    initializeTourSubscription() {
        this.tourSubscription = this.tourService.tourSubject.subscribe((tourSubject: boolean) => {
            this.tour = tourSubject;
        });
        this.tourService.emitTour();
    }

    displayBound(fn: () => void) {
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
            case 'reserve': {
                this.executeReserve();
                break;
            }

            default: {
                break;
            }
        }
        this.command = ''; // Reset value for next message
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
        const regexReserve = /^!reserve$/g;
        if (
            regexDebug.test(this.message) ||
            regexPasser.test(this.message) ||
            regexEchanger.test(this.message) ||
            regexPlacer.test(this.message) ||
            regexReserve.test(this.message)
        ) {
            return true;
        }

        this.message = "ERREUR : L'entrée est invalide";
        return false;
    }

    isSyntaxValid(): boolean {
        const regexReserve = /^!reserve$/g;
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
        } else if (regexReserve.test(this.message)) {
            this.command = 'reserve';
        } else {
            isSyntaxValid = false;
            this.message = 'ERREUR : La syntaxe est invalide';
        }
        return isSyntaxValid;
    }

    executeDebug(): void {
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

    executeSkipTurn(): void {
        this.endGameService.actionsLog.push('passer');
        this.tour = this.tourService.getTour();
        if (this.tour) {
            this.passTourService.writeMessage('!passer');
        } else {
            this.typeMessage = 'error';
            this.message = "ERREUR : Ce n'est pas ton tour";
        }
    }

    executeReserve(): void {
        if (!this.debugService.isDebugActive) {
            this.displayMessageByType('Commande non réalisable', 'error');
            this.message = '';
            return;
        }
        for (const letter of this.letterService.reserve) {
            this.message = 'system';
            this.displayMessageByType(letter.value + ':' + letter.quantity.toString(), 'system');
            this.message = '';
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

    // Method which check the different size of table of possibility for the debug
    displayDebugMessage(): void {
        const nbPossibilities = this.debugService.debugServiceMessage.length;
        if (nbPossibilities === 0) {
            this.typeMessage = 'system';
            this.message = 'Aucune possibilité de placement trouvée!';
        } else {
            for (let i = 0; i < Math.min(MAX_NUMBER_OF_POSSIBILITY, nbPossibilities); i++) {
                this.typeMessage = 'system';
                this.message = this.debugService.debugServiceMessage[i].word + ': -- ' + this.debugService.debugServiceMessage[i].nbPt.toString();
            }
        }
        this.debugService.clearDebugMessage();
    }

    displayFinalMessage(indexPlayer: number): void {
        if (!this.endGameService.isEndGame) return;
        this.displayMessageByType('Fin de partie - lettres restantes', 'system');
        for (const letter of this.playerService.getLettersEasel(indexPlayer)) {
            this.endGameEasel += letter.value;
        }
        this.displayMessageByType(this.playerService.players[indexPlayer].name + ':' + this.endGameEasel, 'system');
        // Clear the string
        this.endGameEasel = '';
    }

    ngOnDestroy() {
        this.tourSubscription.unsubscribe();
    }
}
