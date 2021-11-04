/* eslint-disable dot-notation */
/* eslint-disable sort-imports */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable prettier/prettier */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ClientSocketService } from '@app/services/client-socket.service';
import { GameSettingsService } from '@app/services/game-settings.service';
import { GameSettings } from '@common/game-settings';
import { Socket } from 'socket.io-client';
import { WaitingRoomComponent } from './waiting-room.component';

describe('WaitingRoomComponent', () => {
    let component: WaitingRoomComponent;
    let fixture: ComponentFixture<WaitingRoomComponent>;
    let clientSocketServiceSpy: jasmine.SpyObj<ClientSocketService>;
    let gameSettingsServiceSpy: jasmine.SpyObj<GameSettingsService>;

    beforeEach(() => {
        clientSocketServiceSpy = jasmine.createSpyObj('ClientSocketService', ['route']);
        // TODO Regarder bien comment reinjecter les informations
        clientSocketServiceSpy.socket = jasmine.createSpyObj('Socket', ['emit', 'connect', 'on', 'disconnect']) as unknown as Socket;
        gameSettingsServiceSpy = jasmine.createSpyObj('GameSettingsServices', ['']);
    });
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WaitingRoomComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [
                { provide: clientSocketServiceSpy, useValue: ClientSocketService },
                { provide: gameSettingsServiceSpy, useValue: GameSettingsService },
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

    it('should redirect to home page if the Ownername is empty', () => {
        jasmine.clock().install();
        component['gameSettingsService'].gameSettings = new GameSettings(['', ''], 1, '01', '00', 'Facile', 'Activer', 'francais', '00');
        component.handleReloadErrors();
        jasmine.clock().tick(3000);
        expect(component.status).toEqual('Une erreur est survenue');
        jasmine.clock().uninstall();
    });

    it('should redirect to home page if the Ownername is not empty', () => {
        jasmine.clock().install();
        component['gameSettingsService'].gameSettings = new GameSettings(['Mike', ''], 1, '01', '00', 'Facile', 'Activer', 'francais', 'ooo');
        component.handleReloadErrors();
        jasmine.clock().tick(3000);
        expect(component.status).toEqual('');
        jasmine.clock().uninstall();
    });

    it('should set the message after the time out', fakeAsync(() => {
        jasmine.clock().install();
        component.waitBeforeChangeStatus(1000, '');
        jasmine.clock().tick(3000);
        expect(component.status).toEqual('');
        jasmine.clock().uninstall();
    }));

    it('should route the user a the view on init', () => {
        component['gameSettingsService'].gameSettings = new GameSettings(['Mike', ''], 1, '01', '00', 'Facile', 'Activer', 'null', 'francais');
        component['gameSettingsService'].isRedirectedFromMultiplayerGame = false;
        component['gameSettingsService'].isSoloMode = false;
        component.route();
        expect(component['gameSettingsService'].isRedirectedFromMultiplayerGame).toEqual(true);
        expect(component['gameSettingsService'].isSoloMode).toEqual(true);
    });

    it('should play the animation on waitin page ', () => {
        jasmine.clock().install();
        component['clientSocket'].socket.connected = true;
        const waitBeforeChangeStatusSpy = spyOn(component, 'waitBeforeChangeStatus').and.callFake(() => {
            return;
        });
        const handleReloadErrorsSpy = spyOn(component, 'handleReloadErrors').and.callFake(() => {
            return;
        });
        component.playAnimation();
        jasmine.clock().tick(4001);
        expect(waitBeforeChangeStatusSpy).toHaveBeenCalledTimes(3);
        expect(handleReloadErrorsSpy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it('should play the animation on waitin page ', () => {
        jasmine.clock().install();
        component['clientSocket'].socket.connected = false;
        const waitBeforeChangeStatusSpy = spyOn(component, 'waitBeforeChangeStatus').and.callFake(() => {
            return;
        });
        const handleReloadErrorsSpy = spyOn(component, 'handleReloadErrors').and.callFake(() => {
            return;
        });
        component.playAnimation();
        jasmine.clock().tick(2001);
        expect(waitBeforeChangeStatusSpy).toHaveBeenCalledTimes(1);
        expect(handleReloadErrorsSpy).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });
});
