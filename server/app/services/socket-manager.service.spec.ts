/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
/* eslint-disable sort-imports */
import { GameSettings } from '@common/game-settings';
import { Room, State } from '@common/room';
import { expect } from 'chai';
import * as http from 'http';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as io from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { RoomManagerService } from './room-manager.service';
import { SocketManagerService } from './socket-manager.service';
import Sinon = require('sinon');

describe('SocketManagerService', () => {
    let roomManagerService: SinonStubbedInstance<RoomManagerService>;
    let service: SocketManagerService;
    let sio: SinonStubbedInstance<io.Server>;
    const id = 'LOG2990';
    const socketId = 'socket1';
    const settings: GameSettings = new GameSettings(['mi', 'ma'], 1, '01', '00', 'Facile', 'Activer', 'francais', '00');
    const state = State.Waiting;
    const stateBusy = State.Playing;
    const fakeIn = {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        in: () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        emit: () => {},
    } as unknown as io.BroadcastOperator<DefaultEventsMap>;

    beforeEach(() => {
        roomManagerService = createStubInstance(RoomManagerService);
        sio = createStubInstance(io.Server);
        service = new SocketManagerService(http.createServer(), roomManagerService);
        service['sio'] = sio as unknown as io.Server;
    });

    it('handle socket should add events on sockets', () => {
        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars
            on: (eventName: string, callback: () => void) => {
                // callback();
                return;
            },
        };

        service['sio'] = {
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === 'connection') {
                    callback(fakeSocket);
                }
            },
        } as io.Server;

        const spy = Sinon.spy(fakeSocket, 'on');
        service.handleSockets();
        expect(spy.called).to.equal(true);
    });

    it('should call createRoom callback', () => {
        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars
            on: (eventName: string, callback: (gameSettings: GameSettings) => void) => {
                if (eventName === 'createRoom') {
                    callback(settings);
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            join: () => {},
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            emit: () => {},
        };

        service['sio'] = {
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === 'connection') {
                    callback(fakeSocket);
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            emit: () => {},
        } as unknown as io.Server;

        service.handleSockets();
        expect(roomManagerService.createRoomId.called).to.equal(true);
        expect(roomManagerService.createRoom.called).to.equal(true);
    });

    it('should emit RoomConfigurations', () => {
        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars
            on: (eventName: string, callback: () => void) => {
                if (eventName === 'getRoomsConfiguration') {
                    callback();
                    // return;
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            emit: () => {
                service['sio'].emit('roomConfiguration', new Room(id, socketId, settings, state));
            },
        };
        const spy = Sinon.spy(fakeSocket, 'emit');
        service['sio'] = {
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === 'connection') {
                    callback(fakeSocket);
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            emit: () => {},
        } as unknown as io.Server;

        service.handleSockets();
        expect(spy.called).to.equal(true);
    });

    it('should handle a new customer', () => {
        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars
            on: (eventName: string, callback: (playerName: string, roomId: string) => void) => {
                if (eventName === 'newRoomCustomer') {
                    callback('Mike', 'mike1234');
                    // return;
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            join: () => {},
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            emit: () => {},
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            to: () => {
                return fakeIn;
            },
        };

        service['sio'] = {
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === 'connection') {
                    callback(fakeSocket);
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            emit: () => {},
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            in: () => {
                return fakeIn;
            },
        } as unknown as io.Server;
        const spy = Sinon.spy(fakeSocket, 'emit');
        roomManagerService.rooms = new Array(new Room(id, socketId, settings, stateBusy));
        service.handleSockets();
        expect(spy.called).to.equal(true);
    });

    it('should call deleteGame', () => {
        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars
            on: (eventName: string, callback: (roomId: string) => void) => {
                if (eventName === 'deleteGame') {
                    callback('mike1234');
                    // return;
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            emit: () => {},
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            disconnect: () => {},
        } as unknown as io.Socket;
        const spy = Sinon.spy(fakeSocket, 'disconnect');
        service['sio'] = {
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === 'connection') {
                    callback(fakeSocket);
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            emit: () => {},
        } as unknown as io.Server;

        service.handleSockets();
        expect(spy.called).to.equal(true);
        expect(roomManagerService.deleteRoom.called).to.equal(true);
    });

    it('should call disconnect', () => {
        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars
            on: (eventName: string, callback: () => void) => {
                if (eventName === 'disconnect') {
                    callback();
                    // return;
                }
            },
        } as unknown as io.Socket;
        service['sio'] = {
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === 'connection') {
                    callback(fakeSocket);
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            emit: () => {},

            in: () => {
                return fakeIn;
            },
        } as unknown as io.Server;

        service.handleSockets();
        expect(roomManagerService.deleteRoom.called).to.equal(true);
    });

    it('should send a message', () => {
        const fakeSocket = {
            // eslint-disable-next-line no-unused-vars
            on: (eventName: string, callback: (message: string, roomId: string) => void) => {
                if (eventName === 'sendRoomMessage') {
                    callback('Mike', 'mike1234');
                    // return;
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            emit: () => {},
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            to: () => {
                return fakeIn;
            },
        };

        const spy = Sinon.spy(fakeSocket, 'to');
        service['sio'] = {
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === 'connection') {
                    callback(fakeSocket);
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            emit: () => {},
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            in: () => {
                return fakeIn;
            },
        } as unknown as io.Server;
        service.handleSockets();
        expect(spy.called).to.equal(true);
    });
});
