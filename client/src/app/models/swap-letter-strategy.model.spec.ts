/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { SkipTurn } from '@app/models/skip-turn-strategy.model';
import { PlayerAIComponent } from '@app/modules/game-view/player-ai/player-ai.component';
import { PlayerAI } from '@app/models/player-ai.model';
import { SwapLetter } from '@app/models/swap-letter-strategy.model';

describe('SwapLetter', () => {
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
    let swapStrategy: SwapLetter;
    let context: PlayerAIComponent;

    beforeEach(() => {
        playerAI = new PlayerAI(id, name, letterTable);
        swapStrategy = new SwapLetter();
        context = TestBed.createComponent(PlayerAIComponent).componentInstance;
    });

    it('should create', () => {
        expect(swapStrategy).toBeTruthy();
    });

    it('should call the right function when execute() is called', () => {
        spyOn(context, 'swap');
        spyOn<any>(context.letterService, 'addLetterToReserve');
        swapStrategy.execute(playerAI, context);
        expect(context.swap).toHaveBeenCalledTimes(1);
    });

    it('should be SkipTurn if there is not enough letters in the reserve to change', () => {
        spyOn(playerAI, 'play');

        context.letterService.reserve = [];
        playerAI.strategy = swapStrategy;
        swapStrategy.execute(playerAI, context);
        const expectedStrategy = new SkipTurn();

        expect(playerAI.strategy).toEqual(expectedStrategy);
    });
});
