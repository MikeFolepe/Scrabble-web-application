/* eslint-disable dot-notation */
import { PlayStrategy } from '@app/models/abstract-strategy.model';
import { SkipTurn } from '@app/models/skip-turn-strategy.model';
import { TestBed } from '@angular/core/testing';

describe('Abstract Strategy', () => {
    let strategy: PlayStrategy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayStrategy],
        }).compileComponents();
        strategy = new SkipTurn();
    });

    it('should create an instance', () => {
        expect(strategy).toBeTruthy();
    });

    it('should return a random number in the specified range', () => {
        let MAX_VALUE = 35;
        const NB_TESTS = 1000;
        for (let i = 0; i < NB_TESTS; i++) {
            const result = strategy['generateRandomNumber'](MAX_VALUE);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(MAX_VALUE);
        }
        MAX_VALUE = 1;
        for (let i = 0; i < NB_TESTS; i++) {
            const result = strategy['generateRandomNumber'](MAX_VALUE);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(MAX_VALUE);
        }
    });
});
