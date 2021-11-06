import { Injectable } from '@angular/core';
import { INDEX_PLAYER_ONE, MAX_NUMBER_OF_POSSIBILITY } from '@app/classes/constants';
import { TypeMessage } from '@app/classes/enum';
import { Orientation } from '@app/classes/scrabble-board-pattern';
import { DebugService } from '@app/services/debug.service';
import { EndGameService } from '@app/services/end-game.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLetterService } from '@app/services/place-letter.service';
import { PlayerService } from '@app/services/player.service';
import { SendMessageService } from '@app/services/send-message.service';
import { SkipTurnService } from '@app/services/skip-turn.service';
import { SwapLetterService } from '@app/services/swap-letter.service';
import { Vec2 } from '@common/vec2';

@Injectable({
    providedIn: 'root',
})
export class ChatboxService {
    private message: string;
    private typeMessage: TypeMessage;
    private command: string;
    private endGameEasel: string;

    private readonly notTurnErrorMessage;

    constructor(
        private playerService: PlayerService,
        private swapLetterService: SwapLetterService,
        private placeLetterService: PlaceLetterService,
        private debugService: DebugService,
        private sendMessageService: SendMessageService,
        public endGameService: EndGameService,
        public letterService: LetterService,
        public skipTurnService: SkipTurnService,
    ) {
        this.message = '';
        this.command = '';
        this.endGameEasel = '';
        this.notTurnErrorMessage = "ERREUR : Ce n'est pas ton tour";
    }

    sendPlayerMessage(message: string): void {
        this.typeMessage = TypeMessage.Player;
        this.message = message;
        if (!this.isValid()) {
            this.sendMessageService.displayMessageByType(this.message, TypeMessage.Error);
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
        this.command = ''; // reset value for next message
    }

    executeDebug(): void {
        this.debugService.switchDebugMode();
        if (this.debugService.isDebugActive) {
            this.sendMessageService.displayMessageByType('affichages de débogage activés', TypeMessage.System);
            this.displayDebugMessage();
        } else {
            this.sendMessageService.displayMessageByType('affichages de débogage désactivés', TypeMessage.System);
        }
    }

    executeSkipTurn(): void {
        if (this.skipTurnService.isTurn) {
            this.endGameService.addActionsLog('passer');
            this.sendMessageService.displayMessageByType(this.message, this.typeMessage);
            this.skipTurnService.switchTurn();
        } else {
            this.sendMessageService.displayMessageByType(this.notTurnErrorMessage, TypeMessage.Error);
        }
    }

    executeReserve(): void {
        if (!this.debugService.isDebugActive) {
            this.sendMessageService.displayMessageByType('Commande non réalisable', TypeMessage.Error);
            this.message = '';
            return;
        }
        for (const letter of this.letterService.reserve) {
            this.message = 'system';
            this.sendMessageService.displayMessageByType(letter.value + ':' + letter.quantity.toString(), TypeMessage.System);
            this.message = '';
        }
    }

    executeSwap(): void {
        if (this.skipTurnService.isTurn) {
            const messageSplitted = this.message.split(/\s/);

            if (this.swapLetterService.swapCommand(messageSplitted[1], INDEX_PLAYER_ONE)) {
                this.message = this.playerService.players[INDEX_PLAYER_ONE].name + ' : ' + this.message;
                this.sendMessageService.displayMessageByType(this.message, this.typeMessage);
                this.skipTurnService.switchTurn();
            }
        } else {
            this.sendMessageService.displayMessageByType(this.notTurnErrorMessage, TypeMessage.Error);
        }
    }

    async executePlace(): Promise<void> {
        if (this.skipTurnService.isTurn) {
            const messageSplitted = this.message.split(/\s/);
            const positionSplitted = messageSplitted[1].split(/([0-9]+)/);

            // Vector containing start position of the word to place
            const position: Vec2 = {
                x: Number(positionSplitted[1]) - 1,
                y: positionSplitted[0].charCodeAt(0) - 'a'.charCodeAt(0),
            };
            const orientation = positionSplitted[2] === 'h' ? Orientation.Horizontal : Orientation.Vertical;

            if (await this.placeLetterService.placeCommand(position, orientation, messageSplitted[2], INDEX_PLAYER_ONE)) {
                this.sendMessageService.displayMessageByType(this.message, this.typeMessage);
            }
        } else {
            this.sendMessageService.displayMessageByType(this.notTurnErrorMessage, TypeMessage.Error);
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
        const validInputs = [/^!debug/g, /^!passer/g, /^!échanger/g, /^!placer/g, /^!reserve/g];

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
            [/^!reserve$/g, 'reserve'],
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

    // Method which check the different size of table of possibility for the debug
    displayDebugMessage(): void {
        const nbPossibilities = this.debugService.debugServiceMessage.length;
        if (nbPossibilities === 0) {
            this.sendMessageService.displayMessageByType('Aucune possibilité de placement trouvée!', TypeMessage.System);
        } else {
            for (let i = 0; i < Math.min(MAX_NUMBER_OF_POSSIBILITY, nbPossibilities); i++) {
                this.message = this.debugService.debugServiceMessage[i].word + ': -- ' + this.debugService.debugServiceMessage[i].point.toString();
                this.sendMessageService.displayMessageByType(this.message, TypeMessage.System);
            }
        }
        this.debugService.clearDebugMessage();
    }

    displayFinalMessage(indexPlayer: number): void {
        if (!this.endGameService.isEndGame) return;
        this.sendMessageService.displayMessageByType('Fin de partie - lettres restantes', TypeMessage.System);
        for (const letter of this.playerService.players[indexPlayer].letterTable) {
            this.endGameEasel += letter.value;
        }
        this.sendMessageService.displayMessageByType(this.playerService.players[indexPlayer].name + ' : ' + this.endGameEasel, TypeMessage.System);
        // Clear the string
        this.endGameEasel = '';
    }
}
