// /* eslint-disable prettier/prettier */
// import { expect } from 'chai';
// import { RoomManager } from '../server/app/services/room-manager.service';
// //  import { describe } from 'mocha';
// // import { GameSettingsService } from '@app/services/game-settings.service';
// import { GameSettings, StartingPlayer } from './game-settings';
// import { Room, State } from './room';

// describe('Room', () => {
//     let roomManagerService: RoomManager;
//     const id = 'LOG2990';
//     const socketId1 = 'socket1';
//     const socketId2 = 'socket2';

//     const settings: GameSettings = new GameSettings(['Paul', ''], StartingPlayer.Player1, '00', '30', 'facile', 'Désactiver', 'français','00');
//     const state = State.Waiting;
//     let room: Room;

//     beforeEach( () => {
//         roomManagerService = new RoomManager();

//         room = new Room(id,socketId1,settings, state.valueOf());
//     });

//     it('should create an instance', () => {
//         room = new Room(id,socketId1, settings, state.valueOf());
//         expect(room.roomId).toEqual('LOG2990');
//         expect(room.gameSettings).toEqual(settings);
//         expect(room.state).toEqual(1);
//     });

//     it('should add customer at the Room', () => {
//         room.addCustomer('Paul');
//         expect(room.gameSettings.playersName[1]).toEqual('Paul');
//     });

//     it('should set th SocketId for the customer', () => {
//         room.gameSettings.playersName[0] = 'Mike';
//         room.addCustomer('Paul');
//         room.setSocketId(socketId2);
//         expect(room.socketIds[1]).toEqual(socketId2);
//     });
// });
