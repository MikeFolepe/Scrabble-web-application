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
                // affiche les rooms après ajout
                // console.log(socket.rooms);
            });

            socket.on('getRoomsConfigurations', () => {
                // getRoomsConfigurations only alerts the asker about the rooms configurations
                socket.emit('roomConfiguration', this.roomManager.rooms);
            });

            socket.on('newRoomCustomer', (playerName: string, roomId: string) => {
                this.roomManager.addCustomer(playerName, roomId);
                this.roomManager.setState(roomId, State.Playing);
                socket.join(roomId);
                // all client must be alerted tha new full some room is filled
                this.sio.emit('roomConfiguration', this.roomManager.rooms);
                // redirect the clients in the new filled room to game view
                this.sio.in(roomId).emit('goToGameView', this.roomManager.getGameSettings(roomId));
                console.log(this.roomManager.getGameSettings(roomId));
                // affiche les rooms après ajout
                // console.log(socket.rooms);
            });
            // Delete  the room inside the table of room and update the client view
            socket.on('cancelMultiplayerparty', (roomId: string) => {
                this.roomManager.deleteRoom(roomId);
                // Delete the room inside th socket
                // socket.leave(roomId);
                this.sio.in(roomId).socketsLeave(roomId);
                // Broadcast the  rooms available after deletion
                this.sio.emit('roomConfiguration', this.roomManager.rooms);
                // Afficher toutes les rooms restantes
                console.log(socket.rooms);
            });
            socket.on('disconnect', (reason) => {
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
            });
        });
    }
}
