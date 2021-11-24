import { AiType } from '@common/ai-name';
import * as mongoose from 'mongoose';
import { GameType } from '@common/game-type';
import { PlayerScore } from '@common/player';

// JUSTIFICATION : ... (utiliser unknown ?)
// JUSTIFICATION : ...
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
export type DbModel = mongoose.Model<any, {}, {}, {}>;

const scoreSchema = new mongoose.Schema({
    score: { type: Number, required: true },
    playerName: { type: String, required: true },
    isDefault: { type: Boolean, required: true },
});

const aiNameSchema = new mongoose.Schema({
    aiName: { type: String, required: true },
    isDefault: { type: Boolean, required: true },
});

const beginnerNameModel = mongoose.model('AiBeginnerName', aiNameSchema);
const expertNameModel = mongoose.model('AiExpertName', aiNameSchema);

export const SCORE_MODEL = mongoose.model('Score', scoreSchema);
export const SCORES_MODEL_CLASSIC = mongoose.model('ScoresClassic', scoreSchema);
export const SCORES_MODEL_LOG2990 = mongoose.model('ScoresLog2990', scoreSchema);
export const BEGINNER_NAME_MODEL = mongoose.model('AiBeginnerName', aiNameSchema);
export const EXPERT_NAME_MODEL = mongoose.model('AiExpertName', aiNameSchema);

export const AI_MODELS: Map<AiType, DbModel> = new Map<AiType, DbModel>([
    [AiType.beginner, beginnerNameModel],
    [AiType.expert, expertNameModel],
]);

export const SCORES_MODEL = new Map<GameType, mongoose.Model<PlayerScore>>([
    [GameType.Classic, SCORES_MODEL_CLASSIC],
    [GameType.Log2990, SCORES_MODEL_LOG2990],
]);
