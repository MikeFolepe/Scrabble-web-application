import { TestBed } from '@angular/core/testing';
import { PlayerIAComponent } from '@app/modules/game-view/components/player-ia/player-ia.component';
import { PlayerIA } from './player-ia.model';
import { SkipTurn } from './skip-turn-strategy.model';

describe('SkipTurn', () => {
    const id = 0;
    const name = 'Player 1';
    const letterTable = [
        { value: 'A', quantity: 0, points: 0 },
        { value: 'B', quantity: 0, points: 0 },
        { value: 'C', quantity: 0, points: 0 },
        { value: 'D', quantity: 0, points: 0 },
        { value: 'E', quantity: 0, points: 0 },
        { value: 'F', quantity: 0, points: 0 },
        { value: 'G', quantity: 0, points: 0 },
    ];

    let playerIA: PlayerIA;
    let skipStrategy: SkipTurn;

    beforeEach(() => {
        playerIA = new PlayerIA(id, name, letterTable);
        skipStrategy = new SkipTurn();
    });

    it('should create', () => {
        expect(skipStrategy).toBeTruthy();
    });

    it('should call the right function when execute() is called', () => {
        const context: PlayerIAComponent = TestBed.createComponent(PlayerIAComponent).componentInstance;
        spyOn(context, 'skip');
        skipStrategy.execute(playerIA, context);
        expect(context.skip).toHaveBeenCalledTimes(1);
    });
});
