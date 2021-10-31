import { TestBed } from '@angular/core/testing';
import { EASEL_SIZE } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { LetterService } from './letter.service';

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
        const initialQuantity = service.reserve[0].quantity;
        service.addLetterToReserve(service.reserve[0].value);
        expect(service.reserve[0].quantity).toEqual(initialQuantity + 1);
    });

    it('should not change reserve state if parameter is not a letter', () => {
        const reserveCopy: Letter[] = JSON.parse(JSON.stringify(service.reserve));
        service.addLetterToReserve('!');
        expect(service.reserve).toEqual(reserveCopy);
    });

    it('should returns enough letters to fill the easel', () => {
        const letters = service.getRandomLetters();
        expect(letters).toBeInstanceOf(Object);
        expect(letters).toBeDefined();
        expect(letters).toHaveSize(EASEL_SIZE);
    });

    it('should return an empty letter when getRandomLetter() is called and reserve is empty', () => {
        service.reserve = [];
        service.reserveSize = 0;
        const letterEmpty: Letter = {
            value: '',
            quantity: 0,
            points: 0,
            isSelectedForSwap: false,
            isSelectedForManipulation: false,
        };
        expect(service.getRandomLetter()).toEqual(letterEmpty);
    });
});
