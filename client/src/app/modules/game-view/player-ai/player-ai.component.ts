import { Component, OnInit } from '@angular/core';
import { DELAY_TO_PLAY, INDEX_PLAYER_AI } from '@app/classes/constants';
import { TypeMessage } from '@app/classes/enum';
import { PossibleWords } from '@app/classes/scrabble-board-pattern';
import { PlayerAI } from '@app/models/player-ai.model';
import { ChatboxService } from '@app/services/chatbox.service';
import { DebugService } from '@app/services/debug.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLetterService } from '@app/services/place-letter.service';
import { PlayerAIService } from '@app/services/player-ia.service';
import { PlayerService } from '@app/services/player.service';
import { SendMessageService } from '@app/services/send-message.service';
import { SkipTurnService } from '@app/services/skip-turn.service';
import { EndGameService } from '@app/services/end-game.service';

@Component({
    selector: 'app-player-ai',
    templateUrl: './player-ai.component.html',
    styleUrls: ['./player-ai.component.scss'],
})
export class PlayerAIComponent implements OnInit {
    aiPlayer: PlayerAI;

    constructor(
        public letterService: LetterService,
        public playerService: PlayerService,
        public placeLetterService: PlaceLetterService,
        public chatBoxService: ChatboxService,
        public debugService: DebugService,
        public skipTurn: SkipTurnService,
        public endGameService: EndGameService,
        public sendMessageService: SendMessageService,
        public playerAIService: PlayerAIService,
    ) {}

    ngOnInit(): void {
        this.aiPlayer = this.playerService.players[INDEX_PLAYER_AI] as PlayerAI;
        // Set the playerAI context so that the player can lunch event
        this.aiPlayer.setContext(this);
        this.play();
        this.skipTurn.bindAiTurn(this.play.bind(this));
    }

    play() {
        if (!this.skipTurn.gameSettingsService.isSoloMode) return;
        if (!this.skipTurn.isTurn) {
            setTimeout(() => {
                this.aiPlayer.play();
            }, DELAY_TO_PLAY);
        }
    }

    skip() {
        if (!this.skipTurn.isTurn) {
            setTimeout(() => {
                this.skipTurn.switchTurn();
            }, DELAY_TO_PLAY);
            this.endGameService.actionsLog.push('passer');
            this.sendMessageService.displayMessageByType('passer', TypeMessage.Opponent);
        }
    }

    swap() {
        if (!this.skipTurn.isTurn) {
            setTimeout(() => {
                this.skipTurn.switchTurn();
            }, DELAY_TO_PLAY);
            this.endGameService.actionsLog.push('echanger');
            this.sendMessageService.displayMessageByType('joueur virtuel echange', TypeMessage.Opponent);
        }
    }

    switchTurn() {
        if (!this.skipTurn.isTurn) {
            setTimeout(() => {
                this.skipTurn.switchTurn();
            }, DELAY_TO_PLAY);
        }
    }

    sendPossibilities(possibility: PossibleWords[]) {
        this.debugService.receiveAIDebugPossibilities(possibility);
        this.endGameService.actionsLog.push('placer');
    }
}
