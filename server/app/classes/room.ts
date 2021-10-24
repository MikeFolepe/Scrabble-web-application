// eslint-disable-next-line no-restricted-imports
import { GameSettings } from './multiplayer-game-settings';

export enum State {
    Playing,
    Waiting,
}

export class Room {
    id: string;
    ownerName: string;
    customerName: string;
    gameSettings: GameSettings;
    state: State;
    constructor(id: string, ownerName: string, gameSettings: GameSettings, state: State = State.Waiting) {
        this.id = id;
        this.ownerName = ownerName;
        this.gameSettings = gameSettings;
        this.state = state;
    }

    addCustomer(customerName: string) {
        this.customerName = customerName;
    }
}
