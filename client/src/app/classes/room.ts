import { GameSettings } from '@common/game-settings';

export enum State {
    Playing,
    Waiting,
}

export class Room {
    id: string;
    gameSettings: GameSettings;
    state: State;
    socketIds: string[] = [];

    constructor(roomId: string, socketId: string, gameSettings: GameSettings, state: State = State.Waiting) {
        this.id = roomId;
        this.gameSettings = gameSettings;
        this.state = state;
        this.socketIds.push(socketId);
    }

    addCustomer(customerName: string) {
        this.gameSettings.playersName[1] = customerName;
    }

    setSocketId(customerSocketId: string) {
        this.socketIds.push(customerSocketId);
    }
}
