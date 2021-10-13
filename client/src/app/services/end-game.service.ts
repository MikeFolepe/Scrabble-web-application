import { Injectable } from '@angular/core';
import { RESERVE } from '@app/classes/constants';
// import { BehaviorSubject } from 'rxjs';
import { DebugService } from './debug.service';
import { LetterService } from './letter.service';
import { PlayerService } from './player.service';

@Injectable({
    providedIn: 'root',
})
export class EndGameService {
    playerServiceActions: string[] = [];
    aiServiceActions: string[] = [];
    isEndGame: boolean = false;

    // private func: () => void;
    constructor(public letterService: LetterService, public playerService: PlayerService, public debugService: DebugService) {}
    getWinnerName(): string {
        if (this.playerService.players[0].score > this.playerService.players[1].score) {
            return this.playerService.players[0].name;
        } else if (this.playerService.players[0].score < this.playerService.players[1].score) {
            return this.playerService.players[1].name;
        } else {
            return this.playerService.players[0].name + '  ' + this.playerService.players[1].name;
        }
    }
    findLastActions(): void {
        for (let i = this.playerServiceActions.length; i > 0; i--) {
            if (
                this.playerServiceActions[i - 1] === this.playerServiceActions[i - 2] &&
                this.playerServiceActions[i - 3] === 'passer' &&
                this.aiServiceActions[i - 1] === this.aiServiceActions[i - 2] &&
                this.aiServiceActions[i - 3] === 'passer'
            ) {
                this.isEndGame = true;
                return;
            }
        }
    }

    checkEndgame(): void {
        if (
            (this.letterService.getReserveSize() === 0 && this.playerService.getLettersEasel(0).length === 0) ||
            (this.letterService.getReserveSize() === 0 && this.playerService.getLettersEasel(1).length === 0)
        ) {
            this.isEndGame = true;
        } else {
            this.isEndGame = false;
        }
    }

    getFinalScore(index: number): void {
        if (this.isEndGame) {
            for (const easel of this.playerService.getLettersEasel(index)) {
                // If the player never plays and pass 3 fois
                if (this.playerService.players[index].score === 0) {
                    this.playerService.players[index].score = 0;
                    return;
                }
                this.playerService.players[index].score = this.playerService.players[index].score - easel.points;
                // Check if score decrease under 0 after soustraction
                if (this.playerService.players[index].score < 0) {
                    this.playerService.players[index].score = 0;
                    return;
                }
            }
        }
    }

    clearAllData(): void {
        this.playerService.players = [];
        this.letterService.reserve = JSON.parse(JSON.stringify(RESERVE));
        this.isEndGame = false;
        this.playerServiceActions = [];
        this.aiServiceActions = [];
        this.debugService.debugServiceMessage = [];
    }
}
