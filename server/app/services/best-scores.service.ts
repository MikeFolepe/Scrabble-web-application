/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable prettier/prettier */
import { SCORE_MODEL } from '@app/classes/database.schema';
import { PlayerScore } from '@common/player';
import { Service } from 'typedi';

@Service()
export class BestScoresService {
    async addPlayers(player: PlayerScore[]): Promise<void> {
        let score = new SCORE_MODEL({
            score: player[0].score,
            playerName: player[0].playerName,
            isDefault: player[0].isDefault,
        });
        await score.save();

        score = new SCORE_MODEL({
            score: player[1].score,
            playerName: player[1].playerName,
            isDefault: player[1].isDefault,
        });
        await score.save();
    }

    async getBestPlayers(): Promise<PlayerScore[]> {
        const players: PlayerScore[] = await SCORE_MODEL.find({}).sort({ score: -1 }).limit(5).exec();
        return players;
    }
}
