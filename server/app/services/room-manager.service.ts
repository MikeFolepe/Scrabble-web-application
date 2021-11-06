import { OUT_BOUND_INDEX_OF_SOCKET } from '@app/classes/constants';
import { GameSettings, StartingPlayer } from '@common/game-settings';
import { PlayerIndex } from '@common/PlayerIndex';
import { Room, State } from '@common/room';
import { Service } from 'typedi';

@Service()
export class RoomManagerService {
    rooms: Room[];

    constructor() {
        this.rooms = [];
    }

    createRoom(socketId: string, roomId: string, gameSettings: GameSettings) {
        this.rooms.push(new Room(roomId, socketId, gameSettings));
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
        room.gameSettings.playersName[PlayerIndex.CUSTOMER] = customerName;

        return true;
    }

    setState(roomId: string, state: State): void {
        const room = this.find(roomId) as Room;
        room.state = state;
    }

    setSocket(room: Room, socketId: string): void {
        room.socketIds.push(socketId);
    }

    getGameSettings(roomId: string): GameSettings {
        const room = this.find(roomId) as Room;
        return room.gameSettings;
    }

    formatGameSettingsForCustomerIn(roomId: string): GameSettings {
        const room = this.find(roomId) as Room;
        const gameSettings = room.gameSettings;
        const playerNames: string[] = [gameSettings.playersName[PlayerIndex.CUSTOMER], gameSettings.playersName[PlayerIndex.OWNER]];
        const startingPlayer = gameSettings.startingPlayer ? StartingPlayer.Player1 : StartingPlayer.Player2;
        const formattedGameSettings = new GameSettings(
            playerNames,
            startingPlayer,
            gameSettings.timeMinute,
            gameSettings.timeSecond,
            gameSettings.level,
            gameSettings.randomBonus,
            gameSettings.bonusPositions,
            gameSettings.dictionary,
        );

        return formattedGameSettings;
    }

    deleteRoom(roomId: string): void {
        this.rooms.forEach((room, roomIndex) => {
            if (room.id === roomId) this.rooms.splice(roomIndex, 1);
        });
    }

    findRoomIdOf(socketId: string): string {
        const room = this.rooms.find((rooms) => {
            for (const id of rooms.socketIds) {
                if (socketId === id) return true;
            }
            return false;
        });

        if (room !== undefined) {
            return room.id;
        }
        return '';
    }

    findLoserIndex(socketId: string): number {
        for (const room of this.rooms) {
            for (const ids of room.socketIds) {
                if (ids === socketId) return room.socketIds.indexOf(ids) as number;
            }
        }
        return OUT_BOUND_INDEX_OF_SOCKET;
    }

    getWinnerName(roomId: string, indexOfLoser: number): string {
        const room = this.find(roomId) as Room;
        if (indexOfLoser === 0) return room.gameSettings.playersName[1];
        else return room.gameSettings.playersName[0];
    }
    isNotAvailable(roomId: string): boolean {
        const room = this.find(roomId);

        if (room === undefined) {
            return false;
        }

        return room.state === State.Playing;
    }

    find(roomId: string): Room {
        return this.rooms.find((room) => room.id === roomId) as Room;
    }
}
