import { Injectable } from '@angular/core';
import { AI_NAME_DATABASE, INDEX_PLAYER_AI, INDEX_PLAYER_ONE, INDEX_PLAYER_TWO, NUMBER_OF_SKIP, RESERVE } from '@app/classes/constants';
import { DebugService } from '@app/services/debug.service';
import { PlayerScore } from '@common/player';
import { ClientSocketService } from './client-socket.service';
import { CommunicationService } from './communication.service';
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
        private httpServer: CommunicationService,
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
            // const players: PlayerScore[] = [];
            // players[0] = { score: this.playerService.players[0].score, playerName: this.playerService.players[0].name, isDefault: false };
            // players[1] = { score: this.playerService.players[1].score, playerName: this.playerService.players[1].name, isDefault: false };
            // this.httpServer.addPlayers(players).subscribe(() => {
            //     // eslint-disable-next-line no-console
            //     console.log('score ajouté');
            // });
        }
    }

    getFinalScore(indexPlayer: number): void {
        if (this.playerService.players[indexPlayer].score === 0) {
            return;
        }
        for (const letter of this.playerService.players[indexPlayer].letterTable) {
            this.playerService.players[indexPlayer].score -= letter.points;
            // Check if score decrease under 0 after subtraction
            if (this.playerService.players[indexPlayer].score < 0) {
                this.playerService.players[indexPlayer].score = 0;
                break;
            }
        }
        if (this.playerService.players[indexPlayer].name in AI_NAME_DATABASE) return;
        // TODO: fort probablement changer ceci pour juste avoir un player au lieu d'un tableau de players
        const players: PlayerScore[] = [];
        players[indexPlayer] = {
            score: this.playerService.players[indexPlayer].score,
            playerName: this.playerService.players[indexPlayer].name,
            isDefault: false,
        };
        // players[1] = { score: this.playerService.players[1].score, playerName: this.playerService.players[1].name, isDefault: false };
        this.httpServer.addPlayers(players).subscribe(() => {
            // eslint-disable-next-line no-console
            console.log('score ajouté');
        });
    }

    clearJoelleData(): void {
        this.getFinalScore(0);
        this.getFinalScore(1);
        this.clearAllData();
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
