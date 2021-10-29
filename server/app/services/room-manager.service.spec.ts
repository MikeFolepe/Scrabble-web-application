/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
// import { State } from '@app/classes/room';
// import { State } from '@app/classes/room';
// import { State } from '@app/classes/room';
import { RoomManager } from '@app/services/room-manager.service';
import { expect } from 'chai';
import { describe } from 'mocha';
// eslint-disable-next-line no-restricted-imports
import { GameSettings, StartingPlayer } from '../../../server/app/classes/multiplayer-game-settings';
describe('RoomManagerService', () => {
    let roomManagerService: RoomManager;
    const id = 'LOG2990';
    const settings: GameSettings = new GameSettings(['Paul', 'Mike'], StartingPlayer.Owner, '00', '30', 'facile', 'non', 'français');

    beforeEach(() => {
        roomManagerService = new RoomManager();
        roomManagerService.rooms = [];
    });

    it('should create a Room', () => {
        roomManagerService.createRoom(id, settings);
        expect(roomManagerService.rooms.length).to.equal(1);
    });

    it('should not add customer at the Room if ht name are same', () => {
        roomManagerService.createRoom(id, settings);
        const isSame: boolean = roomManagerService.addCustomer('Paul', id);
        expect(isSame).to.equal(false);
    });

    it('should set the state of Room', () => {
        roomManagerService.createRoom(id, settings);
        roomManagerService.rooms[0].gameSettings.playersName[1] = '';
        const testID = roomManagerService.createRoomId('Paul');
        roomManagerService.setState(testID, 1);
        expect(roomManagerService.rooms[0].state).to.equal(1);
    });

    it('should return the gamesettings  of room', () => {
        roomManagerService.createRoom(id, settings);
        const testID = roomManagerService.createRoomId('Paul');
        const testSettings = roomManagerService.getGameSettings(testID);
        expect(roomManagerService.rooms[0].gameSettings).to.equal(testSettings);
    });
    /*
    it('should delete the room with the right id', () => {
        roomManagerService.createRoom(id, settings);
        const testID = roomManagerService.createRoomId('Paul');
        roomManagerService.deleteRoom(testID);
        expect(roomManagerService.rooms.length).to.equal(0);
    });
    */
    it('should not delete the room if his ID is not in the table', () => {
        roomManagerService.createRoom(id, settings);
        roomManagerService.addCustomer('Mike', id);
        roomManagerService.deleteRoom('LOG2991');
        expect(roomManagerService.rooms.length).to.equal(1);
    });

    it('should find the room by the ID and return it', () => {
        roomManagerService.createRoom(id, settings);
        const testID = roomManagerService.createRoomId('Paul');
        expect(roomManagerService.rooms[0]).to.equal(roomManagerService.find(testID));
    });
    it('should not find the room by the ID and return undefined', () => {
        roomManagerService.createRoom(id, settings);
        roomManagerService.addCustomer('Mike', id);
        expect(roomManagerService.find('LOG2991')).to.equal(undefined);
    });

    it('should  return true if the room is not undefined', () => {
        roomManagerService.rooms = [];
        expect(roomManagerService.addCustomer('jojo', id)).to.equal(false);
    });

    it('should false if the room undefined ', () => {
        roomManagerService.createRoom(id, settings);
        roomManagerService.rooms[0].gameSettings.playersName[1] = '';
        const testID = roomManagerService.createRoomId('Paul');
        expect(roomManagerService.addCustomer('Mike', testID)).to.equal(true);
    });

    it('should return the formatGameSetttings', () => {
        roomManagerService.createRoom(id, settings);
        const testID = roomManagerService.createRoomId('Paul');
        expect(roomManagerService.formatGameSettingsForCustomerIn(testID)).not.to.equal(undefined);
    });

    it('should return the formatGameSetttings truth', () => {
        roomManagerService.createRoom(id, settings);
        const testID = roomManagerService.createRoomId('Paul');
        // const testTable = ['Mike', 'Paul'];
        // const testFormatSettings = new GameSettings(testTable, 1, '00', '30', 'non', 'non', 'français');
        expect(roomManagerService.formatGameSettingsForCustomerIn(testID));
    });

    it('should return  false if the room does not exist', () => {
        roomManagerService.rooms = [];
        expect(roomManagerService.isNotAvailable(id)).to.equal(false);
    });
    it('should return  true if the room  exist', () => {
        roomManagerService.createRoom(id, settings);
        const testID = roomManagerService.createRoomId('Paul');
        expect(roomManagerService.isNotAvailable(testID)).to.equal(false);
    });
});
