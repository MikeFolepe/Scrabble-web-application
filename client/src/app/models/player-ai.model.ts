/* eslint-disable sort-imports */
import { placingBallotBox, PlacingStrategy } from '@app/classes/constants';
import { Range } from '@app/classes/range';
import { PlayerAIService } from '@app/services/player-ia.service';
import { Letter } from '@common/letter';
import { PlaceLetterStrategy } from './place-letter-strategy.model';
import { Player } from './player.model';

export class PlayerAI extends Player {
    private strategy: PlaceLetterStrategy;
    constructor(id: number, name: string, letterTable: Letter[], public playerAiService: PlayerAIService) {
        super(id, name, letterTable);
        this.strategy = new PlaceLetterStrategy(this.pointingRange());
    }

    play() {
        this.strategy.execute(this.playerAiService);
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
