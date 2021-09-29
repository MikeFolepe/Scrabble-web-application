import { Letter } from '@app/classes/letter';
import { PairLetterValues } from './pair-letter-values';

export const DEFAULT_WIDTH = 750;
export const DEFAULT_HEIGHT = 750;
export const BOARD_SIZE = 16;
export const EASEL_SIZE = 7;

export const BOARD_ROWS = 15;
export const BOARD_COLUMNS = 15;

export const CENTRAL_CASE_POSX = 7;
export const CENTRAL_CASE_POSY = 7;

export const PLAYERS_NUMBER = 2;
export const FONT_SIZE_MAX = 20;
export const FONT_SIZE_MIN = 10;
export const DEFAULT_FONT_SIZE = 13;
export const SIZE_VARIATION = 1;

export const TRIPLE_WORD = 3;
export const DOUBLE_WORD = 2;
export const TRIPLE_LETTER = 3;
export const DOUBLE_LETTER = 2;

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

export const LETTER_VALUES: PairLetterValues[] = [
    {
        letter: 'A',
        value: 1,
    },
    {
        letter: 'B',
        value: 3,
    },
    {
        letter: 'C',
        value: 3,
    },
    {
        letter: 'D',
        value: 2,
    },
    {
        letter: 'E',
        value: 1,
    },
    {
        letter: 'F',
        value: 4,
    },
    {
        letter: 'G',
        value: 2,
    },
    {
        letter: 'H',
        value: 4,
    },
    {
        letter: 'I',
        value: 1,
    },
    {
        letter: 'J',
        value: 8,
    },
    {
        letter: 'K',
        value: 10,
    },
    {
        letter: 'L',
        value: 1,
    },
    {
        letter: 'M',
        value: 2,
    },
    {
        letter: 'N',
        value: 1,
    },
    {
        letter: 'O',
        value: 1,
    },
    {
        letter: 'P',
        value: 3,
    },
    {
        letter: 'Q',
        value: 8,
    },
    {
        letter: 'R',
        value: 1,
    },
    {
        letter: 'S',
        value: 1,
    },
    {
        letter: 'T',
        value: 1,
    },
    {
        letter: 'U',
        value: 1,
    },
    {
        letter: 'V',
        value: 4,
    },
    {
        letter: 'W',
        value: 10,
    },
    {
        letter: 'X',
        value: 10,
    },
    {
        letter: 'Y',
        value: 10,
    },
    {
        letter: 'Z',
        value: 10,
    },
    {
        letter: '*',
        value: 0,
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
