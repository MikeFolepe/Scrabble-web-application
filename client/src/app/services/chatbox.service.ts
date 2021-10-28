import { Injectable } from '@angular/core';
import { INDEX_REAL_PLAYER, MAX_NUMBER_OF_POSSIBILITY } from '@app/classes/constants';
import { PossibleWords } from '@app/classes/scrabble-board-pattern';
import { Vec2 } from '@app/classes/vec2';
import { EndGameService } from '@app/services/end-game.service';
import { PlaceLetterService } from '@app/services/place-letter.service';
import { PlayerService } from '@app/services/player.service';
import { SkipTurnService } from '@app/services/skip-turn.service';
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
    endGameEasel: string = '';

    debugMessage: PossibleWords[] = [];

    private displayMessage: () => void;
    constructor(
        private playerService: PlayerService,
        private swapLetterService: SwapLetterService,
        private placeLetterService: PlaceLetterService,
        private debugService: DebugService,
        public endGameService: EndGameService,
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
                this.displayMessage();
                break;
            }
        }
        this.command = ''; // reset value for next message
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
            this.displayMessage();
        }
    }

    executeSkipTurn() {
        if (this.skipTurn.isTurn) {
            this.endGameService.actionsLog.push('passer');
            this.skipTurn.switchTurn();
        } else {
            this.typeMessage = 'error';
            this.message = "ERREUR : Ce n'est pas ton tour";
        }
        this.displayMessage();
    }

    executeSwap() {
        if (this.skipTurn.isTurn) {
            this.endGameService.actionsLog.push('echanger');
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
        this.displayMessage();
    }

    executePlace() {
        if (this.skipTurn.isTurn) {
            this.endGameService.actionsLog.push('placer');
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
        this.displayMessage();
    }

    // Method that checks the different size of table of possibility for the debug
    displayDebugMessage(): void {
        const nbPossibilities = this.debugService.debugServiceMessage.length;
        if (nbPossibilities === 0) {
            this.typeMessage = 'system';
            this.message = 'Aucune possibilité de placement trouvée!';
        } else {
            for (let i = 0; i < Math.min(MAX_NUMBER_OF_POSSIBILITY, nbPossibilities); i++) {
                this.typeMessage = 'system';
                this.message = this.debugService.debugServiceMessage[i].word + ': -- ' + this.debugService.debugServiceMessage[i].point.toString();
                this.displayMessage();
            }
        }
        this.debugService.clearDebugMessage();
    }

    displayFinalMessage(indexPlayer: number): void {
        if (!this.endGameService.isEndGame) return;
        this.displayMessageByType('Fin de partie - lettres restantes', 'system');
        for (const letter of this.playerService.players[indexPlayer].letterTable) {
            this.endGameEasel += letter.value;
        }
        this.displayMessageByType(this.playerService.players[indexPlayer].name + ':' + this.endGameEasel, 'system');
        // Clear the string
        this.endGameEasel = '';
    }
}
