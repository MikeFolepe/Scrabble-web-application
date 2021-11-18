import { DELAY_OF_DISCONNECT } from '@app/classes/constants';
import { RoomManagerService } from '@app/services/room-manager.service';
import { GameSettings } from '@common/game-settings';
import { Letter } from '@common/letter';
import { PlayerIndex } from '@common/PlayerIndex';
import { Room, State } from '@common/room';
import { Vec2 } from '@common/vec2';
import * as http from 'http';
import * as io from 'socket.io';
import { Service } from 'typedi';

@Service()
export class SocketManagerService {
    private sio: io.Server;
    private roomManagerService: RoomManagerService;
    constructor(server: http.Server, roomManagerService: RoomManagerService) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
        this.roomManagerService = roomManagerService;
    }

    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            this.onCreateRoom(socket);

            socket.on('getRoomsConfiguration', () => {
                // getRoomsConfigurations only alerts the asker about the rooms configurations
                socket.emit('roomConfiguration', this.roomManagerService.rooms);
            });

            this.onNewRoomPlayer(socket);

            socket.on('sendPlacement', (scrabbleBoard: string[][], startPosition: Vec2, orientation: string, word: string, roomId: string) => {
                socket.to(roomId).emit('receivePlacement', scrabbleBoard, startPosition, orientation, word);
            });

            socket.on('deleteGame', (roomId: string) => {
                this.roomManagerService.deleteRoom(roomId);
                this.sio.emit('roomConfiguration', this.roomManagerService.rooms);
                socket.disconnect();
            });

            socket.on('sendReserve', (reserve: Letter[], reserveSize: number, roomId: string) => {
                socket.to(roomId).emit('receiveReserve', reserve, reserveSize);
            });

            socket.on('sendRoomMessage', (message: string, roomId: string) => {
                socket.to(roomId).emit('receiveRoomMessage', message);
            });

            socket.on('switchTurn', (turn: boolean, roomId: string) => {
                if (turn) {
                    socket.to(roomId).emit('turnSwitched', turn);
                    this.sio.in(roomId).emit('startTimer');
                }
            });

            socket.on('updateScoreInfo', (score: number, indexPlayer: number, roomId: string) => {
                socket.to(roomId).emit('receiveScoreInfo', score, indexPlayer);
            });

            socket.on('sendActions', (actions: string[], roomId: string) => {
                socket.to(roomId).emit('receiveActions', actions);
            });

            socket.on('deleteGame', (roomId: string) => {
                this.roomManagerService.deleteRoom(roomId);
                this.sio.emit('roomConfiguration', this.roomManagerService.rooms);
                this.sio.socketsLeave(roomId);
            });

            // Receive the Endgame from the give up game or the natural EndGame by easel or by actions
            this.onEndGameByGiveUp(socket);

            socket.on('sendEndGame', (isEndGame: boolean, roomId: string) => {
                this.sio.in(roomId).emit('receiveEndGame', isEndGame);
                this.sio.in(roomId).emit('stopTimer');
            });

            socket.on('sendPlayerTwo', (letterTable: Letter[], roomId: string) => {
                socket.to(roomId).emit('receivePlayerTwo', letterTable);
            });

            socket.on('disconnect', () => {
                const room = this.roomManagerService.find(this.roomManagerService.findRoomIdOf(socket.id));
                const roomId = this.roomManagerService.findRoomIdOf(socket.id);

                if (room === undefined) return;
                if (room.state === State.Waiting) {
                    this.roomManagerService.deleteRoom(roomId);
                    this.sio.emit('roomConfiguration', this.roomManagerService.rooms);
                    return;
                }
                if (room.state === State.Playing) {
                    room.state = State.Finish;
                    this.sendWinnerName(socket, roomId);
                    return;
                }
                // so after all if the state is finish, delete the room
                this.roomManagerService.deleteRoom(roomId);
                this.sio.emit('roomConfiguration', this.roomManagerService.rooms);
                this.sio.socketsLeave(roomId);
            });
        });
    }

    onCreateRoom(socket: io.Socket): void {
        socket.on('createRoom', (gameSettings: GameSettings) => {
            const roomId = this.roomManagerService.createRoomId(gameSettings.playersNames[PlayerIndex.OWNER]);
            this.roomManagerService.createRoom(socket.id, roomId, gameSettings);
            socket.join(roomId);
            // give the client his roomId to communicate later with server
            socket.emit('yourRoomId', roomId);
            // room creation alerts all clients on the new rooms configurations
            this.sio.emit('roomConfiguration', this.roomManagerService.rooms);
        });
    }

    onNewRoomPlayer(socket: io.Socket): void {
        socket.on('newRoomCustomer', (playerName: string, roomId: string) => {
            if (this.roomManagerService.isNotAvailable(roomId)) {
                // block someone else entry from dialog window
                socket.emit('roomAlreadyToken');
                return;
            }
            this.roomManagerService.addCustomer(playerName, roomId);
            this.roomManagerService.setSocket(this.roomManagerService.find(roomId) as Room, socket.id);
            this.roomManagerService.setState(roomId, State.Playing);
            this.sio.emit('roomConfiguration', this.roomManagerService.rooms);
            socket.join(roomId);
            this.sio.in(roomId).emit('yourRoomId', roomId);
            socket.emit('yourGameSettings', this.roomManagerService.formatGameSettingsForCustomerIn(roomId));
            socket.to(roomId).emit('yourGameSettings', this.roomManagerService.getGameSettings(roomId));
            this.sio.in(roomId).emit('goToGameView');
            this.sio.in(roomId).emit('startTimer');
        });
    }

    onEndGameByGiveUp(socket: io.Socket): void {
        socket.on('sendEndGameByGiveUp', (isEndGame: boolean, roomId: string) => {
            socket
                .to(roomId)
                .emit(
                    'receiveEndGameByGiveUp',
                    isEndGame,
                    this.roomManagerService.getWinnerName(roomId, this.roomManagerService.findLoserIndex(socket.id)),
                );
            this.sio.in(roomId).emit('stopTimer');
            this.roomManagerService.deleteRoom(roomId);
            this.sio.emit('roomConfiguration', this.roomManagerService.rooms);
            this.sio.socketsLeave(roomId);
        });
    }

    sendWinnerName(socket: io.Socket, roomId: string): void {
        setTimeout(() => {
            socket
                .to(roomId)
                .emit(
                    'receiveEndGameByGiveUp',
                    true,
                    this.roomManagerService.getWinnerName(roomId, this.roomManagerService.findLoserIndex(socket.id)),
                );
            this.sio.in(roomId).emit('stopTimer');
            socket.leave(roomId);
        }, DELAY_OF_DISCONNECT);
    }
}
