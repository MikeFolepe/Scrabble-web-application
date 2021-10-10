/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlayerIA } from '@app/models/player-ia.model';

describe('PlayerIA', () => {
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

    beforeEach(() => {
        playerIA = new PlayerIA(id, name, letterTable);
    });

    it('should create an instance', () => {
        expect(playerIA).toBeTruthy();
    });
});
