import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DebugService {
    debugServiceMessage: { word: string; nbPt: number }[];
    debugActivate: string[] = [];
    isDebugOn: boolean = false;

    receiveAIDebugPossibilities(table: { word: string; nbPt: number }[]): void {
        this.debugServiceMessage = table;
    }

    clearDebugMessage(): void {
        this.debugServiceMessage = [];
    }

    switchDebugMode(): void {
        if (this.isDebugOn) {
            this.isDebugOn = false;
            return;
        }
        this.isDebugOn = true;
    }
}
