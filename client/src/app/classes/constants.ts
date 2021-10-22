/* eslint-disable max-lines */
import { Letter } from '@app/classes/letter';
// eslint-disable-next-line no-restricted-imports
import DICTIONARYData from '../../assets/dictionnary.json';

export const DEFAULT_WIDTH = 750;
export const DEFAULT_HEIGHT = 750;
export const ONESECOND_TIME = 1000;
export const BOARD_SIZE = 16;
export const CASE_SIZE = DEFAULT_WIDTH / BOARD_SIZE;
export const EASEL_SIZE = 7;
export const ALL_EASEL_BONUS = 50;
export const BOARD_ROWS = 15;
export const BOARD_COLUMNS = 15;
export const MAX_NUMBER_OF_POSSIBILITY = 3;
export const DELAY_TO_PLAY = 5000;
export const NUMBER_OF_SKIP = 6;

export const CENTRAL_CASE_POSITION_X = 7;
export const CENTRAL_CASE_POSITION_Y = 7;

export const PLAYERS_NUMBER = 2;
export const INDEX_INVALID = -1;
export const INDEX_REAL_PLAYER = 0;
export const INDEX_PLAYER_AI = 1;

export const FONT_SIZE_MAX = 20;
export const FONT_SIZE_MIN = 10;
export const DEFAULT_FONT_SIZE = 13;
export const SIZE_VARIATION = 1;

export const TRIPLE_WORD = 3;
export const DOUBLE_WORD = 2;
export const TRIPLE_LETTER = 3;
export const DOUBLE_LETTER = 2;
export const MIN_RESERVE_SIZE_TOSWAP = 7;

export const THREE_SECONDS_DELAY = 3000;

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

export enum AIStrategy {
    Skip,
    Swap,
    Place,
}

export const strategyBallotBox: AIStrategy[] = [
    AIStrategy.Place,
    AIStrategy.Place,
    AIStrategy.Place,
    AIStrategy.Skip,
    AIStrategy.Place,
    AIStrategy.Swap,
    AIStrategy.Place,
    AIStrategy.Place,
    AIStrategy.Place,
    AIStrategy.Place,
];

export enum PlacingStrategy {
    LessSix,
    SevenToTwelve,
    ThirteenToEighteen,
}

export const placingBallotBox: PlacingStrategy[] = [
    PlacingStrategy.LessSix,
    PlacingStrategy.SevenToTwelve,
    PlacingStrategy.SevenToTwelve,
    PlacingStrategy.LessSix,
    PlacingStrategy.ThirteenToEighteen,
    PlacingStrategy.LessSix,
    PlacingStrategy.ThirteenToEighteen,
    PlacingStrategy.ThirteenToEighteen,
    PlacingStrategy.SevenToTwelve,
    PlacingStrategy.LessSix,
];

export const AI_NAME_DATABASE: string[] = ['Mister_Bucky', 'Mister_Samy', 'Miss_Betty'];

export const MAX_SOLUTION = 3;

export const RESERVE: Letter[] = [
    {
        value: 'A',
        quantity: 9,
        points: 1,
    },
    {
        value: 'B',
        quantity: 2,
        points: 3,
    },
    {
        value: 'C',
        quantity: 2,
        points: 3,
    },
    {
        value: 'D',
        quantity: 3,
        points: 2,
    },
    {
        value: 'E',
        quantity: 15,
        points: 1,
    },
    {
        value: 'F',
        quantity: 2,
        points: 4,
    },
    {
        value: 'G',
        quantity: 2,
        points: 2,
    },
    {
        value: 'H',
        quantity: 2,
        points: 4,
    },
    {
        value: 'I',
        quantity: 8,
        points: 1,
    },
    {
        value: 'J',
        quantity: 1,
        points: 8,
    },
    {
        value: 'K',
        quantity: 1,
        points: 10,
    },
    {
        value: 'L',
        quantity: 5,
        points: 1,
    },
    {
        value: 'M',
        quantity: 3,
        points: 2,
    },
    {
        value: 'N',
        quantity: 6,
        points: 1,
    },
    {
        value: 'O',
        quantity: 6,
        points: 1,
    },
    {
        value: 'P',
        quantity: 2,
        points: 3,
    },
    {
        value: 'Q',
        quantity: 1,
        points: 8,
    },
    {
        value: 'R',
        quantity: 6,
        points: 1,
    },
    {
        value: 'S',
        quantity: 6,
        points: 1,
    },
    {
        value: 'T',
        quantity: 6,
        points: 1,
    },
    {
        value: 'U',
        quantity: 6,
        points: 1,
    },
    {
        value: 'V',
        quantity: 2,
        points: 4,
    },
    {
        value: 'W',
        quantity: 1,
        points: 10,
    },
    {
        value: 'X',
        quantity: 1,
        points: 10,
    },
    {
        value: 'Y',
        quantity: 1,
        points: 10,
    },
    {
        value: 'Z',
        quantity: 1,
        points: 10,
    },
    {
        value: '*',
        quantity: 2,
        points: 0,
    },
];

export const DICTIONARY: string[] = JSON.parse(JSON.stringify(DICTIONARYData)).words;
