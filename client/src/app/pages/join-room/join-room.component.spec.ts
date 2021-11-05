/* eslint-disable dot-notation */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { RouterTestingModule } from '@angular/router/testing';
import { ERROR_MESSAGE_DELAY } from '@app/classes/constants';
import { GameSettings } from '@common/game-settings';
import { Room, State } from '@common/room';
import { Socket } from 'socket.io-client';
import { JoinRoomComponent } from './join-room.component';

describe('JoinRoomComponent', () => {
    let component: JoinRoomComponent;
    let fixture: ComponentFixture<JoinRoomComponent>;
    // let clientSocketServiceSpy: jasmine.SpyObj<ClientSocketService>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [JoinRoomComponent],
            imports: [RouterTestingModule],
            providers: [
                {
                    provide: MatDialog,
                    useValue: {},
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(JoinRoomComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        // clientSocketServiceSpy = jasmine.createSpyObj('ClientSocketService', ['route']);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return the state of room is the state is waiting', () => {
        expect(component.computeRoomState(State.Playing)).toEqual('Indisponible');
    });

    it('should return the state of room is the state is Playing', () => {
        expect(component.computeRoomState(State.Waiting)).toEqual('En attente');
    });

    it('should save rooms given in argument with their configurations', () => {
        const settings: GameSettings = new GameSettings(['mi', 'ma'], 1, '01', '00', 'Facile', 'Activer', 'francais', '00');
        const expectedRooms = [new Room('room', 'socket', settings, State.Waiting)];
        component['clientSocketService'].socket = {
            // eslint-disable-next-line no-unused-vars
            on: (eventName: string, callback: (room: Room[]) => void) => {
                if (eventName === 'roomConfiguration') {
                    callback(expectedRooms);
                }
            },
        } as unknown as Socket;
        component.configureRooms();
        expect(component.rooms).toEqual(expectedRooms);
    });

    it('should correctly handle room unavailability', () => {
        jasmine.clock().install();
        component['clientSocketService'].socket = {
            // eslint-disable-next-line no-unused-vars
            on: (eventName: string, callback: () => void) => {
                if (eventName === 'roomAlreadyToken') {
                    callback();
                }
            },
        } as unknown as Socket;
        component.handleRoomUnavailability();
        expect(component.shouldDisplayJoinError).toEqual(true);
        jasmine.clock().tick(ERROR_MESSAGE_DELAY);
        expect(component.shouldDisplayJoinError).toEqual(false);
        jasmine.clock().uninstall();
    });

    it('should correctly compute the room item index onPageChange', () => {
        const event: PageEvent = new PageEvent();
        event.pageIndex = 2;
        event.pageSize = 1;
        const expectedRoomItemindex = event.pageIndex * event.pageSize;
        component.onPageChange(event);
        expect(component.roomItemIndex).toEqual(expectedRoomItemindex);
    });
});
