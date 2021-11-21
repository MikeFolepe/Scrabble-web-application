import { OUT_BOUND_INDEX_OF_SOCKET } from '@app/classes/constants';
import { GameSettings, StartingPlayer } from '@common/game-settings';
import { PlayerIndex } from '@common/PlayerIndex';
import { Room, State } from '@common/room';
import { Service } from 'typedi';

@Service()
export class RoomManagerService {
    rooms: Room[];
    // TODO: prendre une decision PM
    // roomWaiting: Room[];

    constructor() {
        this.rooms = [];
        // TODO: prendre une decision PM
        // this.roomWaiting = [];
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
        const room = this.find(roomId);
        if (room === undefined) return false;
        room.gameSettings.playersNames[PlayerIndex.CUSTOMER] = customerName;

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
        const playerNames: string[] = [gameSettings.playersNames[PlayerIndex.CUSTOMER], gameSettings.playersNames[PlayerIndex.OWNER]];
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

        return room !== undefined ? room.id : '';
    }

    // TODO: loser --> looser ??
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
        return indexOfLoser === 0 ? room.gameSettings.playersNames[1] : room.gameSettings.playersNames[0];
    }

    isNotAvailable(roomId: string): boolean {
        const room = this.find(roomId);
        return room === undefined ? false : room.state === State.Playing;
    }

    find(roomId: string): Room | undefined {
        return this.rooms.find((room) => room.id === roomId);
    }

    findRoomInWaitingState(customerName: string): Room | undefined {
        const roomWaiting: Room[] = [];
        for (const room of this.rooms) {
            if (room.state === State.Waiting && room.gameSettings.playersNames[PlayerIndex.OWNER] !== customerName) {
                roomWaiting.push(room);
            }
        }
        if (roomWaiting.length === 0) return;
        const roomIndex = Math.floor(Math.random() * roomWaiting.length);
        return roomWaiting[roomIndex] as Room;
    }

    getNumberofRoomInWaitingState(): number {
        let numberOfRoom = 0;
        for (const room of this.rooms) {
            if (room.state === State.Waiting) numberOfRoom++;
        }
        return numberOfRoom;
    }
}
