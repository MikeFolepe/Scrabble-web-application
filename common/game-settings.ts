export enum StartingPlayer {
    Player1,
    Player2,
}

export class GameSettings {
    constructor(
        public playersNames: string[],
        public startingPlayer: StartingPlayer,
        public timeMinute: string,
        public timeSecond: string,
        public level: string,
        public randomBonus: string,
        public bonusPositions: string,
        public objectiveIds: number[][] = [[], []],
        public dictionary: string[],
    ) {}
}
