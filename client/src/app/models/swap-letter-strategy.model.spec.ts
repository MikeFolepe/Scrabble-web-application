/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { SkipTurn } from '@app/models/skip-turn-strategy.model';
import { PlayerAIComponent } from '@app/modules/game-view/components/player-ai/player-ai.component';
import { PlayerAI } from '@app/models/player-ai.model';
import { SwapLetter } from '@app/models/swap-letter-strategy.model';
import { RESERVE } from '@app/classes/constants';

describe('SwapLetter', () => {
    const id = 0;
    const name = 'Player 1';

    const letterA = RESERVE[0];
    const letterB = RESERVE[1];
    const letterC = RESERVE[2];
    const letterD = RESERVE[3];
    const letterE = RESERVE[4];
    const letterF = RESERVE[5];
    const letterG = RESERVE[6];
    const letterTable = [letterA, letterB, letterC, letterD, letterE, letterF, letterG];

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
