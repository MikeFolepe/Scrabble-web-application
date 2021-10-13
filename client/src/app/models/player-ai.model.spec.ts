/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { PlayerAIComponent } from '@app/modules/game-view/components/player-ai/player-ai.component';
import { PlaceLetters } from './place-letter-strategy.model';
import { PlayerAI } from './player-ai.model';
import { SkipTurn } from './skip-turn-strategy.model';
import { SwapLetter } from './swap-letter-strategy.model';

describe('PlayerAI', () => {
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

    beforeEach(() => {
        playerAI = new PlayerAI(id, name, letterTable);
    });

    it('should create an instance', () => {
        expect(playerAI).toBeTruthy();
    });

    it('should set the respective strategy based on random numbers', () => {
        const RANDOM_NUMBER_1 = 0;
        const RANDOM_NUMBER_2 = 3;
        const RANDOM_NUMBER_3 = 5;
        const RANDOM_NUMBER_4 = 22;
        spyOn(playerAI, 'pointingRange').and.returnValue({ min: 0, max: 6 });

        spyOn(playerAI, 'generateRandomNumber').and.returnValue(RANDOM_NUMBER_1);
        playerAI['setStrategy']();
        expect(playerAI.strategy).toBeInstanceOf(PlaceLetters);

        playerAI.generateRandomNumber = jasmine.createSpy().and.returnValue(RANDOM_NUMBER_2);
        playerAI['setStrategy']();
        expect(playerAI.strategy).toBeInstanceOf(SkipTurn);

        playerAI.generateRandomNumber = jasmine.createSpy().and.returnValue(RANDOM_NUMBER_3);
        playerAI['setStrategy']();
        expect(playerAI.strategy).toBeInstanceOf(SwapLetter);

        playerAI.generateRandomNumber = jasmine.createSpy().and.returnValue(RANDOM_NUMBER_4);
        playerAI['setStrategy']();
        expect(playerAI.strategy).toBeInstanceOf(SkipTurn);
    });

    it('should have a scoring range', () => {
        const RANDOM_NUMBER_1 = 0;
        const RANDOM_NUMBER_2 = 1;
        const RANDOM_NUMBER_3 = 4;
        const RANDOM_NUMBER_4 = 22;
        spyOn(playerAI, 'generateRandomNumber').and.returnValues(RANDOM_NUMBER_1, RANDOM_NUMBER_2, RANDOM_NUMBER_3, RANDOM_NUMBER_4);

        expect(playerAI['pointingRange']()).toEqual({ min: 0, max: 6 });
        expect(playerAI['pointingRange']()).toEqual({ min: 7, max: 12 });
        expect(playerAI['pointingRange']()).toEqual({ min: 13, max: 18 });
        expect(playerAI['pointingRange']()).toEqual({ min: 0, max: 0 });
    });

    it('should return a random number between 0 and a give number', () => {
        const MAX_VALUE_1 = 3;
        const MAX_VALUE_2 = 10;
        const MAX_INDEX = 10;
        for (let i = 0; i < MAX_INDEX; i++) {
            const result = playerAI['generateRandomNumber'](MAX_VALUE_1);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(MAX_VALUE_1);
        }

        for (let i = 0; i < MAX_INDEX; i++) {
            const result = playerAI['generateRandomNumber'](MAX_VALUE_2);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(MAX_VALUE_2);
        }
    });

    it('should call the right functions when calling play()', () => {
        spyOn(playerAI.strategy, 'execute');
        spyOn(playerAI, 'setStrategy');

        playerAI.play();

        expect(playerAI.strategy.execute).toHaveBeenCalledTimes(1);
        expect(playerAI['setStrategy']).toHaveBeenCalledTimes(1);
    });

    it('should set the right context when setContext() is called', () => {
        const context: PlayerAIComponent = TestBed.createComponent(PlayerAIComponent).componentInstance;
        playerAI.setContext(context);
        expect(playerAI.context).toEqual(context);
    });
});
