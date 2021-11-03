import { Player } from '@app/models/player.model';
import { TestBed } from '@angular/core/testing';

describe('PlayerAI', () => {
    let model: Player;
    it('should create an instance', () => {
        expect(model).toBeTruthy();
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Player],
        }).compileComponents();
        model = new Player(0, 'player1', []);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Player],
        }).compileComponents();
        model = new Player(0, 'player1', []);
    });
});
