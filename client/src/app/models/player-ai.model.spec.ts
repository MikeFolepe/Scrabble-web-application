/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { PlaceLetters } from '@app/models/place-letter-strategy.model';
import { PlayerAI } from '@app/models/player-ai.model';
import { SkipTurn } from '@app/models/skip-turn-strategy.model';
import { SwapLetter } from '@app/models/swap-letter-strategy.model';
import { PlayerAIComponent } from '@app/modules/game-view/components/player-ai/player-ai.component';

describe('PlayerAI', () => {
    const id = 1;
    const name = 'PlayerAI';
    const letterTable = [
        { value: 'A', quantity: 0, points: 0 },
        { value: 'B', quantity: 0, points: 0 },
        { value: 'C', quantity: 0, points: 0 },
        { value: 'E', quantity: 0, points: 0 },
        { value: 'E', quantity: 0, points: 0 },
        { value: 'E', quantity: 0, points: 0 },
        { value: 'G', quantity: 0, points: 0 },
    ];

    let playerAI: PlayerAI;

    beforeEach(() => {
        playerAI = new PlayerAI(id, name, letterTable);
    });

    it('should create an instance', () => {
        expect(playerAI).toBeTruthy();
    });

    it('should set a strategy', () => {
        spyOn<any>(playerAI, 'generateRandomNumber').and.returnValues(0, 3, 5, 22);
        spyOn<any>(playerAI, 'pointingRange').and.returnValue({ min: 1, max: 6 });

        playerAI['setStrategy']();
        expect(playerAI.strategy).toBeInstanceOf(PlaceLetters);
        playerAI['setStrategy']();
        expect(playerAI.strategy).toBeInstanceOf(SkipTurn);
        playerAI['setStrategy']();
        expect(playerAI.strategy).toBeInstanceOf(SwapLetter);
        playerAI['setStrategy']();
        expect(playerAI.strategy).toBeInstanceOf(SkipTurn);
    });

    it('should have a scoring range', () => {
        spyOn<any>(playerAI, 'generateRandomNumber').and.returnValues(0, 1, 4, 22);
        expect(playerAI['pointingRange']()).toEqual({ min: 1, max: 6 });
        expect(playerAI['pointingRange']()).toEqual({ min: 7, max: 12 });
        expect(playerAI['pointingRange']()).toEqual({ min: 13, max: 18 });
        expect(playerAI['pointingRange']()).toEqual({ min: 0, max: 0 });
    });

    it('should return a random number between 0 and a give number', () => {
        let MAX_VALUE = 3;
        for (let i = 0; i < 10; i++) {
            const result = playerAI['generateRandomNumber'](MAX_VALUE);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(MAX_VALUE);
        }

        MAX_VALUE = 10;
        for (let i = 0; i < 10; i++) {
            const result = playerAI['generateRandomNumber'](MAX_VALUE);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(MAX_VALUE);
        }
    });

    it('should call the right functions when calling play()', () => {
        spyOn<any>(playerAI.strategy, 'execute');
        spyOn<any>(playerAI, 'setStrategy');

        playerAI.play();

        expect(playerAI.strategy.execute).toHaveBeenCalledTimes(1);
        expect(playerAI['setStrategy']).toHaveBeenCalledTimes(1);
    });

    it('should set the right context when setContext() is called', () => {
        const context: PlayerAIComponent = TestBed.createComponent(PlayerAIComponent).componentInstance;
        playerAI.setContext(context);
        expect(playerAI.context).toEqual(context);
    });

    it('should change strategy and play it', () => {
        const spy = spyOn<any>(playerAI, 'play');
        const newStrategy = new SkipTurn();

        playerAI.replaceStrategy(newStrategy);

        expect(playerAI.strategy).toBe(newStrategy);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should return playerHand formatted', () => {
        const playerHandFormated = '[ABCEEEG]';

        expect(playerAI.getHand()).toEqual(playerHandFormated);
    });

    it('should return quantity of present letter', () => {
        expect(playerAI.playerQuantityOf('A')).toEqual(1);
    });

    it('should return quantity of no present letter', () => {
        expect(playerAI.playerQuantityOf('H')).toEqual(0);
    });

    it('should return quantity of multiple letter', () => {
        expect(playerAI.playerQuantityOf('E')).toEqual(3);
    });

    it('should return quantity of letter with case insentivity', () => {
        expect(playerAI.playerQuantityOf('e')).toEqual(3);
    });
});
