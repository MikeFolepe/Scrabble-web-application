import { GameSettings } from '@common/game-settings';
import { expect } from 'chai';
import { describe } from 'mocha';
import { Room, State } from './room';

describe('Room', () => {
    const id = 'LOG2990';
    const socketId = 'socket1';
    const settings = new GameSettings(
        ['Paul', 'Mike'],
        1,
        '00',
        '30',
        'facile',
        'Désactiver',
        "[['A1', 'tripleword'], ['A4', 'doubleletter']]",
        'français',
    );
    const state = State.Waiting;
    let room: Room;

    beforeEach(async () => {
        room = new Room(id, socketId, settings, state.valueOf());
    });

    it('should create an instance', () => {
        room = new Room(id, socketId, settings, state.valueOf());
        expect(room.id).to.equal('LOG2990');
        expect(room.gameSettings).to.equals(settings);
        expect(room.state).to.equal(1);
    });

    it('should add customer at the Room', () => {
        room.gameSettings.playersName[0] = 'Mike';
        room.addCustomer('Paul');
        expect(room.gameSettings.playersName[1]).to.equal('Paul');
    });
});
