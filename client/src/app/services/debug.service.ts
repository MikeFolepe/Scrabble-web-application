import { Injectable } from '@angular/core';
import { PlayerService } from './player.service';

@Injectable({
    providedIn: 'root',
})
export class DebugService {
    debugServiceMessage: { word: string; nbPt: number }[];
    debugActivate: string[] = [];

    constructor(public playerService: PlayerService) {}
    receiveAIDebugmessage(table: { word: string; nbPt: number }[]): void {
        this.debugServiceMessage = table;
    }

    clearDebugMessage(): void {
        this.debugServiceMessage = [];
    }

    isDebugOn(): boolean {
        if (this.debugActivate.length % 2 === 0) {
            return false;
        } else {
            return true;
        }
    }
}
