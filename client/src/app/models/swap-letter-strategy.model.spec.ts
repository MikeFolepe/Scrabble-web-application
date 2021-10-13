import { TestBed } from '@angular/core/testing';
import { PlayerAIComponent } from '@app/modules/game-view/components/player-ai/player-ai.component';
import { PlayerAI } from '@app/models/player-ai.model';
import { SwapLetter } from '@app/models/swap-letter-strategy.model';

describe('SwapLetter', () => {
    const id = 0;
    const name = 'Player 1';
    const letterTable = [
        { value: 'A', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
        { value: 'B', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
        { value: 'C', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
        { value: 'D', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
        { value: 'E', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
        { value: 'F', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
        { value: 'G', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
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
        spyOn(context.letterService, 'addLetterToReserve');
        swapStrategy.execute(playerAI, context);
        expect(context.swap).toHaveBeenCalledTimes(1);
    });

    /*
    it('should call skip() if there is not enough letters in the reserve to change', () => {
        spyOn(Math, 'random').and.returnValue(6);
        const spy = spyOn(context, 'skip').and.callThrough();
        context.letterService.reserve = [];

    //     swapStrategy.execute(playerAI, context);

        expect(spy).toHaveBeenCalledTimes(1);
    });
    */
});
