/* eslint-disable @typescript-eslint/naming-convention */
import * as mongoose from 'mongoose';

export type Score = mongoose.Document & {
    score: number;
    playerName: string;
};

export type AiExpertName = mongoose.Document & {
    aiExpertName: string;
};

export type AiBeginnerName = mongoose.Document & {
    aiName: string;
};
const scoreSchema = new mongoose.Schema({
    score: { type: Number, required: true },
    playerName: { type: String, required: true },
});

const aiNameSchema = new mongoose.Schema({
    aiName: { type: String, required: true },
});

const aiExpertSchema = new mongoose.Schema({
    aiExpertName: { type: String, required: true },
});

export const ScoreModel = mongoose.model<Score>('Score', scoreSchema);
export const expertNameModel = mongoose.model<AiExpertName>('AiExpertName', aiExpertSchema);
export const beginnerNameModel = mongoose.model<AiBeginnerName>('AiBeginnerName', aiNameSchema);
