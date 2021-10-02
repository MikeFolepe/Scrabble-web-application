/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { INDEX_REAL_PLAYER, RESERVE } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { Player } from '@app/models/player.model';
import { SwapLetterComponent } from './swap-letter.component';

describe('SwapLetterComponent', () => {
    let component: SwapLetterComponent;
    let fixture: ComponentFixture<SwapLetterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SwapLetterComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SwapLetterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

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
        component['playerService'].addPlayer(player);

        component['letterService'].reserve = JSON.parse(JSON.stringify(RESERVE));
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('reserve should have enough letters to swap', () => {
        expect(component.reserveHasEnoughLetters()).toEqual(true);
    });
    it('an empty reserve should not have enough letters to swap', () => {
        const initReserveSize: number = component['letterService'].getReserveSize();
        // Emptying the reserve
        for (let i = 0; i < initReserveSize; i++) {
            component['letterService'].getRandomLetter();
        }
        expect(component.reserveHasEnoughLetters()).toEqual(false);
    });
    it('swapping letters present in the easel should be valid', () => {
        spyOn(component['playerService'], 'swap');
        const lettersToSwap = 'abcde';
        expect(component.swap(lettersToSwap, INDEX_REAL_PLAYER)).toEqual(true);
    });
    it('swapping letters that are not present in the easel should be invalid', () => {
        spyOn(component['playerService'], 'swap');
        const letterToSwap = 'zzzzzzz';
        expect(component.swap(letterToSwap, INDEX_REAL_PLAYER)).toEqual(false);
    });
    it('swapping two elements of the easel that are the same letter should be valid', () => {
        spyOn(component['playerService'], 'swap');
        const letterToSwap = 'aa';
        expect(component.swap(letterToSwap, INDEX_REAL_PLAYER)).toEqual(true);
    });
    it('swapping the same letter more times than it is present in the easel should be invalid', () => {
        spyOn(component['playerService'], 'swap');
        const letterToSwap = 'aaa';
        expect(component.swap(letterToSwap, INDEX_REAL_PLAYER)).toEqual(false);
    });
});
