/* eslint-disable @typescript-eslint/no-magic-numbers */
import { OUT_BOUND_INDEX_OF_SOCKET } from '@app/classes/constants';
import { RoomManagerService } from '@app/services/room-manager.service';
import { GameSettings, StartingPlayer } from '@common/game-settings';
import { State } from '@common/room';
import { expect } from 'chai';

describe('RoomManagerService', () => {
    let roomManagerService: RoomManagerService;
    const id = 'LOG2990';
    const socketId1 = 'socket1';
    const settings: GameSettings = new GameSettings(['Paul', 'Mike'], StartingPlayer.Player1, '00', '30', 'facile', 'Désactiver', 'français', '00');

    const id1 = 'LOG2991';
    const socketId3 = 'socket3';
    const mySettings: GameSettings = new GameSettings(['Etienne', ''], StartingPlayer.Player1, '00', '30', 'facile', 'Désactiver', 'français', '00');

    const id4 = 'LOG2992';
    const socketId4 = 'socket4';
    const mySettings1: GameSettings = new GameSettings(['Johanna', ''], StartingPlayer.Player1, '00', '30', 'facile', 'Désactiver', 'français', '00');

    beforeEach(() => {
        roomManagerService = new RoomManagerService();
        roomManagerService.rooms = [];
    });

    afterEach(() => {
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
        settings.playersNames[1] = '';
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
        expect(roomManagerService.rooms[0].socketIds[1]).to.equal(socketId2);
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

    it('should return false if the room  is available ', () => {
        roomManagerService.createRoom(socketId1, id, settings);
        expect(roomManagerService.isNotAvailable(id)).to.equal(false);
    });
    it('should return the index of the player who leave the game', () => {
        roomManagerService.createRoom(socketId1, id, settings);
        const socketId2 = 'socketId2';
        roomManagerService.setSocket(roomManagerService.rooms[0], socketId2);
        expect(roomManagerService.findLoserIndex(socketId2)).to.equal(1);
    });

    it('should return the index of the player who leave the game', () => {
        roomManagerService.createRoom(socketId1, id, settings);
        const socketId2 = 'socketId2';
        roomManagerService.setSocket(roomManagerService.rooms[0], socketId2);
        expect(roomManagerService.findLoserIndex(socketId2)).to.equal(1);
    });
    it('should return the winner name depend of the index  the player who give up the game ', () => {
        roomManagerService.rooms = [];
        roomManagerService.createRoom(socketId1, id, settings);
        const socketId2 = 'socket2';
        roomManagerService.setSocket(roomManagerService.rooms[0], socketId2);
        expect(roomManagerService.getWinnerName(id, roomManagerService.findLoserIndex(socketId1))).to.equal('Paul');
    });

    it('should return the outbound index of socket if the socketId of the player who leave the game is not in the room', () => {
        roomManagerService.createRoom(socketId1, id, settings);
        const socketId2 = 'socketId2';
        const fakeSocket = 'socketId3';
        roomManagerService.setSocket(roomManagerService.rooms[0], socketId2);
        expect(roomManagerService.findLoserIndex(fakeSocket)).to.equal(OUT_BOUND_INDEX_OF_SOCKET);
    });

    it('should return 1 the winner name depend of the index  the player who give up the game ', () => {
        roomManagerService.createRoom(socketId1, id, settings);
        const socketId2 = 'socket2';
        roomManagerService.setSocket(roomManagerService.rooms[0], socketId2);
        expect(roomManagerService.getWinnerName(id, roomManagerService.findLoserIndex(socketId2))).to.equal('Paul');
    });

    it('should find the room with state in waiting and return it', () => {
        settings.playersNames[1] = '';
        roomManagerService.createRoom(socketId1, id, settings);
        // TODO:  traduire tous ces commentaires en anglais
        // Deuxieme room avec un joueur et etat waiting
        roomManagerService.createRoom(socketId3, id1, mySettings);
        roomManagerService.createRoom(socketId4, id4, mySettings1);
        expect(roomManagerService.findRoomInWaitingState('Mike')).not.to.equal(undefined);
    });
    it('should not find the room with state in waiting and return it', () => {
        // Premiere room en attente
        settings.playersNames[1] = '';
        roomManagerService.createRoom(socketId1, id, settings);
        roomManagerService.setState(id, State.Playing);
        // Deuxieme room avec un joueur et etat waiting
        roomManagerService.createRoom(socketId3, id1, mySettings);
        roomManagerService.setState(id1, State.Playing);
        // 3eme room en attente
        roomManagerService.createRoom(socketId4, id4, mySettings1);
        roomManagerService.setState(id4, State.Playing);

        expect(roomManagerService.findRoomInWaitingState('Mike')).to.equal(undefined);
    });

    it('should return the number of rooms in state Waiting', () => {
        settings.playersNames[1] = '';
        roomManagerService.createRoom(socketId1, id, settings);
        roomManagerService.createRoom(socketId3, id1, mySettings);
        roomManagerService.createRoom(socketId4, id4, mySettings1);
        expect(roomManagerService.getNumberofRoomInWaitingState()).to.equal(3);
    });
    it('should return 0 if the number of rooms in state Waiting is 0', () => {
        settings.playersNames[1] = '';
        roomManagerService.createRoom(socketId1, id, settings);
        roomManagerService.setState(id, State.Playing);

        roomManagerService.createRoom(socketId3, id1, mySettings);
        roomManagerService.setState(id1, State.Playing);

        expect(roomManagerService.getNumberofRoomInWaitingState()).to.equal(0);
    });
});
