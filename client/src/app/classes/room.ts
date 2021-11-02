import { GameSettings } from './game-settings';

export enum State {
    Playing,
    Waiting,
}

export class Room {
    id: string;
    gameSettings: GameSettings;
    state: State;

    constructor(id: string, gameSettings: GameSettings, state: State = State.Waiting) {
        this.id = id;
        this.gameSettings = gameSettings;
        this.state = state;
    }

    addCustomer(customerName: string) {
        this.gameSettings.playersName[1] = customerName;
    }
}
