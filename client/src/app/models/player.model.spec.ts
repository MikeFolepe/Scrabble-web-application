// import { TestBed } from '@angular/core/testing';
// import { Player } from '@app/models/player.model';

<<<<<<< HEAD
// describe('Player', () => {
//     let model: Player = new Player(0, 'player1', []);

//     beforeEach(() => {
//         TestBed.configureTestingModule({});
//         model = TestBed.inject(Player);
//     });
=======
describe('PlayerAI', () => {
    let model: Player;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Player],
        }).compileComponents();
        model = new Player(0, 'player1', []);
    });
>>>>>>> 613b34083bc1832f3ae4fdaa11004c8f2d2bf594

//     it('should create an instance', () => {
//         expect(model).toBeTruthy();
//     });
// });
