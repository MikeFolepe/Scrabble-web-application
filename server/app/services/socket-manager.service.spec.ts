// /* eslint-disable @typescript-eslint/no-require-imports */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable dot-notation */
// /* eslint-disable prettier/prettier */
// /* eslint-disable sort-imports */
// // eslint-disable-next-line prettier/prettier
// // with { "type": "module" } in your package.json
// import { GameSettings } from '@common/game-settings';
// import { Room, State } from '@common/room';
// import { expect } from 'chai';
// import * as http from 'http';
// // import * as ioS from 'socket.io';
// import { createStubInstance, SinonStubbedInstance } from 'sinon';
// import * as io from 'socket.io';
// import { RoomManager } from './room-manager.service';
// import { SocketManager } from './socket-manager.service';
// import Sinon = require('sinon');

// describe('SocketManager', () => {
//     let roomManager: SinonStubbedInstance<RoomManager>;
//     let service: SocketManager;
//     let sio: SinonStubbedInstance<io.Server>;
//     const id = 'LOG2990';
//     const socketId = 'socket1';
//     const settings: GameSettings = new GameSettings(['mi', 'ma'], 1, '01', '00', 'Facile', 'Activer', 'francais', '00');
//     const state = State.Waiting;
//     const stateBusy = State.Playing;

//     beforeEach(() => {
//         roomManager = createStubInstance(RoomManager);
//         sio = createStubInstance(io.Server);
//         service = new SocketManager(http.createServer(), roomManager);
//         service['sio'] = sio as unknown as io.Server;
//     });

//     it('handle socket should add events on sockets', () => {
//         const fakeSocket = {
//             // eslint-disable-next-line no-unused-vars
//             on: (eventName: string, callback: () => void) => {
//                 // callback();
//                 return;
//             },
//         };
//         const spy = Sinon.spy(fakeSocket, 'on');

//         service['sio'] = {
//             on: (eventName: string, callback: (socket: any) => void) => {
//                 if (eventName === 'connection') {
//                     callback(fakeSocket);
//                 }
//             },
//         } as io.Server;

//         service.handleSockets();
//         expect(spy.called).to.equal(true);
//     });

//     it('should call createRoom callback', () => {
//         const fakeSocket = {
//             // eslint-disable-next-line no-unused-vars
//             on: (eventName: string, callback: (gameSettings: GameSettings) => void) => {
//                 if (eventName === 'createRoom') {
//                     callback(settings);
//                 }
//             },
//             // eslint-disable-next-line @typescript-eslint/no-empty-function
//             join: () => {},
//             // eslint-disable-next-line @typescript-eslint/no-empty-function
//             emit: () => {},
//         };

//         service['sio'] = {
//             on: (eventName: string, callback: (socket: any) => void) => {
//                 if (eventName === 'connection') {
//                     callback(fakeSocket);
//                 }
//             },
//             // eslint-disable-next-line @typescript-eslint/no-empty-function
//             emit: () => {},
//         } as unknown as io.Server;

//         service.handleSockets();
//         expect(roomManager.createRoomId.called).to.equal(true);
//     });

//     it('should emit RoomConfigurations', () => {
//         const fakeSocket = {
//             // eslint-disable-next-line no-unused-vars
//             on: (eventName: string, callback: () => void) => {
//                 if (eventName === 'getRoomsConfiguration') {
//                     callback();
//                     // return;
//                 }
//             },
//             // eslint-disable-next-line @typescript-eslint/no-empty-function
//             // eslint-disable-next-line @typescript-eslint/no-empty-function
//             emit: () => {
//                 service['sio'].emit('roomConfiguration', new Room(id, socketId, settings, state));
//             },
//         };
//         const spy = Sinon.spy(fakeSocket, 'emit');
//         service['sio'] = {
//             on: (eventName: string, callback: (socket: any) => void) => {
//                 if (eventName === 'connection') {
//                     callback(fakeSocket);
//                 }
//             },
//             // eslint-disable-next-line @typescript-eslint/no-empty-function
//             emit: () => {},
//         } as unknown as io.Server;

//         service.handleSockets();
//         expect(spy.called).to.equal(true);
//     });

//     it('should handle a new customer', () => {
//         const fakeSocket = {
//             // eslint-disable-next-line no-unused-vars
//             on: (eventName: string, callback: (playerName: string, roomId: string) => void) => {
//                 if (eventName === 'newRoomCustomer') {
//                     callback('Mike', 'mike1234');
//                     // return;
//                 }
//             },
//             // eslint-disable-next-line @typescript-eslint/no-empty-function
//             // eslint-disable-next-line @typescript-eslint/no-empty-function
//             join: () => {},
//             // eslint-disable-next-line @typescript-eslint/no-empty-function
//             emit: () => {},
//             // eslint-disable-next-line @typescript-eslint/no-empty-function
//             to: () => {},

//             // eslint-disable-next-line no-dupe-keys

//         };
//         const spy = Sinon.spy(fakeSocket, 'emit');
//         service['sio'] = {
//             on: (eventName: string, callback: (socket: any) => void) => {
//                 if (eventName === 'connection') {
//                     callback(fakeSocket);
//                 }
//             },
//             // eslint-disable-next-line @typescript-eslint/no-empty-function
//             emit: () => {},
//             // eslint-disable-next-line @typescript-eslint/no-empty-function
//             in: () => {

//             },
//         } as unknown as io.Server;
//         roomManager.rooms = new Array(new Room(id, socketId, settings, stateBusy));
//         service.handleSockets();
//         expect(spy.called).to.equal(true);
//     });
// });
