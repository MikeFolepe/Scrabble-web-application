import * as mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
    score: { type: Number, required: true },
    playerName: { type: String, required: true },
    isDefault: { type: Boolean, required: true },
});

const aiNameSchema = new mongoose.Schema({
    aiName: { type: String, required: true },
    isDefault: { type: Boolean, required: true },
});
export const SCORES_MODEL_CLASSIC = mongoose.model('ScoresClassic', scoreSchema);
export const SCORES_MODEL_LOG2990 = mongoose.model('ScoresLog2990', scoreSchema);
export const BEGINNER_NAME_MODEL = mongoose.model('AiBeginnerName', aiNameSchema);
export const EXPERT_NAME_MODEL = mongoose.model('AiExpertName', aiNameSchema);
