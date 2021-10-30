import { PlayerAIService } from '@app/services/player-ia.service';
export abstract class PlayStrategy {
    protected generateRandomNumber(maxValue: number): number {
        return Math.floor(Number(Math.random()) * maxValue);
    }
    abstract execute(playerAiService: PlayerAIService): void;
}
