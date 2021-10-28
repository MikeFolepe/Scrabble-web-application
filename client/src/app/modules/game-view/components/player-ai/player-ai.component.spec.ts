// /* eslint-disable @typescript-eslint/no-unused-expressions /
// / eslint-disable @typescript-eslint/no-explicit-any */
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { BOARD_COLUMNS, BOARD_ROWS } from '@app/classes/constants';
// import { Letter } from '@app/classes/letter';
// import { PlayerIA } from '@app/models/player-ia.model';
// //import { PassTurnService } from '@app/services/pass-turn.service';
// //import { TourService } from '@app/services/tour.service';
// import { PlayerIAComponent } from './player-ia.component';

// fdescribe('PlayerIAComponent', () => {
//     let component: PlayerIAComponent;
//     let fixture: ComponentFixture<PlayerIAComponent>;
//     const letterA: Letter[] = [{ value: 'a', quantity: 1, points: 3 }];
//     let playerIA: PlayerIA;
//     //let passTurnServiceSpy:jasmine.SpyObj<PassTurnService>;
//     //let playerIAModelSpy: jasmine.SpyObj<PlayerIA>;
//     //let tourServiceSpy: jasmine.SpyObj<TourService>;
//     const scrabbleBoard: string[][] = [];

//     beforeEach(async () => {
//         await TestBed.configureTestingModule({
//             declarations: [PlayerIAComponent],
//             //providers: [{provide: PlayerIA, useValue: playerIAModelSpy},
//             //{provide: TourService, useValue: tourServiceSpy},
//             //      ],
//         }).compileComponents();
//     });

//     beforeEach(() => {
//         fixture = TestBed.createComponent(PlayerIAComponent);
//         component = fixture.componentInstance;
//         playerIA = new PlayerIA(0, 'no matter', letterA);
//         component.iaPlayer = playerIA;
//         component.tour = false;
//         spyOn<any>(playerIA, 'setContext');
//         //playerIAModelSpy = jasmine.createSpyObj('PlayerIA', ['setContext', 'play']);
//         //playerIAModelSpy.setContext.and.callFake(() => {
//         //  return;
//         //});
//         //tourServiceSpy = jasmine.createSpyObj('TourService', ['getTour']);
//         //spyOn<any>(component, 'play');
//         for (let i = 0; i < BOARD_ROWS; i++) {
//             scrabbleBoard[i] = [];
//             for (let j = 0; j < BOARD_COLUMNS; j++) {
//                 // To generate a grid with some letters anywhere on it
//                 // eslint-disable-next-line @typescript-eslint/no-magic-numbers
//                 if ((i + j) % 11 === 0) {
//                     scrabbleBoard[i][j] = 'X';
//                 } else {
//                     scrabbleBoard[i][j] = '';
//                 }
//             }
//         }
//         component.scrabbleBoard = scrabbleBoard;
//         component.tourService.tourSubject.subscribe(() => {
//             component.tour = false;
//         });
//         fixture.detectChanges();
//     });

//     beforeEach(() => {
//         jasmine.clock().install();
//     });

//     afterEach(() => {
//         jasmine.clock().uninstall();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     //it('should call play() on init after timeout', () => {
//     //
//     // })

//     // it('should call setTimer onInit', () => {
//     //     component.ngOnInit();
//     //     spyOn<any>(component, 'setTimer');
//     //     jasmine.clock().tick(ONESECOND_TIME + 1);
//     //     expect(component.setTimer).toHaveBeenCalled();
//     // });

//     // fit('should call play() of player ia class after waiting time delay', () => {
//     //     let playSpy = spyOn<any>(playerIA, 'play').and.callFake(() => {return;});
//     //     spyOn<any>(component.tourService, 'getTour').and.returnValue(false);
//     //     component.play();
//     //     jasmine.clock().tick(5000);
//     //     expect(component).toBeTruthy();
//     //     expect(playSpy).toHaveBeenCalled();
//     // });

//     it('should emit skipped event then toogle tour after waiting time delay', () => {
//         let toggleTourSpy = spyOn<any>(component.passTurn, 'toggleTour').and.callFake(() => { return; });
//         spyOn<any>(component.tourService, 'getTour').and.returnValue(false);
//         component.skip();
//         jasmine.clock().tick(5000);
//         expect(toggleTourSpy).toHaveBeenCalled();
//     });

//     // it('should emit swapped event then toogle tour after waiting time delay', () => {
//     //     component.setTimer();
//     //     jasmine.clock().tick(ONESECOND_TIME + 1);
//     //     expect(component.secondsInt).toEqual(59);
//     //     expect(component.minutesInt).toEqual(4);
//     // });

//     // it('should emit placed event then toogle tour after waiting time delay', () => {
//     //     component.setTimer();
//     //     jasmine.clock().tick(ONESECOND_TIME + 1);
//     //     expect(component.secondsInt).toEqual(59);
//     //     expect(component.minutesInt).toEqual(4);
//     // });

//     it('should unsubscribe on destroy', () => {
//         spyOn(component.tourSubscription, 'unsubscribe');
//         component.ngOndestroy();
//         expect(component.tourSubscription.unsubscribe).toHaveBeenCalled();
//     });
// });
