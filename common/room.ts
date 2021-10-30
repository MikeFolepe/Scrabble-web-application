import { GameSettings } from '@common/game-settings';
import { PlayerIndex } from '@common/PlayerIndex';

export enum State {
    Playing,
    Waiting,
}

export class Room {
    roomId: string;
    gameSettings: GameSettings;
    state: State;
    socketIds: string[];

    constructor(roomId: string, socketID: string, gameSettings: GameSettings, state: State = State.Waiting) {
        this.roomId = roomId;
        this.gameSettings = gameSettings;
        this.state = state;
        this.socketIds = new Array<string>(2);
        this.socketIds[PlayerIndex.OWNER] = socketID;
    }

    addCustomer(customerName: string) {
        this.gameSettings.playersName[PlayerIndex.CUSTOMER] = customerName;
    }

    setSocketId(customerSocketID : string){
        this.socketIds.push(customerSocketID);
    }
}
