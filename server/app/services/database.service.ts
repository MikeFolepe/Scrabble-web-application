import { DATABASE_URL, DEFAULT_SCORES } from '@app/classes/constants';
import { SCORE_MODEL } from '@app/classes/database.schema';
import * as mongoose from 'mongoose';
import { Service } from 'typedi';

@Service()
export class DatabaseService {
    private options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as mongoose.ConnectOptions;

    async start(url: string = DATABASE_URL): Promise<void> {
        await mongoose
            .connect(url, this.options)
            .then(() => {
                // eslint-disable-next-line no-console
                console.log('Connected successfully to Mongodb Atlas');
            })
            .catch(() => {
                throw new Error('Distant database connection error');
            });
        this.setDefaultScores();
    }

    async setDefaultScores() {
        await SCORE_MODEL.deleteMany({ isDefault: true }).exec();
        for (const player of DEFAULT_SCORES) {
            const score = new SCORE_MODEL({
                score: player.score,
                playerName: player.playerName,
                isDefault: player.isDefault,
            });
            await score.save();
        }
    }

    async resetScores(): Promise<void> {
        await SCORE_MODEL.deleteMany({ isDefault: false }).exec();
    }

    async closeConnection(): Promise<void> {
        await mongoose.connection.close();
    }
}
