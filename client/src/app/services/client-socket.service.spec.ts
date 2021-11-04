/* eslint-disable dot-notation */
/* eslint-disable sort-imports */
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ClientSocketService } from './client-socket.service';

fdescribe('ClientSocketService', () => {
    let service: ClientSocketService;
    let routerSpy: Router;
    // let gameSettingsService: jasmine.SpyObj<GameSettingsService>;
    // RouterTestingModule.withRoutes([{ path: 'game', component: GameViewComponent }]);

    // beforeEach(async () => {
    //     RouterTestingModule.withRoutes([{ path: 'game', component: GameViewComponent }]);
    // });
    beforeEach(() => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        // service.socket = Socket as unknown as sio.Server;
        // server.listen(() => {
        // let urlString = `http://${window.location.hostname}:3000`;
        // service.socket = io(urlString);
        // sio.on("connection", (socket: any) => {
        //   serverSocket = socket;
        // });
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [{ provide: Router, useValue: routerSpy }],
        });
        service = TestBed.inject(ClientSocketService);
    });

    it('should navigate to game page on goToGameView event', () => {
        //const navigateSpy = spyOn(service['router'], 'navigate');
        // RouterTestingModule.withRoutes([{ path: 'game', component: GameViewComponent }]);
        service.socket = {
            // eslint-disable-next-line no-unused-vars
            on: (eventName: string, callback: () => void) => {
                if (eventName === 'goToGameView') {
                    callback();
                }
            },
        };
        service.route();
        expect(routerSpy['navigate']).toHaveBeenCalledOnceWith(['game']);
    });
});
