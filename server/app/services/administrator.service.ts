import { BEGINNER_NAME_MODEL, EXPERT_NAME_MODEL } from '@app/classes/database.schema';
import { AiPlayer, AiPlayerDB } from '@common/ai-name';
import { Service } from 'typedi';

@Service()
export class AdministratorService {
    private newAiPlayer: AiPlayerDB;
    async getAllAiBeginnerPlayers(): Promise<AiPlayerDB[]> {
        const aiNames = await BEGINNER_NAME_MODEL.find({}).exec();
        return aiNames;
    }

    async getAllAiExpertPlayers(): Promise<AiPlayerDB[]> {
        const aiNames = await EXPERT_NAME_MODEL.find({}).exec();
        return aiNames;
    }

    async addBeginnerAi(aiBeginner: AiPlayer): Promise<AiPlayerDB> {
        const aiBeginnerPlayer = new BEGINNER_NAME_MODEL({
            aiName: aiBeginner.aiName,
            isDefault: aiBeginner.isDefault,
        });
        await aiBeginnerPlayer.save().then((aiBeginnerDB: AiPlayerDB) => {
            this.newAiPlayer = aiBeginnerDB;
        });
        return this.newAiPlayer;
    }

    async addExpertAi(aiExpert: AiPlayer): Promise<AiPlayerDB> {
        const aiExpertPlayer = new EXPERT_NAME_MODEL({
            aiName: aiExpert.aiName,
            isDefault: aiExpert.isDefault,
        });
        await aiExpertPlayer.save().then((aiExpertDB: AiPlayerDB) => {
            this.newAiPlayer = aiExpertDB;
        });
        return this.newAiPlayer;
    }

    async deleteBeginnerAi(id: string): Promise<AiPlayerDB[]> {
        await BEGINNER_NAME_MODEL.findByIdAndDelete(id).exec();
        return await this.getAllAiBeginnerPlayers();
    }

    async deleteAiExpert(id: string): Promise<AiPlayerDB[]> {
        await EXPERT_NAME_MODEL.findByIdAndDelete(id).exec();
        return await this.getAllAiExpertPlayers();
    }

    async updateAiBeginner(id: string, aiBeginner: AiPlayer): Promise<AiPlayerDB[]> {
        await BEGINNER_NAME_MODEL.findByIdAndUpdate(id, { aiName: aiBeginner.aiName }).exec();
        return await this.getAllAiBeginnerPlayers();
    }

    async updateAiExpert(id: string, aiExpert: AiPlayer): Promise<AiPlayerDB[]> {
        await EXPERT_NAME_MODEL.findByIdAndUpdate(id, { aiName: aiExpert.aiName }).exec();
        return await this.getAllAiExpertPlayers();
    }
}
