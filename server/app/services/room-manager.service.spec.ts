/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
// import { State } from '@app/classes/room';
import { State } from '@app/classes/room';
import { RoomManager } from '@app/services/room-manager.service';
import { expect } from 'chai';
import { describe } from 'mocha';
// eslint-disable-next-line no-restricted-imports
import { GameSettings, StartingPlayer } from '../../../server/app/classes/multiplayer-game-settings';
describe('RoomManagerService', () => {
    let roomManagerService: RoomManager;
    const id = 'LOG2990';
    const ownerName = 'Paul';
    const settings: GameSettings = new GameSettings(['Paul', 'Mike'], StartingPlayer.Owner, '00', '30', 'facile', 'non', 'français');

    beforeEach(() => {
        roomManagerService = new RoomManager();
        roomManagerService.rooms = [];
    });

    it('should create a Room', () => {
        roomManagerService.createRoom(id, ownerName, settings);
        expect(roomManagerService.rooms.length).to.equal(1);
    });

    it('should not add customer at the Room if ht name are same', () => {
        roomManagerService.createRoom(id, ownerName, settings);
        const isSame: boolean = roomManagerService.addCustomer('Paul', id);
        expect(isSame).to.equal(false);
    });
    it('should add customer at the Room if the names are differents', () => {
        roomManagerService.createRoom(id, ownerName, settings);
        const isSame: boolean = roomManagerService.addCustomer('Mike', id);
        expect(isSame).to.equal(true);
    });

    it('should set the state of Room', () => {
        roomManagerService.createRoom(id, ownerName, settings);
        roomManagerService.addCustomer('Mike', id);
        roomManagerService.setState(id, State.Playing);
        expect(roomManagerService.rooms[0].state).to.equal(State.Playing);
    });

    it('should return the gamesettings  of room', () => {
        roomManagerService.createRoom(id, ownerName, settings);
        roomManagerService.addCustomer('Mike', id);
        const testSettings = roomManagerService.getGameSettings(id);
        expect(roomManagerService.rooms[0].gameSettings).to.equal(testSettings);
    });

    it('should delete the room with the right id', () => {
        roomManagerService.createRoom(id, ownerName, settings);
        roomManagerService.addCustomer('Mike', id);
        roomManagerService.deleteRoom(id);
        expect(roomManagerService.rooms.length).to.equal(0);
    });

    it('should not delete the room if his ID is not in the table', () => {
        roomManagerService.createRoom(id, ownerName, settings);
        roomManagerService.addCustomer('Mike', id);
        roomManagerService.deleteRoom('LOG2991');
        expect(roomManagerService.rooms.length).to.equal(1);
    });

    it('should find the room by the ID and return it', () => {
        roomManagerService.createRoom(id, ownerName, settings);
        roomManagerService.addCustomer('Mike', id);
        expect(roomManagerService.rooms[0]).to.equal(roomManagerService.find(id));
    });
    it('should not find the room by the ID and return undefined', () => {
        roomManagerService.createRoom(id, ownerName, settings);
        roomManagerService.addCustomer('Mike', id);
        expect(roomManagerService.find('LOG2991')).to.equal(undefined);
    });

    it('should true if the ownername and custorname are same', () => {
        roomManagerService.createRoom(id, ownerName, settings);
        roomManagerService.addCustomer('Paul', id);
        expect(roomManagerService.isSameName(roomManagerService.rooms[0], 'Paul')).to.equal(true);
    });

    it('should false if the ownername and custorname are differents', () => {
        roomManagerService.createRoom(id, ownerName, settings);
        roomManagerService.addCustomer('Mike', id);
        expect(roomManagerService.isSameName(roomManagerService.rooms[0], 'Mike')).to.equal(false);
    });
});
