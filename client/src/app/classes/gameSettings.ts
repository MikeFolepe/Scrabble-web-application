// eslint-disable-next-line unicorn/filename-case
export enum StartingPlayer {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    humanPlayer,
    IAPlayer,
}
/* eslint-disable prettier/prettier */
/* eslint-disable unicorn/filename-case */
export interface GameSettings {
    playerName: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    IA_Name: string;
    startingPlayer: StartingPlayer;
    timeMinute: string;
    timeSecond: string;
    level: string;
    randomBonus: boolean | undefined;
    dictionary: string | undefined;
}
