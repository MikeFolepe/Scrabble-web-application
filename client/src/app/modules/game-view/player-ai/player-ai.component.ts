import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-player-ai',
    templateUrl: './player-ai.component.html',
    styleUrls: ['./player-ai.component.scss'],
})
export class PlayerAIComponent implements OnInit {
    // aiPlayer: PlayerAI;
    // constructor(
    //     public letterService: LetterService,
    //     public playerService: PlayerService,
    //     public placeLetterService: PlaceLetterService,
    //     public chatBoxService: ChatboxService,
    //     public debugService: DebugService,
    //     public skipTurn: SkipTurnService,
    //     public endGameService: EndGameService,
    //     public playerAIService: PlayerAIService,
    // ) {}
    ngOnInit(): void {
        // this.aiPlayer = this.playerService.players[INDEX_PLAYER_AI] as PlayerAI;
        // // Set the playerAI context so that the player can lunch event
        // this.aiPlayer.setContext(this);
        // this.play();
        // this.skipTurn.bindAiTurn(this.play.bind(this));
        return;
    }
    // play() {
    //     if (!this.skipTurn.gameSettingsService.isSoloMode) return;
    //     if (!this.skipTurn.isTurn) {
    //         setTimeout(() => {
    //             this.aiPlayer.play();
    //         }, DELAY_TO_PLAY);
    //     }
    // }
    // skip() {
    //     if (!this.skipTurn.isTurn) {
    //         setTimeout(() => {
    //             this.skipTurn.switchTurn();
    //         }, DELAY_TO_PLAY);
    //         this.endGameService.actionsLog.push('passer');
    //         this.chatBoxService.displayMessageByType('joueur virtuel passe', 'opponent');
    //     }
    // }
    // swap() {
    //     if (!this.skipTurn.isTurn) {
    //         setTimeout(() => {
    //             this.skipTurn.switchTurn();
    //         }, DELAY_TO_PLAY);
    //         this.endGameService.actionsLog.push('echanger');
    //         this.chatBoxService.displayMessageByType('joueur virtuel echange', 'opponent');
    //     }
    // }
    // switchTurn() {
    //     if (!this.skipTurn.isTurn) {
    //         setTimeout(() => {
    //             this.skipTurn.switchTurn();
    //         }, DELAY_TO_PLAY);
    //     }
    // }
    // sendPossibilities(possibility: PossibleWords[]) {
    //     this.debugService.receiveAIDebugPossibilities(possibility);
    //     this.endGameService.actionsLog.push('placer');
    // }
}
