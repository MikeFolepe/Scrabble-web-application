/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { AiType } from '@common/ai-name';
import * as mongoose from 'mongoose';

export type DbModel = mongoose.Model<any, {}, {}, {}>;

const scoreSchema = new mongoose.Schema({
    score: { type: Number, required: true },
    playerName: { type: String, required: true },
});

const aiNameSchema = new mongoose.Schema({
    aiName: { type: String, required: true },
    isDefault: { type: Boolean, required: true },
});
export const SCORE_MODEL = mongoose.model('Score', scoreSchema);

const beginnerNameModel = mongoose.model('AiBeginnerName', aiNameSchema);
const expertNameModel = mongoose.model('AiExpertName', aiNameSchema);

export const AI_MODELS: Map<number, DbModel> = new Map<number, DbModel>([
    [AiType.beginner, beginnerNameModel],
    [AiType.expert, expertNameModel],
]);
