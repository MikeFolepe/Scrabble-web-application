import { BEGINNER_NAME_MODEL, EXPERT_NAME_MODEL } from '@app/classes/database.schema';
import { AiNameDB } from '@common/ai-name';
import { Service } from 'typedi';

@Service()
export class AdministratorService {
    getAllAiBeginnerPlayers(): AiNameDB[] {
        const aiPlayers: AiNameDB[] = [];
        BEGINNER_NAME_MODEL.find({}).then((beginners) => {
            for (const beginner of beginners) {
                const aiPlayer: AiNameDB = {
                    aiName: '',
                    isDefault: false,
                    id: '',
                };

                aiPlayer.aiName = beginner.aiName;
                aiPlayer.isDefault = beginner.isDefault;
                // eslint-disable-next-line no-underscore-dangle
                aiPlayer.id = beginner._id.toString();
                aiPlayers.push(aiPlayer);
            }
        });

        return aiPlayers;
    }

    getAllAiExpertPlayers(): AiNameDB[] {
        const aiPlayers: AiNameDB[] = [];
        EXPERT_NAME_MODEL.find({}).then((experts) => {
            for (const expert of experts) {
                const aiPlayer: AiNameDB = {
                    aiName: '',
                    isDefault: false,
                    id: '',
                };

                aiPlayer.aiName = expert.aiName;
                aiPlayer.isDefault = expert.isDefault;
                // eslint-disable-next-line no-underscore-dangle
                aiPlayer.id = expert._id.toString();
                aiPlayers.push(aiPlayer);
            }
        });

        return aiPlayers;
    }
}
