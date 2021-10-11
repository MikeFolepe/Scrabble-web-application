/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { PlayerIAComponent } from '@app/modules/game-view/components/player-ia/player-ia.component';
import { PlaceLetters } from './place-letter-strategy.model';
import { PlayerIA } from './player-ia.model';
import { SkipTurn } from './skip-turn-strategy.model';
import { SwapLetter } from './swap-letter-strategy.model';

describe('PlayerIA', () => {
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

    beforeEach(() => {
        playerIA = new PlayerIA(id, name, letterTable);
    });

    it('should create an instance', () => {
        expect(playerIA).toBeTruthy();
    });

    it('should set the respective strategy based on random numbers', () => {
        const RANDOM_NUMBER_1 = 0;
        const RANDOM_NUMBER_2 = 3;
        const RANDOM_NUMBER_3 = 5;
        const RANDOM_NUMBER_4 = 22;
        spyOn(playerIA, 'pointingRange').and.returnValue({ min: 0, max: 6 });

        spyOn(playerIA, 'generateRandomNumber').and.returnValue(RANDOM_NUMBER_1);
        playerIA['setStrategy']();
        expect(playerIA.strategy).toBeInstanceOf(PlaceLetters);

        playerIA.generateRandomNumber = jasmine.createSpy().and.returnValue(RANDOM_NUMBER_2);
        playerIA['setStrategy']();
        expect(playerIA.strategy).toBeInstanceOf(SkipTurn);

        playerIA.generateRandomNumber = jasmine.createSpy().and.returnValue(RANDOM_NUMBER_3);
        playerIA['setStrategy']();
        expect(playerIA.strategy).toBeInstanceOf(SwapLetter);

        playerIA.generateRandomNumber = jasmine.createSpy().and.returnValue(RANDOM_NUMBER_4);
        playerIA['setStrategy']();
        expect(playerIA.strategy).toBeInstanceOf(SkipTurn);
    });

    it('should have a scoring range', () => {
        const RANDOM_NUMBER_1 = 0;
        const RANDOM_NUMBER_2 = 1;
        const RANDOM_NUMBER_3 = 4;
        const RANDOM_NUMBER_4 = 22;
        spyOn(playerIA, 'generateRandomNumber').and.returnValues(RANDOM_NUMBER_1, RANDOM_NUMBER_2, RANDOM_NUMBER_3, RANDOM_NUMBER_4);

        expect(playerIA['pointingRange']()).toEqual({ min: 0, max: 6 });
        expect(playerIA['pointingRange']()).toEqual({ min: 7, max: 12 });
        expect(playerIA['pointingRange']()).toEqual({ min: 13, max: 18 });
        expect(playerIA['pointingRange']()).toEqual({ min: 0, max: 0 });
    });

    it('should return a random number between 0 and a give number', () => {
        const MAX_VALUE_1 = 3;
        const MAX_VALUE_2 = 10;
        const MAX_INDEX = 10;
        for (let i = 0; i < MAX_INDEX; i++) {
            const result = playerIA['generateRandomNumber'](MAX_VALUE_1);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(MAX_VALUE_1);
        }

        for (let i = 0; i < MAX_INDEX; i++) {
            const result = playerIA['generateRandomNumber'](MAX_VALUE_2);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(MAX_VALUE_2);
        }
    });

    it('should call the right functions when calling play()', () => {
        spyOn(playerIA.strategy, 'execute');
        spyOn(playerIA, 'setStrategy');

        playerIA.play();

        expect(playerIA.strategy.execute).toHaveBeenCalledTimes(1);
        expect(playerIA['setStrategy']).toHaveBeenCalledTimes(1);
    });

    it('should set the right context when setContext() is called', () => {
        const context: PlayerIAComponent = TestBed.createComponent(PlayerIAComponent).componentInstance;
        playerIA.setContext(context);
        expect(playerIA.context).toEqual(context);
    });
});
