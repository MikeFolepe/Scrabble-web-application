import { AI_BEGINNERS, AI_EXPERTS, DATABASE_URL } from '@app/classes/constants';
import { BEGINNER_NAME_MODEL, EXPERT_NAME_MODEL } from '@app/classes/database.schema';
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

        this.setDefaultData();
    }

    async closeConnection(): Promise<void> {
        await mongoose.connection.close();
    }

    async setDefaultData(): Promise<void> {
        await BEGINNER_NAME_MODEL.deleteMany({ isDefault: true }).exec();
        await EXPERT_NAME_MODEL.deleteMany({ isDefault: true }).exec();
        for (const aiBeginner of AI_BEGINNERS) {
            const beginner = new BEGINNER_NAME_MODEL({
                aiName: aiBeginner.aiName,
                isDefault: aiBeginner.isDefault,
            });
            await beginner.save();
        }

        for (const aiExpert of AI_EXPERTS) {
            const expert = new EXPERT_NAME_MODEL({
                aiName: aiExpert.aiName,
                isDefault: aiExpert.isDefault,
            });
            await expert.save();
        }
    }

    async resetData(): Promise<void> {
        await BEGINNER_NAME_MODEL.deleteMany({ isDefault: false }).exec();
        await EXPERT_NAME_MODEL.deleteMany({ isDefault: false }).exec();
        // TODO supprimer meilleurs scores
        // TODO supprimer dictionnaires
    }
}
