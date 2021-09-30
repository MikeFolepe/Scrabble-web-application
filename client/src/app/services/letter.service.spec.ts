import { TestBed } from '@angular/core/testing';

import { LetterService } from './letter.service';
import { EASEL_SIZE } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';

describe('LetterService', () => {
    let service: LetterService;

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [LetterService] });
        service = TestBed.inject(LetterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should returns a letter', () => {
        const letter = service.getRandomLetter();
        expect(letter).toBeInstanceOf(Object);
        expect(letter).toBeDefined();
    });

    it('should add a letter to the reserve', () => {
        const letterTest = service.reserve[0].value;
        const INITIAL_QUANTITY = service.reserve[0].quantity;
        service.addLetterToReserve(letterTest);
        expect(service.reserve[0].quantity).toEqual(INITIAL_QUANTITY + 1);
    });

    it('should return an empty letter if reserve is empty', () => {
        // Empty reserve
        for (const letter of service.reserve) {
            letter.quantity = 0;
        }
        const letterEmpty: Letter = {
            value: '',
            quantity: 0,
            points: 0,
        };
        expect(service.getRandomLetter()).toEqual(letterEmpty);
    });

    it('should know wether the reserve is empty or not', () => {
        expect(service.isReserveEmpty()).toBeFalsy();
        // Empty reserve
        for (const letter of service.reserve) {
            letter.quantity = 0;
        }
        expect(service.isReserveEmpty()).toBeTruthy();
    });

    it('should returns enough letters to fill the easel', () => {
        const letters = service.getRandomLetters();
        expect(letters).toBeInstanceOf(Object);
        expect(letters).toBeDefined();
        expect(letters).toHaveSize(EASEL_SIZE);
    });

    it('should know how many letters left are in the easel', () => {
        const REAL_TOTAL_NUMBER = 102;
        expect(service.reserveSize()).toEqual(REAL_TOTAL_NUMBER);
        service.getRandomLetters();
        expect(service.reserveSize()).toEqual(REAL_TOTAL_NUMBER - EASEL_SIZE);
    });
});
