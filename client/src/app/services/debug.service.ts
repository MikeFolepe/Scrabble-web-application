import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DebugService {
    debugServiceMessage: { word: string; nbPt: number }[];
    debugActivate: string[] = [];
    isDebug: boolean = false;

    receiveAIDebugPossibilities(table: { word: string; nbPt: number }[]): void {
        this.debugServiceMessage = table;
    }

    clearDebugMessage(): void {
        this.debugServiceMessage = [];
    }

    switchDebugMode(): void {
        if (!this.isDebug) {
            this.isDebug = true;
            return;
        }
        this.isDebug = false;
    }

    isDebugOn(): boolean {
        return this.isDebug;
    }
}
