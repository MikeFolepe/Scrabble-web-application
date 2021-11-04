import * as http from 'http';
import * as io from 'socket.io';
import { GameSettings } from '@common/game-settings';
import { PlayerIndex } from '@common/PlayerIndex';
import { RoomManagerService } from '@app/services/room-manager.service';
import { Service } from 'typedi';
import { State } from '@common/room';

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
                this.roomManagerService.addCustomer(playerName, roomId);
                // Search the good room and set the custommer ID
                const myroom = this.roomManagerService.find(roomId);
                // On s'assure de pas avoir une room indéfinie
                if (myroom !== undefined) {
                    this.roomManagerService.setSocket(myroom, socket.id);
                }
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
            });

            socket.on('deleteGame', (roomId: string) => {
                this.roomManagerService.deleteRoom(roomId);
                this.sio.emit('roomConfiguration', this.roomManagerService.rooms);
                socket.disconnect();
            });

            socket.on('disconnect', () => {
                const roomId = this.roomManagerService.findRoomIdOf(socket.id);
                this.roomManagerService.deleteRoom(roomId);
                this.sio.emit('roomConfiguration', this.roomManagerService.rooms);
                this.sio.in(roomId).emit('goToMainMenu');
                // route les joueurs vers le debut avec un message d'erreur
            });

            socket.on('sendRoomMessage', (message: string, roomId: string) => {
                socket.to(roomId).emit('receiveRoomMessage', message);
            });
        });
    }
}
