/* eslint-disable max-lines */
import { Letter } from '@app/classes/letter';
// eslint-disable-next-line no-restricted-imports
import dictionaryData from '../../assets/dictionnary.json';

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
export const ONE_POSSIBILITY = 1;
export const TWO_POSSIBILITY = 2;
export const DELAY_TO_PLAY = 5000;

export const CENTRAL_CASE_POSX = 7;
export const CENTRAL_CASE_POSY = 7;

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

export enum IAStrategy {
    Skip,
    Swap,
    Place,
}

export const strategyBallotBox: IAStrategy[] = [
    IAStrategy.Place,
    IAStrategy.Place,
    IAStrategy.Place,
    IAStrategy.Skip,
    IAStrategy.Place,
    IAStrategy.Swap,
    IAStrategy.Place,
    IAStrategy.Place,
    IAStrategy.Place,
    IAStrategy.Place,
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

export const IA_NAME_DATABASE: string[] = ['Mister_Bucky', 'Mister_Samy', 'Miss_Betty'];

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

// positions are used for keys
// bonuses string are use for value
export const BONUSES_POSITIONS: Map<string, string> = new Map<string, string>([
    ['A1', 'tripleword'],
    ['A4', 'doubleletter'],
    ['A8', 'tripleword'],
    ['A12', 'doubleletter'],
    ['A15', 'tripleword'],
    ['B2', 'doubleword'],
    ['B6', 'tripleletter'],
    ['B10', 'tripleletter'],
    ['B14', 'doubleword'],
    ['C3', 'doubleword'],
    ['C7', 'doubleletter'],
    ['C9', 'doubleletter'],
    ['C13', 'doubleword'],
    ['D1', 'doubleletter'],
    ['D4', 'doubleword'],
    ['D8', 'doubleletter'],
    ['D12', 'doubleword'],
    ['D15', 'doubleletter'],
    ['E5', 'doubleword'],
    ['E11', 'doubleword'],
    ['F2', 'tripleletter'],
    ['F6', 'tripleletter'],
    ['F10', 'tripleletter'],
    ['F14', 'tripleletter'],
    ['G3', 'doubleletter'],
    ['G7', 'doubleletter'],
    ['G9', 'doubleletter'],
    ['G13', 'doubleletter'],
    ['H1', 'tripleword'],
    ['H4', 'doubleletter'],
    ['H12', 'doubleletter'],
    ['H15', 'tripleword'],
    ['I3', 'doubleletter'],
    ['I7', 'doubleletter'],
    ['I9', 'doubleletter'],
    ['I13', 'doubleletter'],
    ['J2', 'tripleletter'],
    ['J6', 'tripleletter'],
    ['J10', 'tripleletter'],
    ['J14', 'tripleletter'],
    ['K5', 'doubleword'],
    ['K11', 'doubleword'],
    ['M1', 'doubleletter'],
    ['M4', 'doubleword'],
    ['M8', 'doubleletter'],
    ['M12', 'doubleword'],
    ['M15', 'doubleletter'],
    ['N3', 'doubleword'],
    ['N7', 'doubleletter'],
    ['N9', 'doubleletter'],
    ['N13', 'doubleword'],
    ['O1', 'tripleword'],
    ['O4', 'doubleletter'],
    ['O8', 'tripleword'],
    ['O12', 'doubleletter'],
    ['O15', 'tripleword'],
]);
export const dictionary: string[] = JSON.parse(JSON.stringify(dictionaryData)).words;
