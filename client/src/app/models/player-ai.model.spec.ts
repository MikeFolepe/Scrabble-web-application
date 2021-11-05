/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerAIService } from '@app/services/player-ia.service';
import { PlayerAI } from './player-ai.model';

describe('PlayerAI', () => {
    const letterTable = [
        { value: 'A', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
        { value: 'B', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
        { value: 'C', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
        { value: 'E', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
        { value: 'E', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
        { value: 'E', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
        { value: 'G', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false },
    ];
    let playerAi: PlayerAI;
    let playerAiService: PlayerAIService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        playerAi = new PlayerAI(0, 'name', letterTable, playerAiService);
        playerAiService = TestBed.inject(PlayerAIService);
    });

    it('should create an instance', () => {
        expect(playerAi).toBeTruthy();
        expect(playerAiService).toBeTruthy();
        expect(playerAi['strategy']).toBeTruthy();
    });

    it('should have a scoring range', () => {
        spyOn<any>(playerAi, 'generateRandomNumber').and.returnValues(0, 1, 4, 22);
        expect(playerAi['pointingRange']()).toEqual({ min: 1, max: 6 });
        expect(playerAi['pointingRange']()).toEqual({ min: 7, max: 12 });
        expect(playerAi['pointingRange']()).toEqual({ min: 13, max: 18 });
        expect(playerAi['pointingRange']()).toEqual({ min: 0, max: 0 });
    });

    it('should return a random number between 0 and a given number', () => {
        let MAX_VALUE = 3;
        for (let i = 0; i < 10; i++) {
            const result = playerAi['generateRandomNumber'](MAX_VALUE);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(MAX_VALUE);
        }
        MAX_VALUE = 10;
        for (let i = 0; i < 10; i++) {
            const result = playerAi['generateRandomNumber'](MAX_VALUE);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(MAX_VALUE);
        }
    });

    it('should call the right functions when calling play()', () => {
        const spyOnExecute = spyOn(playerAi['strategy'], 'execute');
        playerAi.play();
        expect(spyOnExecute).toHaveBeenCalledTimes(1);
    });

    it('should return playerHand formatted', () => {
        const playerHandFormated = '[ABCEEEG]';
        expect(playerAi.getHand()).toEqual(playerHandFormated);
    });

    it('should return quantity of present letter', () => {
        expect(playerAi.playerQuantityOf('A')).toEqual(1);
    });

    it('should return quantity of no present letter', () => {
        expect(playerAi.playerQuantityOf('H')).toEqual(0);
    });

    it('should return quantity of multiple letter', () => {
        expect(playerAi.playerQuantityOf('E')).toEqual(3);
    });

    it('should return quantity of letter with case insentivity', () => {
        expect(playerAi.playerQuantityOf('e')).toEqual(3);
    });
});
