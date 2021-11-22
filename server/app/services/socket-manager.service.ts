import { RoomManagerService } from '@app/services/room-manager.service';
import { GameSettings } from '@common/game-settings';
import { GameType2 } from '@common/game-type';
import { Letter } from '@common/letter';
import { Objective } from '@common/objectives';
import { PlayerIndex } from '@common/player-index';
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

            socket.on('getRoomsConfiguration', (gameType: GameType2) => {
                // getRoomsConfigurations only alerts the asker about the rooms configurations
                socket.emit('roomConfiguration', this.roomManagerService.rooms[gameType]);
            });

            this.onNewRoomPlayer(socket);

            socket.on('sendPlacement', (scrabbleBoard: string[][], startPosition: Vec2, orientation: string, word: string, roomId: string) => {
                socket.to(roomId).emit('receivePlacement', scrabbleBoard, startPosition, orientation, word);
            });

            socket.on('sendReserve', (reserve: Letter[], reserveSize: number, roomId: string) => {
                socket.to(roomId).emit('receiveReserve', reserve, reserveSize);
            });

            socket.on('sendRoomMessage', (message: string, roomId: string) => {
                socket.to(roomId).emit('receiveRoomMessage', message);
            });

            socket.on('sendGameConversionMessage', (message: string, roomId: string) => {
                socket.to(roomId).emit('receiveGameConversionMessage', message);
            });
            socket.on('switchTurn', (turn: boolean, roomId: string) => {
                if (turn) {
                    socket.to(roomId).emit('turnSwitched', turn);
                    this.sio.in(roomId).emit('startTimer');
                }
            });

            socket.on('updatePlayedWords', (playedWords: string, roomId: string) => {
                socket.to(roomId).emit('receivePlayedWords', playedWords);
            });

            socket.on('updateScoreInfo', (score: number, indexPlayer: number, roomId: string) => {
                socket.to(roomId).emit('receiveScoreInfo', score, indexPlayer);
            });

            socket.on('sendObjectives', (objectives: Objective[], roomId: string) => {
                socket.to(roomId).emit('receiveObjectives', objectives);
            });

            socket.on('sendActions', (actions: string[], roomId: string) => {
                socket.to(roomId).emit('receiveActions', actions);
            });

            socket.on('deleteGame', (roomId: string, gameType: GameType2) => {
                this.roomManagerService.deleteRoom(roomId);
                this.sio.emit('roomConfiguration', this.roomManagerService.rooms);
                // Send number of rooms available
                this.sio.emit('roomAvailable', this.roomManagerService.getNumberofRoomInWaitingState(gameType));
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

            // Method handler by click on placement aléatoire
            socket.on('newRoomCustomerOfRandomPlacement', (customerName: string, gameType: GameType2) => {
                const room = this.roomManagerService.findRoomInWaitingState(customerName, gameType) as Room;
                if (room === undefined) return;

                socket.emit('receiveCustomerOfRandomPlacement', customerName, room.id);
            });

            // Method to get to update the room available when you acces join-room page
            socket.on('getRoomAvailable', (gameType: GameType2) => {
                this.sio.emit('roomAvailable', this.roomManagerService.getNumberofRoomInWaitingState(gameType));
            });
            socket.on('disconnect', () => {
                const room = this.roomManagerService.find(this.roomManagerService.findRoomIdOf(socket.id));
                const roomId = this.roomManagerService.findRoomIdOf(socket.id);
                socket.to(roomId).emit('receiveGameConversionMessage', 'Attention la partie est sur le point de se faire convertir en partie Solo.');

                if (room === undefined) return;
                if (room.state === State.Waiting) {
                    this.roomManagerService.deleteRoom(roomId);
                    this.sio.emit('roomConfiguration', this.roomManagerService.rooms);
                    return;
                }
                if (room.state === State.Playing) {
                    room.state = State.Finish;
                    // TODO: prendre une decision sur ça
                    // this.sendWinnerName(socket, roomId);
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
        socket.on('createRoom', (gameSettings: GameSettings, gameType: GameType2) => {
            const roomId = this.roomManagerService.createRoomId(gameSettings.playersNames[PlayerIndex.OWNER], socket.id);
            this.roomManagerService.createRoom(socket.id, roomId, gameSettings, gameType);
            socket.join(roomId);
            // give the client his roomId to communicate later with server
            socket.emit('yourRoomId', roomId);
            // room creation alerts all clients on the new rooms configurations
            this.sio.emit('roomConfiguration', this.roomManagerService.rooms);
            // Send number of rooms available
            // TODO: getNumberofRoomInWaitingState -> Of
            this.sio.emit('roomAvailable', this.roomManagerService.getNumberofRoomInWaitingState(gameType));
        });
    }

    onNewRoomPlayer(socket: io.Socket): void {
        socket.on('newRoomCustomer', (playerName: string, roomId: string, gameType: GameType2) => {
            if (this.roomManagerService.isNotAvailable(roomId)) {
                // block someone else entry from dialog window
                socket.emit('roomAlreadyToken');
                return;
            }
            this.roomManagerService.addCustomer(playerName, roomId);
            this.roomManagerService.setSocket(this.roomManagerService.find(roomId) as Room, socket.id);
            this.roomManagerService.setState(roomId, State.Playing);
            this.sio.emit('roomConfiguration', this.roomManagerService.rooms[gameType]);
            socket.join(roomId);
            this.sio.in(roomId).emit('yourRoomId', roomId);
            socket.emit('yourGameSettings', this.roomManagerService.formatGameSettingsForCustomerIn(roomId));
            socket.to(roomId).emit('yourGameSettings', this.roomManagerService.getGameSettings(roomId));
            this.sio.in(roomId).emit('goToGameView');
            this.sio.in(roomId).emit('startTimer');
            // Send number of rooms available
            this.sio.emit('roomAvailable', this.roomManagerService.getNumberofRoomInWaitingState(gameType));
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
            this.roomManagerService.deleteRoom(roomId);
            // TODO: prendre une decision sur ça
            // const room = roomId;
            // const isgame = isEndGame;
            // this.sio.in(roomId).emit('stopTimer');
            // this.sio.emit('roomConfiguration', this.roomManagerService.rooms);
            // this.sio.socketsLeave(roomId);
        });
    }
}
