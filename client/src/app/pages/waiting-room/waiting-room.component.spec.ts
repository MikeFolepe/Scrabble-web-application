/* eslint-disable prettier/prettier */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ClientSocketService } from '@app/services/client-socket.service';
import { GameSettingsService } from '@app/services/game-settings.service';
import { WaitingRoomComponent } from './waiting-room.component';
// import { Router } from '@angular/router';

describe('WaitingRoomComponent', () => {
    let component: WaitingRoomComponent;
    let fixture: ComponentFixture<WaitingRoomComponent>;
    let clientSocketServiceSpyjob: jasmine.SpyObj<ClientSocketService>;
    let gameSettingsServiceSpyjob: jasmine.SpyObj<GameSettingsService>;

    beforeEach(() => {
        clientSocketServiceSpyjob = jasmine.createSpyObj('ClientSocketService', ['route']);
        gameSettingsServiceSpyjob = jasmine.createSpyObj('GameSettingsServices', ['rogetSettingsute']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WaitingRoomComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [
                { provide: clientSocketServiceSpyjob, useValue: ClientSocketService },
                { provide: gameSettingsServiceSpyjob, useValue: GameSettingsService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WaitingRoomComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WaitingRoomComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WaitingRoomComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('should redirect to home page if the Ownername is empty', () => {
    //     gameSettingsServiceSpyjob.gameSettings(['',''],);
    //     // eslint-disable-next-line no-console
    //     console.log(gameSettingsServiceSpyjob.gameSettings.playersName[0]);
    //     expect(component.status).toEqual('Une erreur est survenu');
    //     // expect(component.router.navigate).toHaveBeenCalled();
    // });

    // it('should dislplay the corrct message if the socket is not ', () => {
    //     // eslint-disable-next-line no-console
    //     clientSocketServiceSpyjob.socket.connect();
    //     console.log(clientSocketServiceSpyjob.socket.connected);
    //     expect(component.status).toEqual('Erreur de connexion...veuillez réessayer');
    //     expect(component.isWaiting).toEqual(false);
    // });
});
