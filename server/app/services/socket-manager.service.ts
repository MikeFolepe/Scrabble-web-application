import * as http from 'http';
import * as io from 'socket.io';
import { clearInterval } from 'timers';
import { Service } from 'typedi';

@Service()
export class SocketManagerService {
    private sio: io.Server;
    intervalID: NodeJS.Timeout;
    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            console.log(`connexion par l'utilisateur avec id : ${socket.id}`);

            this.sio.emit('goToGameView');
            console.log("gone to game view server");

            socket.on('disconnect', (reason) => {
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
            });

            socket.on('startTimer', () => {
                console.log("timer started");
                this.intervalID = setInterval(() => {
                    this.sio.emit('clock');
                }, 1000);
            });

            socket.on('stopTimer', () => {
                clearInterval(this.intervalID);
                socket.emit('switchTurn');
            });
        });
    }
}
