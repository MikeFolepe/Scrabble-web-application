import { Player } from '@app/models/player.model';
import { TestBed } from '@angular/core/testing';

describe('Player', () => {
    let model: Player;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Player],
        }).compileComponents();
        model = new Player(0, 'player1', []);
    });

    it('should create an instance', () => {
        expect(model).toBeTruthy();
    });
});
