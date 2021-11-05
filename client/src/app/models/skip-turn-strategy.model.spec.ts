import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PlayerAI } from '@app/models/player-ai.model';
import { PlayerAIComponent } from '@app/modules/game-view/player-ai/player-ai.component';
import { RESERVE } from '@app/classes/constants';
import { RouterTestingModule } from '@angular/router/testing';
import { SkipTurn } from '@app/models/skip-turn-strategy.model';
import { TestBed } from '@angular/core/testing';

describe('SkipTurn', () => {
    const id = 0;
    const name = 'Player 1';

    const letterA = RESERVE[0];
    const letterB = RESERVE[1];
    const letterC = RESERVE[2];
    const letterD = RESERVE[3];
    const letterE = RESERVE[4];
    const letterF = RESERVE[5];
    const letterG = RESERVE[6];
    const letterTable = [letterA, letterB, letterC, letterD, letterE, letterF, letterG];

    let playerAI: PlayerAI;
    let skipStrategy: SkipTurn;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        playerAI = new PlayerAI(id, name, letterTable);
        skipStrategy = new SkipTurn();
    });

    it('should create', () => {
        expect(skipStrategy).toBeTruthy();
    });

    it('should call the right function when execute() is called', () => {
        const context: PlayerAIComponent = TestBed.createComponent(PlayerAIComponent).componentInstance;
        spyOn(context, 'skip');
        skipStrategy.execute(playerAI, context);
        expect(context.skip).toHaveBeenCalledTimes(1);
    });
});
