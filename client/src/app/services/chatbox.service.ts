import { SkipTurnService } from '@app/services/skip-turn.service';
import { Injectable } from '@angular/core';
import { INDEX_REAL_PLAYER, MAX_NUMBER_OF_POSSIBILITY, ONE_POSSIBILITY, TWO_POSSIBILITY } from '@app/classes/constants';
import { Vec2 } from '@app/classes/vec2';
import { PlaceLetterService } from '@app/services/place-letter.service';
import { PlayerService } from '@app/services/player.service';
import { SwapLetterService } from '@app/services/swap-letter.service';
import { Subscription } from 'rxjs';
import { DebugService } from './debug.service';

@Injectable({
    providedIn: 'root',
})
export class ChatboxService {
    tourSubscription: Subscription = new Subscription();
    tour: boolean;

    message: string = '';
    typeMessage: string = '';
    command: string = '';

    debugMessage: { word: string; nbPt: number }[] = [{ word: 'papier', nbPt: 6 }];

    private displayMessage: () => void;
    constructor(
        private playerService: PlayerService,
        private swapLetterService: SwapLetterService,
        private placeLetterService: PlaceLetterService,
        private debugService: DebugService,
        public skipTurn: SkipTurnService,
    ) {}

    bindDisplay(fn: () => void) {
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
        if (this.skipTurn.isTurn) {
            this.skipTurn.switchTurn();
        } else {
            this.typeMessage = 'error';
            this.message = "ERREUR : Ce n'est pas ton tour";
        }
    }
    executeSwap() {
        if (this.skipTurn.isTurn) {
            const messageSplitted = this.message.split(/\s/);

            if (this.swapLetterService.swap(messageSplitted[1], INDEX_REAL_PLAYER)) {
                this.message = this.playerService.players[INDEX_REAL_PLAYER].name + ' : ' + this.message;
            } else {
                this.typeMessage = 'error';
                this.message = 'ERREUR : La commande est impossible à réaliser';
            }
            this.skipTurn.switchTurn();
        } else {
            this.typeMessage = 'error';
            this.message = "ERREUR : Ce n'est pas ton tour";
        }
    }
    executePlace() {
        if (this.skipTurn.isTurn) {
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
            this.skipTurn.switchTurn();
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
}
