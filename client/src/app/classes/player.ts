import { LetterEasel } from './letter-easel';
export interface Player {
    id: number;
    name: string;
    score: number;
    letterTable: LetterEasel[];
    isTour: boolean;
    state: string; // actif ou pas
}
