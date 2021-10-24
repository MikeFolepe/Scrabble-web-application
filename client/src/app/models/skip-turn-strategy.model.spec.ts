import { TestBed } from '@angular/core/testing';
import { PlayerAIComponent } from '@app/modules/game-view/player-ai/player-ai.component';
import { PlayerAI } from './player-ai.model';
import { SkipTurn } from './skip-turn-strategy.model';

describe('SkipTurn', () => {
    const id = 0;
    const name = 'Player 1';
    const letterTable = [
        { value: 'A', quantity: 0, points: 0 },
        { value: 'B', quantity: 0, points: 0 },
        { value: 'C', quantity: 0, points: 0 },
        { value: 'D', quantity: 0, points: 0 },
        { value: 'E', quantity: 0, points: 0 },
        { value: 'F', quantity: 0, points: 0 },
        { value: 'G', quantity: 0, points: 0 },
    ];

    let playerAI: PlayerAI;
    let skipStrategy: SkipTurn;

    beforeEach(() => {
        playerAI = new PlayerAI(id, name, letterTable);
        skipStrategy = new SkipTurn();
    });

    it('should create', () => {
        expect(skipStrategy).toBeTruthy();
    });

    it('should call the right function when execute() is called', () => {
        const context: PlayerAIComponent = TestBed.createComponent(PlayerAIComponent).componentInstance;
        spyOn(context, 'skip');
        skipStrategy.execute(playerAI, context);
        expect(context.skip).toHaveBeenCalledTimes(1);
    });
});
