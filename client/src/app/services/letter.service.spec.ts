import { TestBed } from '@angular/core/testing';

import { LetterService } from './letter.service';
import { EASEL_SIZE, RESERVE } from '@app/classes/constants';
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
        const initial_quantity = service.reserve[0].quantity;
        service.addLetterToReserve(letterTest);
        expect(service.reserve[0].quantity).toEqual(initial_quantity + 1);
    });

    it('should not add a letter to the reserve if this one does not exists', () => {
        const letterTest = '-';
        service.addLetterToReserve(letterTest);
        expect(service.reserve).toEqual(RESERVE);
    });

    it('should return an empty letter if reserve is empty', () => {
        // Empty reserve
        service.reserve = [];
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
        service.reserve = [];
        expect(service.isReserveEmpty()).toBeTruthy();
    });

    it('should returns enough letters to fill the easel', () => {
        const letters = service.getRandomLetters();
        expect(letters).toBeInstanceOf(Object);
        expect(letters).toBeDefined();
        expect(letters).toHaveSize(EASEL_SIZE);
    });

    it('should return right reserve size', () => {
        const REAL_TOTAL_NUMBER = 102;
        expect(service.getReserveSize()).toEqual(REAL_TOTAL_NUMBER);
        service.reserve[0].quantity--;
        expect(service.getReserveSize()).toEqual(REAL_TOTAL_NUMBER - 1);
        service.reserve = [];
        let emptyQuantity: number = 0;
        expect(service.getReserveSize()).toEqual(emptyQuantity);
    });

    it('should call updated func when changing message', () => {
        let number:number = 1;
        let message: string = 'test message';
        let fn = () => {
            number = number*=2; 
            return;
        }
        service.updateReserve(fn);
        expect(service['func']).toBe(fn);
        let funcSpy =  spyOn<any>(service, 'func');
        service.writeMessage(message);
        expect(funcSpy).toHaveBeenCalled();
    });
});
