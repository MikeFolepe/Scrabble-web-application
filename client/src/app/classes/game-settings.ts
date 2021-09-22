export enum StartingPlayer {
    Player1,
    Player2,
}

export interface GameSettings {
    playersName: string[];
    startingPlayer: StartingPlayer;
    timeMinute: string;
    timeSecond: string;
    level: string;
    randomBonus: boolean | undefined;
    dictionary: string | undefined;
}
