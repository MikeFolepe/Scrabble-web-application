// eslint-disable-next-line no-restricted-imports
import { GameSettings } from '@common/game-settings';

export enum State {
    Playing,
    Waiting,
}

export class Room {
    roomId: string;
    gameSettings: GameSettings;
    state: State;
    socketIds: string[] = [];

    constructor(roomId: string, socketID: string, gameSettings: GameSettings, state: State = State.Waiting) {
        this.roomId = roomId;
        this.gameSettings = gameSettings;
        this.state = state;
        this.socketIds.push(socketID);
    }
}
