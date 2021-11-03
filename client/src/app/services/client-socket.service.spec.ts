import * as sinon from 'sinon';
import { TestBed } from '@angular/core/testing';
import { assert } from "chai";
import * as http from 'http';
//import { createServer } from "http";
//import { Server } from "socket.io";
import { ClientSocketService } from './client-socket.service';

//const sinonChai = require("sinon-chai");

//chai.use(sinonChai);

fdescribe('ClientSocketService', () => {
    let service: ClientSocketService;
    let io: any;
    let server: http.Server;
    let serverSocket: any; 
    //let clientSocket: any;
    // RouterTestingModule.withRoutes([{ path: 'game', component: GameViewComponent }]);
    
    // beforeEach(async () => {
    //     RouterTestingModule.withRoutes([{ path: 'game', component: GameViewComponent }]);
    // });

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ClientSocketService);
    });
  
    beforeEach((done) => {
      //const httpServer = createServer();
      //io = new Server(httpServer);
      io = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
      server.listen(() => {
        // let urlString = `http://${window.location.hostname}:3000`;
        // clientSocket = io(urlString);
        io.on("connection", (socket: any) => {
          serverSocket = socket;
        });
      });
    });
  
    afterEach(() => {
      io.close();
      service.socket.close();
    });

    // it('should be created', () => {
    //     expect(service).toBeTruthy();
    // });

    it('should navigate to game page on goToGameView event', (done) => {
        spyOn(service['router'], 'navigate');
        const stub = sinon.stub(service['router'], 'navigate');
        service.socket.on('goToGameView', () => {
        service.route();
        assert.isTrue(stub.called);
        //expect(stub).toHaveBeenCalled();
        done();
        });
        serverSocket.emit('goToGameView');
    });

    
});
