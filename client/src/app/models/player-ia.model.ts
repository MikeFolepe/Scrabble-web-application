import { IAStrategy, placingBallotBox, PlacingStrategy, strategyBallotBox } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { PlayerIAComponent } from '@app/modules/game-view/components/player-ia/player-ia.component';
import { PlayStrategy } from './abstract-strategy.model';
import { LessSix } from './less-six-placing.model';
import { PlaceLetters } from './place-letter-strategy.model';
import { Player } from './player.model';
import { SevenTwelve } from './seven-twelve-placing-strategy.model';
import { SkipTurn } from './skip-turn-strategy.model';
import { SwapLetter } from './swap-letter-strategy.model';
import { ThirteenEighteen } from './thirteen-eighteen-placing-strategy.model';

export class PlayerIA extends Player {
    context: PlayerIAComponent;
    strategy: PlayStrategy;
    constructor(
        public id: number,
        public name: string,
        public letterTable: Letter[], // public isTour: boolean, // public isIA: boolean
    ) {
        super(id, name, letterTable);
        // Initialize the first concrete strategy to be executed later
        this.setStrategy();
    }

    play() {
        // Allow the ia to execute the current strategy whoever it is
        this.strategy.execute(this, this.context);
        // Set the next strategy for next turn
        this.setStrategy();
    }

    setStrategy() {
        // Number of seconds since 1st January 1970
        let randomNumber = new Date().getTime();
        // Random number [0, 10[ which corresponds on the placing strategies defined on the
        // strategiesBallotBox urn in constants.ts
        randomNumber = randomNumber % strategyBallotBox.length;

        switch (strategyBallotBox[randomNumber]) {
            case IAStrategy.Skip:
                this.strategy = new SkipTurn();
                break;
            case IAStrategy.Swap:
                this.strategy = new SwapLetter();
                break;
            case IAStrategy.Place:
                // Get a pointing range object which extends PlaceLetters
                this.strategy = this.pointingRange();
                break;
            default:
                // For bug resolution
                this.strategy = new SkipTurn();
                break;
        }
    }

    pointingRange(): PlaceLetters {
        let placingStrategy: PlaceLetters;

        // Number of seconds since 1st January 1970
        let randomNumber = new Date().getTime();
        // Random number [0, 10[ which corresponds on the placing strategies defined on the
        // placingBallotBox urn in constants.ts
        randomNumber = randomNumber % placingBallotBox.length;

        switch (placingBallotBox[randomNumber]) {
            case PlacingStrategy.LessSix:
                placingStrategy = new LessSix();
                break;
            case PlacingStrategy.SevenToTwelve:
                placingStrategy = new SevenTwelve();
                break;
            case PlacingStrategy.ThirteenToEighteen:
                placingStrategy = new ThirteenEighteen();
                break;
            default:
                // For bug resolution
                placingStrategy = new LessSix();
                break;
        }

        return placingStrategy;
    }

    setContext(context: PlayerIAComponent) {
        this.context = context;
    }
}
