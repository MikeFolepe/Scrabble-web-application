import { PlayerAI } from '@app/models/player-ai.model';
import { PlayerAIComponent } from '@app/modules/game-view/components/player-ai/player-ai.component';
export abstract class PlayStrategy {
    protected generateRandomNumber(maxValue: number): number {
        return Math.floor(Number(Math.random()) * maxValue);
    }
    abstract execute(player: PlayerAI, context: PlayerAIComponent): void;
}
