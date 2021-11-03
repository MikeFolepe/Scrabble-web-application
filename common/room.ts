import { GameSettings } from '@common/game-settings';
import { PlayerIndex } from '@common/PlayerIndex';

export enum State {
    Playing,
    Waiting,
}

export class Room {
    id: string;
    gameSettings: GameSettings;
    state: State;
    socketIds: string[];

    constructor(roomId: string, socketId: string, gameSettings: GameSettings, state: State = State.Waiting) {
        this.id = roomId;
        this.gameSettings = gameSettings;
        this.state = state;
        this.socketIds = new Array<string>(2);
        this.socketIds[PlayerIndex.OWNER] = socketId;
    }

    addCustomer(customerName: string) {
        this.gameSettings.playersName[PlayerIndex.CUSTOMER] = customerName;
    }

    setSocketId(customerSocketId: string) {
        this.socketIds.push(customerSocketId);
    }
}
