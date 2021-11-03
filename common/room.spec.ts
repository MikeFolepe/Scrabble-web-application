// /* eslint-disable prettier/prettier */
// // import { expect } from 'chai';
//  import { describe } from 'mocha';
// // import { GameSettingsService } from '@app/services/game-settings.service';
// import { GameSettings } from './game-settings';
// import { Room, State } from './room';

// describe('Room', () => {
//     const id = 'LOG2990';
//     // const ownerName = 'Paul';
//     // const customerName = 'Mike';
//     const settings: GameSettings = new GameSettings(['Paul', 'Mike'], 1, '00', '30', 'facile', 'Désactiver', 'français');
//     const state = State.Waiting;
//     let room: Room;

//     beforeEach(async () => {
//         room = new Room(id, settings, state.valueOf());
//     });

//     it('should create an instance', () => {
//         room = new Room(id, settings, state.valueOf());
//         expect(room.id).toEqual('LOG2990');
//         expect(room.gameSettings).toEqual(settings);
//         expect(room.state).toEqual(1);
//     });

//     it('should add customer at the Room', () => {
//         room.gameSettings.playersName[0] = 'Mike';
//         room.addCustomer('Paul');
//         expect(room.gameSettings.playersName[1]).toEqual('Paul');
//     });
// });
