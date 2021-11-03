import { Room, State } from '@app/classes/room';
import { GameSettings } from '@common/game-settings';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('Room', () => {
    const roomId = 'LOG2990';
    const socketId = 'socket1';
    const settings: GameSettings = new GameSettings(
        ['Paul', 'Mike'],
        1,
        '00',
        '30',
        'facile',
        'Désactiver',
        "[['A1', 'doubleLetter'], ['A4', 'tripleLetter']]",
        'français',
    );
    const state = State.Waiting;
    let room: Room;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    it('should create an instance', () => {
        room = new Room(roomId, socketId, settings, state.valueOf());
        expect(room.id).toEqual('LOG2990');
        expect(room.gameSettings).toEqual(settings);
        expect(room.state).toEqual(1);
    });

    it('should add customer at the Room', () => {
        room = new Room(roomId, socketId, settings, state.valueOf());
        room.gameSettings.playersName[0] = 'test';
        const expected = 'test2';
        room.addCustomer(expected);
        expect(room.gameSettings.playersName[1]).toEqual(expected);
    });

    it('should create an instance with the right default value', () => {
        expect(new Room(roomId, socketId, settings).state).toEqual(State.Waiting);
    });
});
