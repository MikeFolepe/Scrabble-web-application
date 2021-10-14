import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DebugService {
    debugServiceMessage: { word: string; nbPt: number }[];
    debugActivate: string[] = [];
    isDebugActive: boolean = false;
    constructor() {
        this.debugServiceMessage = new Array(0);
    }
    receiveAIDebugPossibilities(table: { word: string; nbPt: number }[]): void {
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
