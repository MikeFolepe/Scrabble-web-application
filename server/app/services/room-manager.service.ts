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

    createRoom(roomId: string, gameSettings: GameSettings) {
        this.rooms.push(new Room(this.createRoomId(gameSettings.playersName[0]), gameSettings));
    }

    createRoomId(playerName: string) {
        return (
            new Date().getFullYear().toString() +
            new Date().getMonth().toString() +
            new Date().getHours().toString() +
            new Date().getMinutes().toString() +
            new Date().getSeconds().toString() +
            new Date().getMilliseconds().toString() +
            playerName
        );
    }

    addCustomer(customerName: string, roomId: string): boolean {
        const room = this.find(roomId) as Room;
        if (room === undefined) {
            return false;
        }
        room.addCustomer(customerName);
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

    formatGameSettingsForCustomerIn(roomId: string): GameSettings {
        const room = this.find(roomId) as Room;
        const gameSettings = room.gameSettings;
        const playerNames: string[] = [gameSettings.playersName[1], gameSettings.playersName[0]];
        const startingPlayer = gameSettings.startingPlayer ? 0 : 1;
        const formattedGameSettings = new GameSettings(
            playerNames,
            startingPlayer,
            gameSettings.timeMinute,
            gameSettings.timeSecond,
            gameSettings.randomBonus,
            gameSettings.randomBonus,
            gameSettings.dictionary,
        );

        return formattedGameSettings;
    }

    deleteRoom(roomId: string) {
        this.rooms.forEach((room, roomIndex) => {
            if (room.id === roomId) this.rooms.splice(roomIndex, 1);
        });
    }

    isNotAvailable(roomId: string): boolean {
        const room = this.find(roomId);

        if (room === undefined) {
            return false;
        }

        return room.state === State.Playing;
    }

    find(roomId: string): Room | undefined {
        return this.rooms.find((room) => room.id === roomId);
    }
}
