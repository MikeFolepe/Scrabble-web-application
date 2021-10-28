/* eslint-disable prettier/prettier */
import { expect } from 'chai';
import { describe } from 'mocha';
import { GameSettings, StartingPlayer } from './multiplayer-game-settings';
import { Room, State } from './room';

describe('Room', () => {
    const id = 'LOG2990';
    const ownerName = 'Paul';
    // const customerName = 'Mike';
    const settings: GameSettings = new GameSettings(['Paul', 'Mike'], StartingPlayer.Owner, '00', '30', 'facile', 'non', 'français');
    const state = State.Waiting;
    let room: Room;

    beforeEach(async () => {
        room = new Room(id, ownerName, settings, state.valueOf());
    });

    it('should create an instance', () => {
        room = new Room(id, ownerName, settings, state.valueOf());
        expect(room.id).to.equal('LOG2990');
        expect(room.ownerName).to.equal('Paul');
        expect(room.gameSettings).to.equals(settings);
        expect(room.state).to.equal(1);
    });

    it('should add customer at the Room', () => {
        room.addCustomer('Paul');
        expect(room.customerName).to.equal('Paul');
    });
});
