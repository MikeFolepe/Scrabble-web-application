/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { INDEX_REAL_PLAYER, RESERVE } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { Player } from '@app/models/player.model';
import { SwapLetterService } from './swap-letter.service';

describe('SwapLetterService', () => {
    let service: SwapLetterService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SwapLetterService);

        const letterA: Letter = {
            value: 'A',
            quantity: 0,
            points: 0,
            isSelectedForSwap: false,
            isSelectedForManipulation: false,
        };
        const letterB: Letter = {
            value: 'B',
            quantity: 0,
            points: 0,
            isSelectedForSwap: false,
            isSelectedForManipulation: false,
        };
        const letterC: Letter = {
            value: 'C',
            quantity: 0,
            points: 0,
            isSelectedForSwap: false,
            isSelectedForManipulation: false,
        };
        const letterD: Letter = {
            value: 'D',
            quantity: 0,
            points: 0,
            isSelectedForSwap: false,
            isSelectedForManipulation: false,
        };
        const letterE: Letter = {
            value: 'E',
            quantity: 0,
            points: 0,
            isSelectedForSwap: false,
            isSelectedForManipulation: false,
        };
        const letterWhite: Letter = {
            value: '*',
            quantity: 0,
            points: 0,
            isSelectedForSwap: false,
            isSelectedForManipulation: false,
        };

        const playerEasel = [letterA, letterA, letterB, letterC, letterD, letterE, letterWhite];
        const player = new Player(1, 'Player 1', playerEasel);
        service['playerService'].addPlayer(player);
        service['letterService'].reserve = JSON.parse(JSON.stringify(RESERVE));

        spyOn(service['playerService'], 'removeLetter');
        spyOn(service['playerService'], 'addEaselLetterToReserve');
        spyOn(service['playerService'], 'refillEasel');
        spyOn(service, 'lettersToSwapIntoIndexes');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('reserve should have enough letters to swap', () => {
        expect(service.reserveHasEnoughLetters()).toEqual(true);
    });
    it('an empty reserve should not have enough letters to swap', () => {
        const initReserveSize: number = service['letterService'].getReserveSize();
        // Emptying the reserve
        for (let i = 0; i < initReserveSize; i++) {
            service['letterService'].getRandomLetter();
        }
        expect(service.reserveHasEnoughLetters()).toEqual(false);
    });
    it('swapping letters present in the easel should be valid', () => {
        const lettersToSwap = 'abcde';
        expect(service.swapCommand(lettersToSwap, INDEX_REAL_PLAYER)).toEqual(true);
    });
    it('swapping letters that are not present in the easel should be invalid', () => {
        const lettersToSwap = 'zzzzzzz';
        expect(service.swapCommand(lettersToSwap, INDEX_REAL_PLAYER)).toEqual(false);
    });
    it('swapping two elements of the easel that are the same letter should be valid', () => {
        const lettersToSwap = 'aa';
        expect(service.swapCommand(lettersToSwap, INDEX_REAL_PLAYER)).toEqual(true);
    });
    it('swapping the same letter more times than it is present in the easel should be invalid', () => {
        const lettersToSwap = 'aaa';
        expect(service.swapCommand(lettersToSwap, INDEX_REAL_PLAYER)).toEqual(false);
    });
});
