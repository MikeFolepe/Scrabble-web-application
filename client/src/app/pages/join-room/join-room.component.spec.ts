/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { RouterTestingModule } from '@angular/router/testing';
import { ERROR_MESSAGE_DELAY } from '@app/classes/constants';
import { GameSettings } from '@common/game-settings';
import { Room, State } from '@common/room';
import { of } from 'rxjs';
import { Socket } from 'socket.io-client';
import { JoinRoomComponent } from './join-room.component';

describe('JoinRoomComponent', () => {
    let component: JoinRoomComponent;
    let fixture: ComponentFixture<JoinRoomComponent>;

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

    it('should return if the name', () => {
        const settings: GameSettings = new GameSettings(['mi', ''], 1, '01', '00', 'Facile', 'Activer', 'francais', '00');
        const expectedRooms = [new Room('room', 'socket', settings, State.Waiting)];
        const matDialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
        matDialogRefMock.afterClosed.and.callFake(() => {
            return of(null);
        });
        const matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
        matDialogMock.open.and.callFake(() => {
            return matDialogRefMock;
        });
        component.dialog = matDialogMock;
        component.join(expectedRooms[0]);
        expect(expectedRooms[0].gameSettings.playersName[1]).toEqual('');
    });

    it('should set display error message return if the customer name is equal OwnerName', () => {
        jasmine.clock().install();
        const settings: GameSettings = new GameSettings(['mi', ''], 1, '01', '00', 'Facile', 'Activer', 'francais', '00');
        const expectedRooms = [new Room('room', 'socket', settings, State.Waiting)];
        const matDialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
        matDialogRefMock.afterClosed.and.callFake(() => {
            return of('mi');
        });
        const matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
        matDialogMock.open.and.callFake(() => {
            return matDialogRefMock;
        });
        component.dialog = matDialogMock;
        component.join(expectedRooms[0]);
        jasmine.clock().tick(5000);
        expect(expectedRooms[0].gameSettings.playersName[1]).toEqual('');
        expect(component.shouldDisplayJoinError).toEqual(false);
        jasmine.clock().uninstall();
    });

    it('should emit an event to add new Customer if his name is different of the  OwnerName', () => {
        const settings: GameSettings = new GameSettings(['mi', ''], 1, '01', '00', 'Facile', 'Activer', 'francais', '00');
        const expectedRooms = [new Room('room', 'socket', settings, State.Waiting)];
        const matDialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
        matDialogRefMock.afterClosed.and.callFake(() => {
            return of('MIke');
        });
        const matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
        matDialogMock.open.and.callFake(() => {
            return matDialogRefMock;
        });
        component.dialog = matDialogMock;
        component.join(expectedRooms[0]);
        expect(expectedRooms[0].gameSettings.playersName[1]).toEqual('');
        expect(expectedRooms[0].id).toEqual('room');
    });
});
