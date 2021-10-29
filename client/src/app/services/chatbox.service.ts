import { Injectable } from '@angular/core';
import { INDEX_REAL_PLAYER, MAX_NUMBER_OF_POSSIBILITY } from '@app/classes/constants';
import { Vec2 } from '@app/classes/vec2';
import { EndGameService } from '@app/services/end-game.service';
import { PlaceLetterService } from '@app/services/place-letter.service';
import { PlayerService } from '@app/services/player.service';
import { SkipTurnService } from '@app/services/skip-turn.service';
import { SwapLetterService } from '@app/services/swap-letter.service';
import { DebugService } from './debug.service';
import { SendMessageService } from './send-message.service';

@Injectable({
    providedIn: 'root',
})
export class ChatboxService {
    message: string = '';
    typeMessage: string = '';
    command: string = '';
    endGameEasel: string = '';

    private readonly notTurnErrorMessage = "ERREUR : Ce n'est pas ton tour";

    constructor(
        private playerService: PlayerService,
        private swapLetterService: SwapLetterService,
        private placeLetterService: PlaceLetterService,
        private debugService: DebugService,
        private sendMessageService: SendMessageService,
        public endGameService: EndGameService,
        public skipTurn: SkipTurnService,
    ) {}

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

    isValid(): boolean {
        // If it's a command, we call the validation
        if (this.message[0] === '!') {
            return this.isInputValid() && this.isSyntaxValid();
        }
        // If it's a normal message, it's always valid
        this.sendMessageService.displayMessageByType(this.message, this.typeMessage);
        return true;
    }

    isInputValid(): boolean {
        const validInputs = [/^!debug/g, /^!passer/g, /^!échanger/g, /^!placer/g];

        for (const input of validInputs) if (input.test(this.message)) return true;

        this.message = "ERREUR : L'entrée est invalide";
        return false;
    }

    isSyntaxValid(): boolean {
        const syntaxes = new Map<RegExp, string>([
            [/^!debug$/g, 'debug'],
            [/^!passer$/g, 'passer'],
            [/^!échanger\s([a-z]|[*]){1,7}$/g, 'echanger'],
            [/^!placer\s([a-o]([1-9]|1[0-5])[hv])\s([a-zA-Z\u00C0-\u00FF]|[*])+/g, 'placer'],
        ]);

        for (const syntax of syntaxes.keys()) {
            if (syntax.test(this.message) && syntaxes.get(syntax)) {
                this.command = syntaxes.get(syntax) as string;
                return true;
            }
        }
        this.message = 'ERREUR : La syntaxe est invalide';
        return false;
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
        if (this.skipTurn.isTurn) {
            this.endGameService.actionsLog.push('passer');
            this.sendMessageService.displayMessageByType(this.message, this.typeMessage);
            this.skipTurn.switchTurn();
        } else {
            this.sendMessageService.displayMessageByType(this.notTurnErrorMessage, 'error');
        }
    }

    executeSwap() {
        if (this.skipTurn.isTurn) {
            this.endGameService.actionsLog.push('echanger');
            const messageSplitted = this.message.split(/\s/);

            if (this.swapLetterService.swapCommand(messageSplitted[1], INDEX_REAL_PLAYER)) {
                this.message = this.playerService.players[INDEX_REAL_PLAYER].name + ' : ' + this.message;
                this.sendMessageService.displayMessageByType(this.message, this.typeMessage);
                this.skipTurn.switchTurn();
            }
        } else {
            this.sendMessageService.displayMessageByType(this.notTurnErrorMessage, 'error');
        }
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

            if (this.placeLetterService.place(position, orientation, messageSplitted[2], INDEX_REAL_PLAYER)) {
                this.sendMessageService.displayMessageByType(this.message, this.typeMessage);
                this.skipTurn.switchTurn();
            }
        } else {
            this.typeMessage = 'error';
            this.message = this.notTurnErrorMessage;
        }
    }

    // Method that checks the different size of table of possibility for the debug
    displayDebugMessage(): void {
        const nbPossibilities = this.debugService.debugServiceMessage.length;
        if (nbPossibilities === 0) {
            this.sendMessageService.displayMessageByType('Aucune possibilité de placement trouvée!', 'system');
        } else {
            for (let i = 0; i < Math.min(MAX_NUMBER_OF_POSSIBILITY, nbPossibilities); i++) {
                this.message = this.debugService.debugServiceMessage[i].word + ': -- ' + this.debugService.debugServiceMessage[i].point.toString();
                this.sendMessageService.displayMessageByType(this.message, 'system');
            }
        }
        this.debugService.clearDebugMessage();
    }

    displayFinalMessage(indexPlayer: number): void {
        if (!this.endGameService.isEndGame) return;
        this.sendMessageService.displayMessageByType('Fin de partie - lettres restantes', 'system');
        for (const letter of this.playerService.players[indexPlayer].letterTable) {
            this.endGameEasel += letter.value;
        }
        this.sendMessageService.displayMessageByType(this.playerService.players[indexPlayer].name + ' : ' + this.endGameEasel, 'system');
        // Clear the string
        this.endGameEasel = '';
    }
}
