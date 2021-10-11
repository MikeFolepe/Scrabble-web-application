// /* eslint-disable @typescript-eslint/no-magic-numbers */
// /* eslint-disable dot-notation */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { TestBed } from '@angular/core/testing';
// import { PlayerIAComponent } from '@app/modules/game-view/components/player-ia/player-ia.component';
// import { PlaceLetters } from './place-letter-strategy.model';
// import { PlayerIA } from './player-ia.model';
// import { SkipTurn } from './skip-turn-strategy.model';
// import { SwapLetter } from './swap-letter-strategy.model';

// describe('PlayerIA', () => {
//     const id = 0;
//     const name = 'Player 1';
//     const letterTable = [
//         { value: 'A', quantity: 0, points: 0 },
//         { value: 'B', quantity: 0, points: 0 },
//         { value: 'C', quantity: 0, points: 0 },
//         { value: 'D', quantity: 0, points: 0 },
//         { value: 'E', quantity: 0, points: 0 },
//         { value: 'F', quantity: 0, points: 0 },
//         { value: 'G', quantity: 0, points: 0 },
//     ];

//     let playerIA: PlayerIA;

//     beforeEach(() => {
//         playerIA = new PlayerIA(id, name, letterTable);
//     });

//     it('should create an instance', () => {
//         expect(playerIA).toBeTruthy();
//     });

//     it('should set a strategy', () => {
//         spyOn<any>(playerIA, 'generateRandomNumber').and.returnValues(0, 3, 5, 22);
//         spyOn<any>(playerIA, 'pointingRange').and.returnValue({ min: 0, max: 6 });

//         playerIA['setStrategy']();
//         expect(playerIA.strategy).toBeInstanceOf(PlaceLetters);
//         playerIA['setStrategy']();
//         expect(playerIA.strategy).toBeInstanceOf(SkipTurn);
//         playerIA['setStrategy']();
//         expect(playerIA.strategy).toBeInstanceOf(SwapLetter);
//         playerIA['setStrategy']();
//         expect(playerIA.strategy).toBeInstanceOf(SkipTurn);
//     });

//     it('should have a scoring range', () => {
//         spyOn<any>(playerIA, 'generateRandomNumber').and.returnValues(0, 1, 4, 22);

//         expect(playerIA['pointingRange']()).toEqual({ min: 0, max: 6 });
//         expect(playerIA['pointingRange']()).toEqual({ min: 7, max: 12 });
//         expect(playerIA['pointingRange']()).toEqual({ min: 13, max: 18 });
//         expect(playerIA['pointingRange']()).toEqual({ min: 0, max: 0 });
//     });

//     it('should return a random number between 0 and a give number', () => {
//         let MAX_VALUE = 3;
//         for (let i = 0; i < 10; i++) {
//             const result = playerIA['generateRandomNumber'](MAX_VALUE);
//             expect(result).toBeGreaterThanOrEqual(0);
//             expect(result).toBeLessThan(MAX_VALUE);
//         }

//         MAX_VALUE = 10;
//         for (let i = 0; i < 10; i++) {
//             const result = playerIA['generateRandomNumber'](MAX_VALUE);
//             expect(result).toBeGreaterThanOrEqual(0);
//             expect(result).toBeLessThan(MAX_VALUE);
//         }
//     });

//     it('should call the right functions when calling play()', () => {
//         spyOn<any>(playerIA.strategy, 'execute');
//         spyOn<any>(playerIA, 'setStrategy');

//         playerIA.play();

//         expect(playerIA.strategy.execute).toHaveBeenCalledTimes(1);
//         expect(playerIA['setStrategy']).toHaveBeenCalledTimes(1);
//     });

//     it('should set the right context when setContext() is called', () => {
//         const context: PlayerIAComponent = TestBed.createComponent(PlayerIAComponent).componentInstance;
//         playerIA.setContext(context);
//         expect(playerIA.context).toEqual(context);
//     });
// });
