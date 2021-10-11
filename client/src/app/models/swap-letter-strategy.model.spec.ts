/* eslint-disable @typescript-eslint/no-magic-numbers */
// import { TestBed } from '@angular/core/testing';
// import { PlayerIAComponent } from '@app/modules/game-view/components/player-ia/player-ia.component';
// import { PlayerIA } from './player-ia.model';
import { TestBed } from '@angular/core/testing';
import { PlayerAIComponent } from '@app/modules/game-view/components/player-ia/player-ia.component';
import { PlayerIA } from './player-ia.model';
import { SwapLetter } from './swap-letter-strategy.model';

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

    let playerIA: PlayerIA;
    let swapStrategy: SwapLetter;
    let context: PlayerAIComponent;

    beforeEach(() => {
        playerIA = new PlayerIA(id, name, letterTable);
        swapStrategy = new SwapLetter();
        context = TestBed.createComponent(PlayerAIComponent).componentInstance;
    });

    it('should create', () => {
        expect(swapStrategy).toBeTruthy();
    });

    it('should call the right function when execute() is called', () => {
        spyOn(context, 'swap');
        spyOn(context.letterService, 'addLetterToReserve');
        swapStrategy.execute(playerIA, context);
        expect(context.swap).toHaveBeenCalledTimes(1);
    });

    // it('should call skip() if there is not enough letters in the reserve to change', () => {
    //     spyOn(Math, 'random').and.returnValue(6);
    //     spyOn(context, 'skip');

    //     context.letterService.reserve = [];

    //     swapStrategy.execute(playerIA, context);

    //     expect(context.skip).toHaveBeenCalledTimes(1);
    // });
});
