import { AI_MODELS, DbModel } from '@app/classes/database.schema';
import { AiPlayer, AiPlayerDB, AiType } from '@common/ai-name';
import { Dictionary } from '@common/dictionary';
import * as fileSystem from 'fs';
import { Service } from 'typedi';
@Service()
export class AdministratorService {
    private newAiPlayer: AiPlayerDB;
    private dictionaries: Dictionary[] = [];

    async getAllAiPlayers(aiType: AiType): Promise<AiPlayerDB[]> {
        const aiModel = AI_MODELS.get(aiType) as DbModel;
        const aiPlayers = await aiModel.find({}).exec();
        return aiPlayers;
    }

    async addAiPlayer(aiPlayer: AiPlayer, aiType: AiType): Promise<AiPlayerDB> {
        const aiModel = AI_MODELS.get(aiType) as DbModel;
        const aiToSave = new aiModel({
            aiName: aiPlayer.aiName,
            isDefault: aiPlayer.isDefault,
        });
        await aiToSave.save().then((ai: AiPlayerDB) => {
            this.newAiPlayer = ai;
        });
        return this.newAiPlayer;
    }

    async deleteAiPlayer(id: string, aiType: AiType): Promise<AiPlayerDB[]> {
        const aiModel = AI_MODELS.get(aiType) as DbModel;
        await aiModel.findByIdAndDelete(id).exec();
        return await this.getAllAiPlayers(aiType);
    }

    async updateAiPlayer(id: string, object: { aiBeginner: AiPlayer; aiType: AiType }): Promise<AiPlayerDB[]> {
        const aiModel = AI_MODELS.get(object.aiType) as DbModel;
        await aiModel.findByIdAndUpdate(id, { aiName: object.aiBeginner.aiName }).exec();
        return await this.getAllAiPlayers(object.aiType);
    }

    getDictionaries(): Dictionary[] {
        this.dictionaries = [];
        const files = fileSystem.readdirSync('./dictionaries/', 'utf8');
        for (const file of files) {
            const readFile = JSON.parse(fileSystem.readFileSync(`./dictionaries/${file}`, 'utf8'));
            const isDefault = file === 'dictionary.json' ? true : false;
            const dictionary: Dictionary = {
                fileName: file,
                title: readFile.title,
                description: readFile.description,
                isDefault,
            };
            this.dictionaries.push(dictionary);
        }
        return this.dictionaries;
    }

    updateDictionary(dictionary: Dictionary): Dictionary[] {
        const readFile = JSON.parse(fileSystem.readFileSync(`./dictionaries/${dictionary.fileName}`, 'utf8'));
        readFile.title = dictionary.title;
        readFile.description = dictionary.description;
        fileSystem.writeFileSync(`./dictionaries/${dictionary.fileName}`, JSON.stringify(readFile), 'utf8');
        return this.getDictionaries();
    }

    deleteDictionary(fileName: string): Dictionary[] {
        fileSystem.unlinkSync(`./dictionaries/${fileName}`);
        return this.getDictionaries();
    }

    // resetDictionaries(): Dictionary[] {
    //     for (const dictionary of this.dictionaries) {
    //         if (!dictionary.isDefault) {
    //             fileSystem.unlinkSync(`./dictionaries/${dictionary.fileName}`);
    //         }
    //     }
    //     return this.getDictionaries();
    // }

    // async resetAiPlayers(): Promise<AiPlayerDB[]> {
    //     await AI_MODELS.get(AiType.beginner)?.deleteMany({ isDefault: false }).exec();
    //     await AI_MODELS.get(AiType.expert)?.deleteMany({ isDefault: false }).exec();
    //     return await this.getAllAiPlayers();
    // }
}
