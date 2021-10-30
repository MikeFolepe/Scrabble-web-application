import { GameSettings } from './game-settings';
import { Room, State } from './room';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('Room', () => {
    const id = 'LOG2990';
    // const ownerName = 'Paul';
    // const customerName = 'Mike';
    const settings: GameSettings = new GameSettings(['Paul', 'Mike'], 1, '00', '30', 'facile', 'non', 'français');
    const state = State.Waiting;
    let room: Room;

    beforeEach(async () => {
        room = new Room(id, settings, state.valueOf());
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    it('should create an instance', () => {
        room = new Room(id, settings, state.valueOf());
        expect(room.id).toEqual('LOG2990');
        expect(room.gameSettings).toEqual(settings);
        expect(room.state).toEqual(1);
    });

    it('should add customer at the Room', () => {
        room.gameSettings.playersName[0] = 'Mike';
        room.addCustomer('Paul');
        expect(room.gameSettings.playersName[1]).toEqual('Paul');
    });
});
