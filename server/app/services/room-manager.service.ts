import { Room } from '@app/classes/room';
import { Service } from 'typedi';
// eslint-disable-next-line no-restricted-imports
import { GameSettings } from '../classes/multiplayer-game-settings';

@Service()
export class RoomManager {
    rooms: Room[];

    constructor() {
        this.rooms = [];
    }

    createRoom(roomId: string, ownerName: string, gameSettings: GameSettings) {
        this.rooms.push(new Room(roomId, ownerName, gameSettings));
    }

    addCustomer(customerName: string, roomId: string): boolean {
        const room = this.find(roomId);
        if (room === undefined || this.isSameName(room, customerName)) {
            return true;
        }

        return false;
    }

    private find(roomId: string): Room | undefined {
        return this.rooms.find((room) => room.id === roomId);
    }

    private isSameName(room: Room, customerName: string): boolean {
        return room.ownerName === customerName;
    }
}
