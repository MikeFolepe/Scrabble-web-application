import { LetterEasel } from './letter-easel';

export interface Player{
    id: number;
    nom: string;
    score: number;
    letterTable: LetterEasel[];
    isTour: boolean;
    state: string;
}
