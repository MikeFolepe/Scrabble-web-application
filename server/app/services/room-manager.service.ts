/* eslint-disable no-restricted-imports */
import { Room, State } from '@app/classes/room';
import { Service } from 'typedi';
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
        const room = this.find(roomId) as Room;
        if (room === undefined || this.isSameName(room, customerName)) {
            return false;
        }
        room.customerName = customerName;
        room.gameSettings.playersName[1] = customerName;
        return true;
    }

    setState(roomId: string, state: State): void {
        const room = this.find(roomId) as Room;
        room.state = state;
    }

    getGameSettings(roomId: string): GameSettings {
        const room = this.find(roomId) as Room;
        return room.gameSettings;
    }

    deleteRoom(roomId: string): void {
        this.rooms.forEach((room, roomIndex) => {
            if (room.id === roomId) this.rooms.splice(roomIndex, 1);
        });
    }

    find(roomId: string): Room | undefined {
        return this.rooms.find((room) => room.id === roomId);
    }

    isSameName(room: Room, customerName: string): boolean {
        return room.ownerName === customerName;
    }
}
