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
        };
        const letterB: Letter = {
            value: 'B',
            quantity: 0,
            points: 0,
        };
        const letterC: Letter = {
            value: 'C',
            quantity: 0,
            points: 0,
        };
        const letterD: Letter = {
            value: 'D',
            quantity: 0,
            points: 0,
        };
        const letterE: Letter = {
            value: 'E',
            quantity: 0,
            points: 0,
        };
        const letterWhite: Letter = {
            value: '*',
            quantity: 0,
            points: 0,
        };

        const playerEasel = [letterA, letterA, letterB, letterC, letterD, letterE, letterWhite];
        const player = new Player(1, 'Player 1', playerEasel);
        service['playerService'].addPlayer(player);
        service['letterService'].reserve = JSON.parse(JSON.stringify(RESERVE));

        spyOn(service['playerService'], 'swap');
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
        expect(service.swap(lettersToSwap, INDEX_REAL_PLAYER)).toEqual(true);
    });
    it('swapping letters that are not present in the easel should be invalid', () => {
        const letterToSwap = 'zzzzzzz';
        expect(service.swap(letterToSwap, INDEX_REAL_PLAYER)).toEqual(false);
    });
    it('swapping two elements of the easel that are the same letter should be valid', () => {
        const letterToSwap = 'aa';
        expect(service.swap(letterToSwap, INDEX_REAL_PLAYER)).toEqual(true);
    });
    it('swapping the same letter more times than it is present in the easel should be invalid', () => {
        const letterToSwap = 'aaa';
        expect(service.swap(letterToSwap, INDEX_REAL_PLAYER)).toEqual(false);
    });
});