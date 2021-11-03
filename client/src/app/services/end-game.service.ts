/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { INDEX_PLAYER_AI, INDEX_REAL_PLAYER, NUMBER_OF_SKIP, RESERVE } from '@app/classes/constants';
import { ClientSocketService } from './client-socket.service';
import { DebugService } from './debug.service';
import { GameSettingsService } from './game-settings.service';
import { LetterService } from './letter.service';
import { PlayerService } from './player.service';
import { SkipTurnService } from './skip-turn.service';

@Injectable({
    providedIn: 'root',
})
export class EndGameService {
    actionsLog: string[] = [];
    isEndGame: boolean = false;
    isEndGamebyGiveUp = false;

    constructor(
        public clientSocketService: ClientSocketService,
        public letterService: LetterService,
        public playerService: PlayerService,
        public debugService: DebugService,
        public skipturnService: SkipTurnService,
        public gameSettingsService: GameSettingsService,
    ) {
        this.clientSocketService.socket.on('receiveEndGamebyGiveup', (isEndGame: boolean) => {
            this.isEndGamebyGiveUp = isEndGame;
        });
        this.clearAllData();
    }

    getWinnerName(): string {
        if (this.playerService.players[0].score > this.playerService.players[1].score) {
            return this.playerService.players[0].name;
        } else if (this.playerService.players[0].score < this.playerService.players[1].score) {
            return this.playerService.players[1].name;
        } else {
            return this.playerService.players[0].name + '  ' + this.playerService.players[1].name;
        }
    }

    checkEndGame(): void {
        this.isEndGame = this.isEndGameByActions() || this.isEndGameByEasel() || this.isEndGamebyGiveUp;

        if (this.isEndGame) this.skipturnService.stopTimer();
    }

    getFinalScore(indexPlayer: number): void {
        if (!this.isEndGame || this.playerService.players[indexPlayer].score === 0) {
            return;
        }
        for (const letter of this.playerService.players[indexPlayer].letterTable) {
            this.playerService.players[indexPlayer].score -= letter.points;
            // Check if score decrease under 0 after soustraction
            if (this.playerService.players[indexPlayer].score < 0) {
                this.playerService.players[indexPlayer].score = 0;
                return;
            }
        }
    }

    clearAllData(): void {
        this.playerService.players = [];
        this.letterService.reserve = JSON.parse(JSON.stringify(RESERVE));
        this.isEndGamebyGiveUp = false;
        this.isEndGame = false;
        this.actionsLog = [];
        this.debugService.debugServiceMessage = [];
    }

    private isEndGameByActions(): boolean {
        if (this.actionsLog.length < NUMBER_OF_SKIP) {
            return false;
        }
        const lastIndex = this.actionsLog.length - 1;
        for (let i = lastIndex; i > lastIndex - NUMBER_OF_SKIP; i--) {
            if (this.actionsLog[i] !== 'passer') {
                return false;
            }
        }
        return true;
    }

    private isEndGameByEasel(): boolean {
        return (
            this.letterService.reserveSize === 0 &&
            (this.playerService.players[INDEX_REAL_PLAYER].letterTable.length === 0 ||
                this.playerService.players[INDEX_PLAYER_AI].letterTable.length === 0)
        );
    }
}
