/* eslint-disable dot-notation */
// import { TestBed } from '@angular/core/testing';
// import { EASEL_SIZE, RESERVE } from '@app/classes/constants';
// import { Letter } from '@app/classes/letter';
// import { LetterService } from './letter.service';

// describe('LetterService', () => {
//     let service: LetterService;

//     beforeEach(() => {
//         TestBed.configureTestingModule({ providers: [LetterService] });
//         service = TestBed.inject(LetterService);
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

//     it('should returns a letter', () => {
//         const letter = service.getRandomLetter();
//         expect(letter).toBeInstanceOf(Object);
//         expect(letter).toBeDefined();
//     });

//     it('should add a letter to the reserve', () => {
//         const letterTest = service.reserve[0].value;
//         const initialQuantity = service.reserve[0].quantity;
//         service.addLetterToReserve(letterTest);
//         expect(service.reserve[0].quantity).toEqual(initialQuantity + 1);
//     });

//     it('should not add a letter to the reserve if this one does not exists', () => {
//         const letterTest = '-';
//         service.addLetterToReserve(letterTest);
//         expect(service.reserve).toEqual(RESERVE);
//     });

//     it('should return an empty letter if reserve is empty', () => {
//         // Empty reserve
//         service.reserve = [];
//         const letterEmpty: Letter = {
//             value: '',
//             quantity: 0,
//             points: 0,
//         };
//         expect(service.getRandomLetter()).toEqual(letterEmpty);
//     });

//     it('should know wether the reserve is empty or not', () => {
//         expect(service.isReserveEmpty()).toBeFalsy();
//         // Empty reserve
//         for (const letter of service.reserve) {
//             letter.quantity = 0;
//         }
//         expect(service.isReserveEmpty()).toBeTruthy();
//     });

//     it('should returns enough letters to fill the easel', () => {
//         const letters = service.getRandomLetters();
//         expect(letters).toBeInstanceOf(Object);
//         expect(letters).toBeDefined();
//         expect(letters).toHaveSize(EASEL_SIZE);
//     });

// it('should return right reserve size', () => {
//     const REAL_TOTAL_NUMBER = 102;
//     expect(service.getReserveSize()).toEqual(REAL_TOTAL_NUMBER);
//     service.reserve[0].quantity--;
//     expect(service.getReserveSize()).toEqual(REAL_TOTAL_NUMBER - 1);
//     service.reserve = [];
//     const emptyQuantity = 0;
//     expect(service.getReserveSize()).toEqual(emptyQuantity);
// });

// it('should change function when updateReserve() is called', () => {
//     let number = 1;
//     const fn = () => {
//         number = number *= 2;
//         return;
//     };
//     service.updateView(fn);
//     expect(service['func']).toBe(fn);
// });

// it('should write message when writeMessage() is called', () => {
//     let number = 1;
//     const message = 'test message';
//     service['func'] = () => {
//         number = number *= 2;
//         return;
//     };
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const funcSpy = spyOn<any>(service, 'func');
//     service.writeMessage(message);
//     expect(funcSpy).toHaveBeenCalled();
// });
// });
