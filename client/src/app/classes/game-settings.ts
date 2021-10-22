export enum StartingPlayer {
    Player1,
    Player2,
}

export class GameSettings {
    constructor(
        public playersName: string[],
        public startingPlayer: StartingPlayer,
        public timeMinute: string,
        public timeSecond: string,
        public level: string,
        public randomBonus: string,
        public DICTIONARY: string,
    ) {}
}
