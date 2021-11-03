/* eslint-disable import/no-unresolved */
/* eslint-disable sort-imports */
/* eslint-disable no-restricted-imports */
/* eslint-disable prettier/prettier */
// import { GameSettingsService } from '@app/services/game-settings.service';
import { GameSettings, StartingPlayer } from '@common/game-settings';
import { expect } from 'chai';
import { describe } from 'mocha';
import { Room, State } from './room';

describe('Room', () => {
    const id = 'LOG2990';
    const socketId1 = 'socket1';
    const socketId2 = 'socket2';

    const settings: GameSettings = new GameSettings(['Paul', ''], StartingPlayer.Player1, '00', '30', 'facile', 'Désactiver', 'français','00');
    const state = State.Waiting;
    let room: Room;

    beforeEach( () => {

        room = new Room(id,socketId1,settings, state.valueOf());
    });

    it('should create an instance of room with state waiting', () => {
        room = new Room(id,socketId1, settings );
        expect(room.roomId).equal('LOG2990');
        expect(room.socketIds).equal(room.socketIds);
        expect(room.gameSettings).equal(settings);
        expect(room.state).equal(state);
    });
    it('should create an instance of room with state playing', () => {
        room = new Room(id, socketId1, settings, State.Playing);
        expect(room.roomId).equal('LOG2990');
        expect(room.socketIds).equal(room.socketIds);
        expect(room.gameSettings).equal(settings);
        expect(room.state).equal(0);
    });

    it('should add customer at the Room', () => {
        room.addCustomer('Paul');
        expect(room.gameSettings.playersName[1]).equal('Paul');
    });

    it('should set th SocketId for the customer', () => {
        room.gameSettings.playersName[0] = 'Mike';
        room.addCustomer('Paul');
        room.setSocketId(socketId2);
        expect(room.socketIds[1]).equal(socketId2);
    });
});
