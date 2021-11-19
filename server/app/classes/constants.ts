import { PlayerScore } from '@common/player';

export const OUT_BOUND_INDEX_OF_SOCKET = 5;
export const DELAY_OF_DISCONNECT = 5000;
export const DATABASE_URL = 'mongodb+srv://Team107:xxtyU48kHQ4ZqDW@cluster0.i7hu4.mongodb.net/database?retryWrites=true&w=majority';
export const DEFAULT_SCORES: PlayerScore[] = [
    {
        score: 15,
        playerName: 'Abba',
        isDefault: true,
    },
    {
        score: 20,
        playerName: 'Abbe',
        isDefault: true,
    },
    {
        score: 25,
        playerName: 'Abbi',
        isDefault: true,
    },
    {
        score: 30,
        playerName: 'Abbo',
        isDefault: true,
    },
    {
        score: 35,
        playerName: 'Abby',
        isDefault: true,
    },
];
