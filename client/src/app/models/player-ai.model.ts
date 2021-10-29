import { placingBallotBox, strategyBallotBox } from '@app/classes/constants';
import { AIStrategy, PlacingStrategy } from '@app/classes/enum';
import { Letter } from '@app/classes/letter';
import { Range } from '@app/classes/range';
import { PlayerAIComponent } from '@app/modules/game-view/components/player-ai/player-ai.component';
import { PlayStrategy } from './abstract-strategy.model';
import { PlaceLetters } from './place-letter-strategy.model';
import { Player } from './player.model';
import { SkipTurn } from './skip-turn-strategy.model';
import { SwapLetter } from './swap-letter-strategy.model';

export class PlayerAI extends Player {
    context: PlayerAIComponent;
    strategy: PlayStrategy;
    constructor(id: number, name: string, letterTable: Letter[]) {
        super(id, name, letterTable);
        // Initialize the first concrete strategy to be executed later
        this.strategy = new SkipTurn();
    }

    play() {
        // Allow the ai to execute the current strategy whoever it is
        this.strategy.execute(this, this.context);
        // Set the next strategy for next tour
        this.setStrategy();
    }
    setContext(context: PlayerAIComponent) {
        this.context = context;
    }

    replaceStrategy(strategy: PlayStrategy) {
        this.strategy = strategy;
        this.play();
    }

    getHand(): string {
        let hand = '[';
        for (const letter of this.letterTable) {
            hand += letter.value;
        }

        return hand + ']';
    }

    playerQuantityOf(character: string): number {
        let quantity = 0;

        for (const letter of this.letterTable) {
            if (letter.value === character.toUpperCase()) {
                quantity++;
            }
        }

        return quantity;
    }
    private setStrategy() {
        const randomNumber = this.generateRandomNumber(strategyBallotBox.length);
        switch (strategyBallotBox[randomNumber]) {
            case AIStrategy.Skip:
                this.strategy = new SkipTurn();
                break;
            case AIStrategy.Swap:
                this.strategy = new SwapLetter();
                break;
            case AIStrategy.Place:
                // Get a pointing range object which extends PlaceLetters
                this.strategy = new PlaceLetters(this.pointingRange());
                break;
            default:
                this.strategy = new SkipTurn();
                break;
        }
    }

    private pointingRange(): Range {
        let pointingRange: Range;

        const randomNumber = this.generateRandomNumber(placingBallotBox.length);

        switch (placingBallotBox[randomNumber]) {
            case PlacingStrategy.LessSix:
                pointingRange = { min: 1, max: 6 };
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

    private generateRandomNumber(maxValue: number): number {
        return Math.floor(Number(Math.random()) * maxValue);
    }
}
