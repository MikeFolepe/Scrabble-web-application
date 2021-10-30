/* eslint-disable sort-imports */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable prettier/prettier */
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
        // clientSocketServiceSpyjob.socket = jasmine.createSpyObj('SOCKETIO', ['conne']);
        gameSettingsServiceSpyjob = jasmine.createSpyObj('GameSettingsServices', ['']);
        
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
    
    
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    
   
    it('should redirect to home page if the Ownername is empty', () => {
         jasmine.clock().install();
        component.gameSettingsService.gameSettings = new GameSettings(['',''],1,'01','00','Facile','oui','francais');
        component.handleReloadErrors();
         jasmine.clock().tick(3000);
        expect(component.status).toEqual('Une erreur est survenue');
        jasmine.clock().uninstall();
    });

    it('should redirect to home page if the Ownername is not empty', () => {
        jasmine.clock().install();
       component.gameSettingsService.gameSettings = new GameSettings(['Mike',''],1,'01','00','Facile','oui','francais');
       component.handleReloadErrors();
        jasmine.clock().tick(3000);
       expect(component.status).toEqual('');
       jasmine.clock().uninstall();
   });
    
    it('should set the message after the time out', fakeAsync(() => {
        jasmine.clock().install();
        component.waitBeforeChangeStatus(1000,'');
        jasmine.clock().tick(3000);
        expect(component.status).toEqual('');
        jasmine.clock().uninstall();
    }));
    
    it('should route the user a the view on init',() => {
        component.gameSettingsService.gameSettings = new GameSettings(['Mike',''],1,'01','00','Facile','oui','francais'); 
        component.gameSettingsService.isRedirectedFromMultiplayerGame= false;
        component.gameSettingsService.isSoloMode= false;
        component.route();
        expect( component.gameSettingsService.isRedirectedFromMultiplayerGame).toEqual(true);
        expect( component.gameSettingsService.isSoloMode).toEqual(true);
        // expect(component.router.navigate).toEqual(['solo-game-ai']);
        
    });
    

});
 