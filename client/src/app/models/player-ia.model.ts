import { IAStrategy, placingBallotBox, PlacingStrategy, strategyBallotBox } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { Range } from '@app/classes/range';
import { PlayerIAComponent } from '@app/modules/game-view/components/player-ia/player-ia.component';
import { PlayStrategy } from '@app/models/abstract-strategy.model';
import { PlaceLetters } from '@app/models/place-letter-strategy.model';
import { Player } from '@app/models/player.model';
import { SkipTurn } from '@app/models/skip-tour-strategy.model';

export class PlayerIA extends Player {
    context: PlayerIAComponent;
    strategy: PlayStrategy;
    constructor(
        public id: number,
        public name: string,
        public letterTable: Letter[], // public tour: boolean, // public isIA: boolean
    ) {
        super(id, name, letterTable);
        // Initialize the first concrete strategy to be executed later
        this.strategy = new SkipTurn();
    }

    play() {
        // Allow the ia to execute the current strategy whoever it is
        this.strategy.execute(this, this.context);
        // Set the next strategy for next tour
        this.setStrategy();
    }

    setContext(context: PlayerIAComponent) {
        this.context = context;
    }

    private setStrategy() {
        const randomNumber = this.generateRandomNumber(strategyBallotBox.length);

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
                // For bug resolution
                this.strategy = new SkipTurn();
                break;
        }
    }

    private pointingRange(): Range {
        let pointingRange: Range;
        const randomNumber = this.generateRandomNumber(placingBallotBox.length);

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
                // For bug resolution
                pointingRange = { min: 0, max: 0 };
                break;
        }
        return pointingRange;
    }

    private generateRandomNumber(maxValue: number): number {
        return Math.floor(Number(Math.random()) * maxValue);
    }
}
