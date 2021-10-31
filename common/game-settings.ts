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
<<<<<<< HEAD:client/src/app/classes/game-settings.ts
        public DICTIONARY: string,
=======
        public dictionary: string,
>>>>>>> b7bc76bb223ef4674011ed696c8d797922f78013:common/game-settings.ts
    ) {}
}
