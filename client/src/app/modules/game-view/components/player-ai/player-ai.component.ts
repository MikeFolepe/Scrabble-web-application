import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DELAY_TO_PLAY, INDEX_PLAYER_AI } from '@app/classes/constants';
import { Vec2 } from '@app/classes/vec2';
import { PlayerAI } from '@app/models/player-ai.model';
import { ChatboxService } from '@app/services/chatbox.service';
import { DebugService } from '@app/services/debug.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLetterService } from '@app/services/place-letter.service';
import { PlayerService } from '@app/services/player.service';
import { SkipTurnService } from '@app/services/skip-turn.service';

@Component({
    selector: 'app-player-ai',
    templateUrl: './player-ai.component.html',
    styleUrls: ['./player-ai.component.scss'],
})
export class PlayerAIComponent implements OnInit {
    @Output() aiSkipped = new EventEmitter();
    @Output() aiSwapped = new EventEmitter();
    // Pour le mode debug
    @Output() aiPossibility = new EventEmitter();
    // Pour dire à la boite que j'ai passé mon tour.
    aiPlayer: PlayerAI;

    constructor(
        public letterService: LetterService,
        public playerService: PlayerService,
        public placeLetterService: PlaceLetterService,
        public chatBoxService: ChatboxService,
        public debugService: DebugService,
        public skipTurn: SkipTurnService,
    ) {}

    ngOnInit(): void {
        // Subscribe to get access to AI Player
        this.aiPlayer = this.playerService.players[INDEX_PLAYER_AI] as PlayerAI;
        // Set the playerIA context so that the player can lunch event
        this.aiPlayer.setContext(this);
        // this.passSubscription = this.passtourService.currentMessage.subscribe((message) => (this.message = message));
        this.play();
        this.skipTurn.bindAiTurn(this.play.bind(this));
        console.log('done');
    }

    play() {
        if (!this.skipTurn.isTurn) {
            setTimeout(() => {
                this.aiPlayer.play();
            }, DELAY_TO_PLAY);
        }
    }

    skip() {
        this.aiSkipped.emit();
        if (!this.skipTurn.isTurn) {
            setTimeout(() => {
                this.skipTurn.switchTurn();
            }, DELAY_TO_PLAY);
        }
    }

    swap() {
        this.aiSwapped.emit();
        if (!this.skipTurn.isTurn) {
            setTimeout(() => {
                this.skipTurn.switchTurn();
            }, DELAY_TO_PLAY);
        }
    }

    place(object: { start: Vec2; orientation: string; word: string }, possibility: { word: string; nbPt: number }[]) {
        this.aiPossibility.emit(possibility);
        if (!this.skipTurn.isTurn) {
            setTimeout(() => {
                this.skipTurn.switchTurn();
            }, DELAY_TO_PLAY);
        }
    }
}
