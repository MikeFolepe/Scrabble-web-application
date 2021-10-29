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
    private intervalID: NodeJS.Timeout;
    constructor(server: http.Server, roomManager: RoomManager) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
        this.roomManager = roomManager;
    }

    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            socket.on('createRoom', (gameSettings: GameSettings) => {
                const roomId = this.roomManager.createRoomId(gameSettings.playersName[0]);
                // TODO: trouver une solution definitive au roomId
                this.roomManager.createRoom(roomId, gameSettings);
                // Each room created will have the creator's socket id as roomId
                socket.join(roomId);
                // room creation alerts all clients on the new rooms configurations
                this.sio.emit('roomConfiguration', this.roomManager.rooms);
                // affiche les rooms après ajout
                // console.log(socket.rooms);
            });

            socket.on('getRoomsConfiguration', () => {
                // getRoomsConfigurations only alerts the asker about the rooms configurations
                socket.emit('roomConfiguration', this.roomManager.rooms);
            });

            socket.on('newRoomCustomer', (playerName: string, roomId: string) => {
                if (this.roomManager.isNotAvailable(roomId)) {
                    // block someone else entry from dialog window
                    socket.emit('roomAlreadyToken');
                    return;
                }
                this.roomManager.addCustomer(playerName, roomId);
                this.roomManager.setState(roomId, State.Playing);
                // block someone else entry from room selection
                this.sio.emit('roomConfiguration', this.roomManager.rooms);
                socket.join(roomId);
                console.log('le joigneur a :' + roomId);
                console.log('le joigneur a :' + socket.rooms);
                // update roomID in the new filled room to allow the clients in this room
                // to ask the server make some actions in their room later
                this.sio.in(roomId).emit('yourRoomId', roomId);
                // send back to the joiner his game settings with his starting status
                // and his name display position
                socket.emit('yourGameSettings', this.roomManager.formatGameSettingsForCustomerIn(roomId));
                // send back to the creator his game settings with his starting status
                // and his name display position
                socket.to(roomId).emit('yourGameSettings', this.roomManager.getGameSettings(roomId));
                // redirect the clients in the new filled room to game view
                this.sio.in(roomId).emit('goToGameView');
            });

            // Delete  the room and uodate the client view
            socket.on('cancelMultiplayerparty', (gameSettings: GameSettings) => {
                const roomId = this.roomManager.createRoomId(gameSettings.playersName[0]);
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

            socket.on('sendRoomMessage', (message: string, roomId: string) => {
                // this.sio.to(roomId).emit('receiveRoomMessage', `${socket.id} : ${message}`);
                console.log(message);
                console.log(socket.rooms);
                // this.sio.to(roomId).emit('receiveRoomMessage', message);
                socket.to(roomId).emit('receiveRoomMessage', message);
            });

            socket.on('startTimer', (roomId: string) => {
                console.log('time');
                this.intervalID = setInterval(() => {
                    console.log('clock');
                    this.sio.to(roomId).emit('startClock');
                }, 1000);
            });

            socket.on('switchTurn', (roomId: string) => {
                clearInterval(this.intervalID);
                this.sio.to(roomId).emit('turnSwitched');
                console.log('switch');
            });
        });
    }
}
