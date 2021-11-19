import * as mongoose from 'mongoose';

export type Score = mongoose.Document & {
    score: number;
    playerName: string;
    isDefault: boolean;
};

export type AiExpertName = mongoose.Document & {
    aiExpertName: string;
};

export type AiBeginnerName = mongoose.Document & {
    aiName: string;
};
const SCORE_SCHEMA = new mongoose.Schema({
    score: { type: Number, required: true },
    playerName: { type: String, required: true },
    isDefault: { type: Boolean, required: true },
});

const AI_NAME_SCHEMA = new mongoose.Schema({
    aiName: { type: String, required: true },
});

const AI_EXPERT_SCHEMA = new mongoose.Schema({
    aiExpertName: { type: String, required: true },
});

export const SCORE_MODEL = mongoose.model<Score>('Score', SCORE_SCHEMA);
export const BEGINNER_NAME_MODEL = mongoose.model<AiBeginnerName>('AiBeginnerName', AI_NAME_SCHEMA);
export const EXPERT_NAME_MODEL = mongoose.model<AiExpertName>('AiExpertName', AI_EXPERT_SCHEMA);
