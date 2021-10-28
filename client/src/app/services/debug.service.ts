import { Injectable } from '@angular/core';
import { PossibleWords } from '@app/classes/scrabble-board-pattern';

@Injectable({
    providedIn: 'root',
})
export class DebugService {
    debugServiceMessage: PossibleWords[];
    debugActivate: string[] = [];
    isDebugActive: boolean = false;
    constructor() {
        this.debugServiceMessage = new Array(0);
    }
    receiveAIDebugPossibilities(table: PossibleWords[]): void {
        this.debugServiceMessage = table;
    }

    clearDebugMessage(): void {
        this.debugServiceMessage = [];
    }

    switchDebugMode(): void {
        if (this.isDebugActive) {
            this.isDebugActive = false;
            return;
        }
        this.isDebugActive = true;
    }
}
