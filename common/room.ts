import { GameSettings } from '@common/game-settings';
import { PlayerIndex } from '@common/PlayerIndex';

export enum State {
    Playing,
    Waiting,
}

export class Room {
    roomId: string;
    socketIds: string[] = [];
    gameSettings: GameSettings;
    state: State;

    constructor(roomId: string, socketId: string, gameSettings: GameSettings, state: State = State.Waiting) {
        this.roomId = roomId;
        this.socketIds[PlayerIndex.OWNER] = socketId;
        this.gameSettings = gameSettings;
        this.state = state;
    }

    
}
