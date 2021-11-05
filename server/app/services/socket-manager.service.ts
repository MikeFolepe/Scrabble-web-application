<<<<<<< HEAD
=======
import { DELAY_OF_DISCONNECT } from '@app/classes/constants';
>>>>>>> dcdd8de46b7e9c43ea2110be7ccda1e398e71373
import { RoomManagerService } from '@app/services/room-manager.service';
import { GameSettings } from '@common/game-settings';
import { PlayerIndex } from '@common/PlayerIndex';
import { State } from '@common/room';
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
            socket.on('createRoom', (gameSettings: GameSettings) => {
                const roomId = this.roomManagerService.createRoomId(gameSettings.playersName[PlayerIndex.OWNER]);
                this.roomManagerService.createRoom(socket.id, roomId, gameSettings);
                socket.join(roomId);
                // give the client his roomId to communicate later with server
                socket.emit('yourRoomId', roomId);
                // room creation alerts all clients on the new rooms configurations
                this.sio.emit('roomConfiguration', this.roomManagerService.rooms);
            });

            socket.on('getRoomsConfiguration', () => {
                // getRoomsConfigurations only alerts the asker about the rooms configurations
                socket.emit('roomConfiguration', this.roomManagerService.rooms);
            });

            socket.on('newRoomCustomer', (playerName: string, roomId: string) => {
                if (this.roomManagerService.isNotAvailable(roomId)) {
                    // block someone else entry from dialog window
                    socket.emit('roomAlreadyToken');
                    return;
                }
                console.log('ok');
                this.roomManagerService.addCustomer(playerName, roomId);
                // Search the good room and set the custommer ID
<<<<<<< HEAD
                this.roomManagerService.setSocket(this.roomManagerService.find(roomId), socket.id);
=======
                const myroom = this.roomManagerService.find(roomId);
                // Check if the roon isn't undefined
                if (myroom !== undefined) {
                    this.roomManagerService.setSocket(myroom, socket.id);
                }
>>>>>>> dcdd8de46b7e9c43ea2110be7ccda1e398e71373
                this.roomManagerService.setState(roomId, State.Playing);
                // block someone else entry from room selection
                this.sio.emit('roomConfiguration', this.roomManagerService.rooms);
                socket.join(roomId);
                // update roomID in the new filled room to allow the clients in this room
                // to ask the server make some actions in their room later
                this.sio.in(roomId).emit('yourRoomId', roomId);
                // send back to the joiner his game settings with his starting status
                // and his name display position
                socket.emit('yourGameSettings', this.roomManagerService.formatGameSettingsForCustomerIn(roomId));
                // send back to the creator his game settings with his starting status
                // and his name display position
                socket.to(roomId).emit('yourGameSettings', this.roomManagerService.getGameSettings(roomId));
                // redirect the clients in the new filled room to game view
                this.sio.in(roomId).emit('goToGameView');
                this.sio.in(roomId).emit('startTimer');
            });

            socket.on('sendPlacement', (scrabbleBoard: string[][], startPosition: unknown, orientation: string, word: string, roomId: string) => {
                socket.to(roomId).emit('receivePlacement', scrabbleBoard, startPosition, orientation, word);
            });

            socket.on('deleteGame', (roomId: string) => {
                this.roomManagerService.deleteRoom(roomId);
                this.sio.emit('roomConfiguration', this.roomManagerService.rooms);
                socket.disconnect();
            });

<<<<<<< HEAD
            socket.on('disconnect', () => {
                const roomId = this.roomManagerService.findRoomIdOf(socket.id);
                this.roomManagerService.deleteRoom(roomId);
                this.sio.emit('roomConfiguration', this.roomManagerService.rooms);
                this.sio.in(roomId).emit('goToMainMenu');
            });

=======
>>>>>>> dcdd8de46b7e9c43ea2110be7ccda1e398e71373
            socket.on('sendReserve', (reserve: unknown, reserveSize: number, roomId: string) => {
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
            socket.on('sendEndGamebyGiveUp', (isEndGame: boolean, roomId: string) => {
                socket
                    .to(roomId)
                    .emit(
                        'receiveEndGamebyGiveup',
                        isEndGame,
                        this.roomManagerService.getWinnerName(roomId, this.roomManagerService.findLoserIndex(socket.id)),
                    );
                this.sio.in(roomId).emit('stopStimer');
                this.roomManagerService.deleteRoom(roomId);
                this.sio.emit('roomConfiguration', this.roomManagerService.rooms);
                this.sio.socketsLeave(roomId);
            });

            socket.on('sendRoomMessage', (message: string, roomId: string) => {
                socket.to(roomId).emit('receiveRoomMessage', message);
            });

            socket.on('sendEndGame', (isEndGame: boolean, roomId: string) => {
                this.sio.in(roomId).emit('receiveEndGame', isEndGame);
                this.sio.in(roomId).emit('stopStimer');
            });
            // TODO: Commoniser
            socket.on('sendPlayerTwo', (letterTable: unknown, roomId: string) => {
                socket.to(roomId).emit('receivePlayerTwo', letterTable);
            });
            socket.on('disconnect', () => {
                const roomId = this.roomManagerService.findRoomIdOf(socket.id);
                setTimeout(() => {
                    socket
                        .to(roomId)
                        .emit(
                            'receiveEndGamebyGiveup',
                            true,
                            this.roomManagerService.getWinnerName(roomId, this.roomManagerService.findLoserIndex(socket.id)),
                        );
                    this.sio.in(roomId).emit('stopStimer');
                    this.roomManagerService.deleteRoom(roomId);
                    this.sio.emit('roomConfiguration', this.roomManagerService.rooms);
                    this.sio.socketsLeave(roomId);
                }, DELAY_OF_DISCONNECT);
            });
        });
    }
}
