/* eslint-disable sort-imports */
import { AIStrategy, placingBallotBox, PlacingStrategy, strategyBallotBox } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { Range } from '@app/classes/range';
import { PlayerAIService } from '@app/services/player-ia.service';
import { PlayStrategy } from './abstract-strategy.model';
import { PlaceLetters } from './place-letter-strategy.model';
import { Player } from './player.model';
import { SkipTurn } from './skip-turn-strategy.model';
import { SwapLetter } from './swap-letter-strategy.model';

export class PlayerAI extends Player {
    strategy: PlayStrategy;
    constructor(id: number, name: string, letterTable: Letter[], public playerAiService: PlayerAIService) {
        super(id, name, letterTable);
        // Initialize the first concrete strategy to be executed later
        this.setStrategy();
    }

    play() {
        // Allow the ai to execute the current strategy whoever it is
        this.strategy.execute(this.playerAiService);
        // Set the next strategy for next tour
        this.setStrategy();
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
        return Math.floor(Math.random() * maxValue);
    }
}
