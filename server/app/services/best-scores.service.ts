/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable prettier/prettier */
import { SCORES_MODEL_CLASSIC, SCORES_MODEL_LOG2990 } from '@app/classes/database.schema';
import { GameTypes } from '@common/game-types';
import { PlayerScore } from '@common/player';
import * as mongoose from 'mongoose';
import { Service } from 'typedi';

@Service()
export class BestScoresService {
    // TODO: revoir si nécessaire de mettre ceci dans une constante globale.
    readonly numberOfBestPlayers = 5;
    scoresModels = new Map<GameTypes, mongoose.Model<unknown, {}, {}, {}>>([
        [GameTypes.Classic, SCORES_MODEL_CLASSIC],
        [GameTypes.Log2990, SCORES_MODEL_LOG2990],
    ]);

    async addPlayers(players: PlayerScore[], gameType: GameTypes): Promise<void> {
        const scoreModel = this.scoresModels.get(gameType) as mongoose.Model<unknown, {}, {}, {}>;
        for (const player of players) {
            const scoreToAdd = new scoreModel({
                score: player.score,
                playerName: player.playerName,
                isDefault: player.isDefault,
            });
            await scoreToAdd.save();
        }
    }

    async getBestPlayers(gameType: GameTypes): Promise<PlayerScore[]> {
        const scoreModel = this.scoresModels.get(gameType) as mongoose.Model<PlayerScore, {}, {}, {}>;
        const bestPlayers: PlayerScore[] = await scoreModel.find({}).sort({ score: -1 }).limit(this.numberOfBestPlayers).exec();
        return bestPlayers;
    }
}
