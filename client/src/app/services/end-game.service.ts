import { Injectable } from '@angular/core';
import { INDEX_PLAYER_AI, INDEX_PLAYER_ONE, NUMBER_OF_SKIP, RESERVE } from '@app/classes/constants';
import { DebugService } from '@app/services/debug.service';
import { ClientSocketService } from './client-socket.service';
import { LetterService } from './letter.service';
import { PlayerService } from './player.service';

@Injectable({
    providedIn: 'root',
})
export class EndGameService {
    actionsLog: string[] = [];
    isEndGame: boolean = false;

    constructor(
        public letterService: LetterService,
        public playerService: PlayerService,
        public debugService: DebugService,
        private clientSocketService: ClientSocketService,
    ) {
        this.clientSocketService.socket.on('receiveActions', (actionsLog: string[]) => {
            this.actionsLog = actionsLog;
        });
        this.clientSocketService.socket.on('receiveEndGame', (isEndGame: boolean) => {
            this.isEndGame = isEndGame;
        });
    }

    getWinnerName(): string {
        if (this.playerService.players[0].score > this.playerService.players[1].score) {
            return this.playerService.players[0].name;
        }
        if (this.playerService.players[0].score < this.playerService.players[1].score) {
            return this.playerService.players[1].name;
        }
        return this.playerService.players[0].name + '  ' + this.playerService.players[1].name;
    }
    addActionsLog(actionLog: string): void {
        this.actionsLog.push(actionLog);
        this.clientSocketService.socket.emit('sendActions', this.actionsLog, this.clientSocketService.roomId);
    }

    checkEndGame(): void {
        this.isEndGame = this.isEndGameByActions() || this.isEndGameByEasel();
        if (this.isEndGame) {
            this.clientSocketService.socket.emit('sendEndGame', this.isEndGame, this.clientSocketService.roomId);
        }
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
            (this.playerService.isEaselEmpty(INDEX_PLAYER_ONE) || this.playerService.isEaselEmpty(INDEX_PLAYER_AI))
        );
    }
}
