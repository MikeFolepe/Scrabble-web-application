/* eslint-disable sort-imports */
import { Injectable } from '@angular/core';
import { INDEX_PLAYER_AI, INDEX_PLAYER_ONE, INDEX_PLAYER_TWO, NUMBER_OF_SKIP, RESERVE } from '@app/classes/constants';
import { DebugService } from '@app/services/debug.service';
import { ClientSocketService } from './client-socket.service';
import { GameSettingsService } from './game-settings.service';
import { LetterService } from './letter.service';
import { PlayerService } from './player.service';

@Injectable({
    providedIn: 'root',
})
export class EndGameService {
    actionsLog: string[] = [];
    isEndGame: boolean = false;
    isEndGameByGiveUp = false;
    winnerNameByGiveUp = '';

    constructor(
        public clientSocketService: ClientSocketService,
        public letterService: LetterService,
        public playerService: PlayerService,
        public debugService: DebugService,
        public gameSettingsService: GameSettingsService,
    ) {
        this.clearAllData();
        this.actionsLog = [];
        this.isEndGame = false;

        this.receiveEndGameFromServer();
        this.receiveActionsFromServer();
        this.receiveEndGameByGiveUp();
    }

    receiveEndGameFromServer(): void {
        this.clientSocketService.socket.on('receiveEndGame', (isEndGame: boolean) => {
            this.isEndGame = isEndGame;
        });
    }
    receiveEndGameByGiveUp(): void {
        this.clientSocketService.socket.on('receiveEndGameByGiveUp', (isEndGameByGiveUp: boolean, winnerName: string) => {
            this.isEndGameByGiveUp = isEndGameByGiveUp;
            this.winnerNameByGiveUp = winnerName;
        });
    }

    receiveActionsFromServer(): void {
        this.clientSocketService.socket.on('receiveActions', (actionsLog: string[]) => {
            this.actionsLog = actionsLog;
        });
    }

    getWinnerName(): string {
        if (this.playerService.players[INDEX_PLAYER_ONE].score > this.playerService.players[INDEX_PLAYER_TWO].score) {
            return this.playerService.players[INDEX_PLAYER_ONE].name;
        }
        if (this.playerService.players[INDEX_PLAYER_ONE].score < this.playerService.players[INDEX_PLAYER_TWO].score) {
            return this.playerService.players[INDEX_PLAYER_TWO].name;
        }
        return this.playerService.players[INDEX_PLAYER_ONE].name + '  ' + this.playerService.players[INDEX_PLAYER_TWO].name;
    }

    addActionsLog(actionLog: string): void {
        this.actionsLog.push(actionLog);
        this.clientSocketService.socket.emit('sendActions', this.actionsLog, this.clientSocketService.roomId);
    }

    checkEndGame(): void {
        this.isEndGame = this.isEndGameByActions() || this.isEndGameByEasel() || this.isEndGameByGiveUp;

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
        this.isEndGameByGiveUp = false;
        this.winnerNameByGiveUp = '';
        this.isEndGame = false;
        this.actionsLog = [];
        this.debugService.debugServiceMessage = [];
    }

    isEndGameByActions(): boolean {
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

    isEndGameByEasel(): boolean {
        return (
            this.letterService.reserveSize === 0 &&
            (this.playerService.isEaselEmpty(INDEX_PLAYER_ONE) || this.playerService.isEaselEmpty(INDEX_PLAYER_AI))
        );
    }
}
