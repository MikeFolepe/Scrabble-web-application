/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ClientSocketService } from '@app/services/client-socket.service';
import { GameSettingsService } from '@app/services/game-settings.service';
import { GameSettings } from '@common/game-settings';
import { WaitingRoomComponent } from './waiting-room.component';

describe('WaitingRoomComponent', () => {
    let component: WaitingRoomComponent;
    let fixture: ComponentFixture<WaitingRoomComponent>;
    let clientSocketServiceSpyjob: jasmine.SpyObj<ClientSocketService>;
    let gameSettingsServiceSpyjob: jasmine.SpyObj<GameSettingsService>;

    beforeEach(() => {
        clientSocketServiceSpyjob = jasmine.createSpyObj('ClientSocketService', ['route']);
        // TODO Regarder bien comment reinjecter les informations
        clientSocketServiceSpyjob.socket = jasmine.createSpyObj('Socket', ['connect', 'on', 'disconnect']);
        gameSettingsServiceSpyjob = jasmine.createSpyObj('GameSettingsServices', ['']);

        jasmine.clock().install();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WaitingRoomComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [
                { provide: clientSocketServiceSpyjob, useValue: ClientSocketService },
                { provide: gameSettingsServiceSpyjob, useValue: GameSettingsService },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WaitingRoomComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should redirect to home page if the Owner name is empty', () => {
        const spyNavigate = spyOn(component['router'], 'navigate');

        component['gameSettingsService'].gameSettings = new GameSettings(['', ''], 1, '01', '00', 'Facile', 'Activer', 'francais', '00');
        component.handleReloadErrors();
        jasmine.clock().tick(1001);
        expect(component.status).toEqual('Une erreur est survenue');
        expect(spyNavigate).toHaveBeenCalledOnceWith(['home']);
    });

    it('should not redirect to home page if the Owner name is not empty', () => {
        component['gameSettingsService'].gameSettings = new GameSettings(['Mike', ''], 1, '01', '00', 'Facile', 'Activer', 'francais', 'ooo');
        component.handleReloadErrors();
        jasmine.clock().tick(1001);
        expect(component.status).toEqual('Connexion au serveur...');
    });

    it('should set the message after the time out', fakeAsync(() => {
        component.waitBeforeChangeStatus(1000, '');
        jasmine.clock().tick(3000);
        expect(component.status).toEqual('');
    }));

    it('should route the user a the view on init', () => {
        const spyNavigate = spyOn(component['router'], 'navigate');

        component['gameSettingsService'].gameSettings = new GameSettings(['Mike', ''], 1, '01', '00', 'Facile', 'Activer', 'null', 'francais');
        component['gameSettingsService'].isRedirectedFromMultiplayerGame = false;
        component['gameSettingsService'].isSoloMode = false;
        component.route();
        expect(component['gameSettingsService'].isRedirectedFromMultiplayerGame).toEqual(true);
        expect(component['gameSettingsService'].isSoloMode).toEqual(true);
        expect(spyNavigate).toHaveBeenCalledOnceWith(['solo-game-ai']);
    });

    it('should play the animation on waiting page ', () => {
        const spy1 = spyOn(component, 'waitBeforeChangeStatus');
        const spy2 = spyOn(component, 'handleReloadErrors');

        component.playAnimation();
        expect(spy1).toHaveBeenCalled();
        jasmine.clock().tick(2001);
        expect(spy2).toHaveBeenCalled();
        clientSocketServiceSpyjob.socket.connected = true;
        expect(clientSocketServiceSpyjob.socket.connected).toEqual(true);
    });
});
