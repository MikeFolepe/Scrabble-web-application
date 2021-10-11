import { TestBed } from '@angular/core/testing';
import { PlayerIAComponent } from '@app/modules/game-view/components/player-ia/player-ia.component';
import { PlayerIA } from '@app/models/player-ia.model';
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

    let playerIA: PlayerIA;
    let swapStrategy: SwapLetter;
    let context: PlayerIAComponent;

    beforeEach(() => {
        playerIA = new PlayerIA(id, name, letterTable);
        swapStrategy = new SwapLetter();
        context = TestBed.createComponent(PlayerIAComponent).componentInstance;
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

    /*
    it('should call skip() if there is not enough letters in the reserve to change', () => {
        spyOn(Math, 'random').and.returnValue(6);
        const spy = spyOn(context, 'skip').and.callThrough();
        context.letterService.reserve = [];

    //     swapStrategy.execute(playerIA, context);

        expect(spy).toHaveBeenCalledTimes(1);
    });
    */
});
