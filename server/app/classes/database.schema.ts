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
export const SCORE_MODEL = mongoose.model('Score', scoreSchema);
export const BEGINNER_NAME_MODEL = mongoose.model('AiBeginnerName', aiNameSchema);
export const EXPERT_NAME_MODEL = mongoose.model('AiExpertName', aiNameSchema);
