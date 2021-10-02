import { IAStrategy, placingBallotBox, PlacingStrategy, strategyBallotBox } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { Range } from '@app/classes/range';
import { PlayerAIComponent } from '@app/modules/game-view/components/player-ia/player-ia.component';
import { PlayStrategy } from './abstract-strategy.model';
import { PlaceLetters } from './place-letter-strategy.model';
import { Player } from './player.model';
import { SkipTurn } from './skip-turn-strategy.model';

export class PlayerIA extends Player {
    context: PlayerAIComponent;
    strategy: PlayStrategy;
    constructor(public id: number, public name: string, public letterTable: Letter[]) {
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
                this.strategy = new PlaceLetters(this.pointingRange());
                break;
            case IAStrategy.Swap:
                this.strategy = new PlaceLetters(this.pointingRange());
                break;
            case IAStrategy.Place:
                // Get a pointing range object which extends PlaceLetters
                this.strategy = new PlaceLetters(this.pointingRange());
                break;
            default:
                this.strategy = new SkipTurn();
                break;
        }
    }

    pointingRange(): Range {
        let pointingRange: Range;

        let randomNumber = new Date().getTime();
        // Random number [0, 10[ which corresponds on the placing strategies defined on the
        // placingBallotBox urn in constants.ts
        randomNumber = randomNumber % placingBallotBox.length;

        switch (placingBallotBox[randomNumber]) {
            case PlacingStrategy.LessSix:
                pointingRange = { min: 0, max: 6 };
                break;
            case PlacingStrategy.SevenToTwelve:
                pointingRange = { min: 7, max: 12 };
                break;
            case PlacingStrategy.ThirteenToEighteen:
                pointingRange = { min: 13, max: 18 };
                break;
            default:
                pointingRange = { min: 0, max: 0 };
                break;
        }

        return pointingRange;
    }

    setContext(context: PlayerAIComponent) {
        this.context = context;
    }

    replaceStrategy(strategy: PlayStrategy) {
        this.strategy = strategy;
        this.play();
    }
}
