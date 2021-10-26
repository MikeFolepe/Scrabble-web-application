import { GameSettings } from '@app/classes/multiplayer-game-settings';
import { State } from '@app/classes/room';
import * as http from 'http';
import * as io from 'socket.io';
import { Service } from 'typedi';
import { RoomManager } from './room-manager.service';

@Service()
export class SocketManager {
    private sio: io.Server;
    private roomManager: RoomManager;
    constructor(server: http.Server, roomManager: RoomManager) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
        this.roomManager = roomManager;
    }

    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            socket.on('createRoom', (gameSettings: GameSettings) => {
                this.roomManager.createRoom(socket.id, gameSettings.playersName[0], gameSettings);
                socket.join(socket.id);
                // room creation alerts all clients on the new rooms configurations
                this.sio.emit('roomConfiguration', this.roomManager.rooms);

                // TODO: update roomID in the client service
            });

            socket.on('getRoomsConfigurations', () => {
                // getRoomsConfigurations only alerts the asker about the rooms configurations
                socket.emit('roomConfiguration', this.roomManager.rooms);
            });

            socket.on('newRoomCustomer', (playerName: string, roomId: string) => {
                this.roomManager.addCustomer(playerName, roomId);
                this.roomManager.setState(roomId, State.Playing);
                socket.join(roomId);
                // all client must be alerted that some room is filled
                this.sio.emit('roomConfiguration', this.roomManager.rooms);
                // TODO: Je peux faire une convention entre les joueurs
                // ...
                // redirect the clients in the new filled room to game view
                this.sio.in(roomId).emit('goToGameView', this.roomManager.getGameSettings(roomId));
                console.log(this.roomManager.getGameSettings(roomId));
                // TODO: update roomID dans les clients respectifs
            });
            // Delete  the room and uodate the client view
            socket.on('cancelMultiplayerparty', (roomId: string) => {
                this.roomManager.deleteRoom(roomId);
                this.sio.emit('roomConfiguration', this.roomManager.rooms);
            });
            socket.on('disconnect', (reason) => {
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
            });
        });
    }
}
