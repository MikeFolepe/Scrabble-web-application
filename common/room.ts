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
    socketIds: string[] = [];

    constructor(roomId: string, socketId: string, gameSettings: GameSettings, state: State = State.Waiting) {
        this.id = roomId;
        this.socketIds = new Array<string>();
        this.socketIds[PlayerIndex.OWNER] = socketId;
        this.gameSettings = gameSettings;
        this.state = state;
        this.socketIds.push(socketId);
    }
}
