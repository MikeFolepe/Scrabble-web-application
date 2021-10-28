/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { TestBed } from '@angular/core/testing';
import { PlayerAIComponent } from '@app/modules/game-view/player-ai/player-ai.component';
import { LetterService } from '@app/services/letter.service';
import { PlayerAI } from './player-ai.model';
import { SwapLetter } from './swap-letter-strategy.model';

describe('SwapLetter', () => {
    let playerAI: PlayerAI;
    let swapStrategy: SwapLetter;
    let context: PlayerAIComponent;
    let letterService: LetterService;

    beforeEach(() => {
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
        // Create all dependencies
        swapStrategy = new SwapLetter();
        playerAI = new PlayerAI(id, name, letterTable);
        context = TestBed.createComponent(PlayerAIComponent).componentInstance;
        letterService = TestBed.inject(LetterService);
        // Set the dependencies
        playerAI.strategy = swapStrategy;
        playerAI.context = context;
        context.aiPlayer = playerAI;
        context.letterService = letterService;
        // Force the player to always play the same strategy instance for test purposes
        spyOn<any>(playerAI, 'setStrategy').and.returnValue(swapStrategy);
    });

    it('should create', () => {
        expect(playerAI).toBeTruthy();
        expect(swapStrategy).toBeTruthy();
        expect(context).toBeTruthy();
        expect(playerAI.strategy).toBe(swapStrategy);
    });

    // it('should attempt to swap if reserve.size >= 7', () => {
    //     const startingHand = '[ABCDEFG]';
    //     const spy = spyOn<any>(playerAI, 'replaceStrategy');
    //     spyOn<any>(letterService, 'getReserveSize').and.returnValue(7);

    // it('should be SkipTurn if there is not enough letters in the reserve to change', () => {
    //     spyOn(playerAI, 'play');

    //     context.letterService.reserve = [];
    //     playerAI.strategy = swapStrategy;
    //     swapStrategy.execute(playerAI, context);
    //     const expectedStrategy = new SkipTurn();

    //     expect(playerAI.strategy).toEqual(expectedStrategy);
    // });
});
