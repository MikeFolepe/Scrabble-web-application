/* eslint-disable no-underscore-dangle */
/* eslint-disable max-classes-per-file */
import { LetterEasel } from './letter-easel';
export class Player {
    name_: string;
    score_: number;
    letterTable_: LetterEasel[];
    isTour_: boolean;
    constructor(name: string, isTour: boolean) {
        this.name_ = name;
        this.score_ = 0;
        this.isTour_ = isTour;
    }

    getName(): string {
        return this.name_;
    }

    getScore(): number {
        return this.score_;
    }

    getIsTour(): boolean {
        return this.isTour_;
    }

    getLetterTable(): LetterEasel[] {
        return this.letterTable_;
    }
}

export class PlayerIA extends Player {
    // playStrategy_: PlayStrategy;
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(name: string, isTour: boolean) {
        super(name, isTour);
    }
    play(): void {
        // this.playStrategy_.execute(this);
    }
}

export class PlayerHuman extends Player {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(name: string, isTour: boolean) {
        super(name, isTour);
    }
}
