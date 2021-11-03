import { RoomManagerService } from '@app/services/room-manager.service';
import { GameSettings, StartingPlayer } from '@common/game-settings';
import { State } from '@common/room';
import { expect } from 'chai';
describe('RoomManagerService', () => {
    let roomManagerService: RoomManagerService;
    const id = 'LOG2990';
    const socketId1 = 'socket1';

    const settings: GameSettings = new GameSettings(['Paul', 'Mike'], StartingPlayer.Player1, '00', '30', 'facile', 'Désactiver', 'français', '00');

    beforeEach(() => {
        roomManagerService = new RoomManagerService();
        roomManagerService.rooms = [];
    });

    it('should create a Room', () => {
        roomManagerService.createRoom(socketId1, id, settings);
        expect(roomManagerService.rooms.length).to.equal(1);
    });

    it('should create a specific rew roomId base on the playerName', () => {
        const roomIdtest1 = roomManagerService.createRoomId('Paul');
        expect(roomIdtest1).to.equal(roomIdtest1);
    });

    it('should not add customer at the Room if ht name are same', () => {
        roomManagerService.createRoom(socketId1, id, settings);
        expect(roomManagerService.addCustomer('Paul', 'noFountID')).to.equal(false);
    });

    it('should add customer at the Room if ht name are same', () => {
        roomManagerService.createRoom(socketId1, id, settings);
        settings.playersName[1] = '';
        expect(roomManagerService.addCustomer('Paul', id)).to.equal(true);
    });

    it('should set the state of Room', () => {
        roomManagerService.createRoom(socketId1, id, settings);
        roomManagerService.setState(id, State.Playing);
        expect(roomManagerService.rooms[0].state).to.equal(State.Playing);
    });

    it('should setSocket in the room', () => {
        roomManagerService.createRoom(socketId1, id, settings);
        const socketId2 = 'socket2';
        const myRoom = roomManagerService.rooms[0];
        roomManagerService.setSocket(myRoom, socketId2);
        expect(myRoom.socketIds[1]).to.equal(socketId2);
    });

    it('should return the formatGameSettings for the Customer in a specific Room', () => {
        roomManagerService.createRoom(socketId1, id, settings);
        settings.startingPlayer = 0;
        expect(roomManagerService.rooms[0].gameSettings.startingPlayer).to.equal(0);
        expect(roomManagerService.formatGameSettingsForCustomerIn(id)).not.to.equal(undefined);
    });

    it('should return the formatGameSettings for the Customer in a specific Room and swith the starting player', () => {
        roomManagerService.createRoom(socketId1, id, settings);
        settings.startingPlayer = 1;
        expect(roomManagerService.rooms[0].gameSettings.startingPlayer).to.equal(1);
        expect(roomManagerService.formatGameSettingsForCustomerIn(id)).not.to.equal(undefined);
    });

    it('should return the gamesettings  of room', () => {
        roomManagerService.createRoom(socketId1, id, settings);
        settings.startingPlayer = 0;
        expect(roomManagerService.rooms[0].gameSettings.startingPlayer).to.equal(0);
        expect(roomManagerService.formatGameSettingsForCustomerIn(id)).not.to.equal(undefined);
        expect(roomManagerService.getGameSettings(id)).not.to.equal(undefined);
    });

    it('should delete the room with the right id', () => {
        roomManagerService.createRoom(socketId1, id, settings);
        roomManagerService.deleteRoom(id);
        expect(roomManagerService.rooms.length).to.equal(0);
    });

    it('should not delete the room if his ID is not in the table', () => {
        roomManagerService.createRoom(socketId1, id, settings);
        roomManagerService.deleteRoom('fakeId');
        expect(roomManagerService.rooms.length).to.equal(1);
    });

    it('should find the room with the soketId and return it', () => {
        roomManagerService.createRoom(socketId1, id, settings);
        const myRoomId = roomManagerService.findRoomIdOf(socketId1);
        expect(myRoomId).to.equal(id);
    });

    it('should not find the room with the soketId and return it', () => {
        roomManagerService.createRoom(socketId1, id, settings);
        const myRoomId = roomManagerService.findRoomIdOf('fakesocketId');
        expect(myRoomId).to.equal('');
    });

    it('should return  false if the room does not exist', () => {
        roomManagerService.rooms = [];
        expect(roomManagerService.isNotAvailable(id)).to.equal(false);
    });

    it('should return  true if the room  exist', () => {
        roomManagerService.createRoom(socketId1, id, settings);
        expect(roomManagerService.isNotAvailable(id)).to.equal(false);
    });
});
