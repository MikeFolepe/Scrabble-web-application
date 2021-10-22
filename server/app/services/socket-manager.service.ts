import { GameSettings } from '@app/classes/multiplayer-game-settings';
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
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}` + 'salut Majid');

            socket.on('createRoom', (gameSettings: GameSettings) => {
                this.roomManager.createRoom(socket.id, gameSettings.playersName[0], gameSettings);
                socket.join(socket.id);
                console.log(socket.rooms);
                //console.log('ca emit');
            });
            // socket.on('validate', (word: string) => {
            //     const isValid = word.length > 5;
            //     socket.emit('wordValidated', isValid);
            // });

            // socket.on('broadcastAll', (message: string) => {
            //     this.sio.sockets.emit('massMessage', `${socket.id} : ${message}`);
            // });

            // socket.on('joinRoom', () => {
            //     socket.join(this.room);
            // });

            // socket.on('roomMessage', (message: string) => {
            //     this.sio.to(this.room).emit('roomMessage', `${socket.id} : ${message}`);
            // });

            socket.on('disconnect', (reason) => {
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
            });
        });
    }
}
