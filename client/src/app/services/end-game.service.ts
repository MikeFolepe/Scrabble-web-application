import { INDEX_PLAYER_AI, INDEX_REAL_PLAYER, NUMBER_OF_SKIP, RESERVE } from '@app/classes/constants';
import { DebugService } from '@app/services/debug.service';
import { Injectable } from '@angular/core';
import { LetterService } from '@app/services/letter.service';
import { PlayerService } from '@app/services/player.service';

@Injectable({
    providedIn: 'root',
})
export class EndGameService {
    actionsLog: string[] = [];
    isEndGame: boolean = false;

    constructor(public letterService: LetterService, public playerService: PlayerService, public debugService: DebugService) {}

    getWinnerName(): string {
        if (this.playerService.players[0].score > this.playerService.players[1].score) {
            return this.playerService.players[0].name;
        }
        if (this.playerService.players[0].score < this.playerService.players[1].score) {
            return this.playerService.players[1].name;
        }
        return this.playerService.players[0].name + '  ' + this.playerService.players[1].name;
    }

    checkEndGame(): void {
        this.isEndGame = this.isEndGameByActions() || this.isEndGameByEasel();
    }

    getFinalScore(indexPlayer: number): void {
        if (!this.isEndGame || this.playerService.players[indexPlayer].score === 0) {
            return;
        }
        for (const letter of this.playerService.players[indexPlayer].letterTable) {
            this.playerService.players[indexPlayer].score -= letter.points;
            // Check if score decrease under 0 after subtraction
            if (this.playerService.players[indexPlayer].score < 0) {
                this.playerService.players[indexPlayer].score = 0;
                return;
            }
        }
    }

    clearAllData(): void {
        this.playerService.players = [];
        this.letterService.reserve = JSON.parse(JSON.stringify(RESERVE));
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
            (this.playerService.isEaselEmpty(INDEX_REAL_PLAYER) || this.playerService.isEaselEmpty(INDEX_PLAYER_AI))
        );
    }
}
