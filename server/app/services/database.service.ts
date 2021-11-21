import { AI_BEGINNERS, AI_EXPERTS, DATABASE_URL } from '@app/classes/constants';
import { AI_MODELS, DbModel } from '@app/classes/database.schema';
import { AiType } from '@common/ai-name';
import * as mongoose from 'mongoose';
import { Service } from 'typedi';
@Service()
export class DatabaseService {
    database: mongoose.Mongoose = mongoose;
    private options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as mongoose.ConnectOptions;

    async start(): Promise<void> {
        await this.database
            .connect(DATABASE_URL, this.options)
            .then(() => {
                // JUSTIFICATION : required in order to display the DB connection status
                // eslint-disable-next-line no-console
                console.log('Connected successfully to Mongodb Atlas');
            })
            .catch(() => {
                throw new Error('Distant database connection error');
            });

        this.setDefaultData(AiType.beginner);
        this.setDefaultData(AiType.expert);
    }

    async closeConnection(): Promise<void> {
        await mongoose.connection.close();
    }

    async setDefaultData(aiEnum: number): Promise<void> {
        const aiModel = AI_MODELS.get(aiEnum) as DbModel;
        await aiModel.deleteMany({ isDefault: true }).exec();

        const players = aiEnum ? AI_EXPERTS : AI_BEGINNERS;
        for (const aiPlayer of players) {
            const player = new aiModel({
                aiName: aiPlayer.aiName,
                isDefault: aiPlayer.isDefault,
            });
            await player.save();
        }
    }
}
