import { AIStrategy } from '@app/classes/enum';
import { Letter } from '@app/classes/letter';
import dictionaryData from '@common/dictionary.json';

export const WHITE_LETTER_POSITION = 26;

export const DELAY_TO_PASS_TURN = 5000;
export const DELAY_BEFORE_PLAY = 3000;
export const NO_PLAYABLE_WORD = -1;
export const INVALID = -1;
export const MAX_DIMENSIONS = 2;

export const DEFAULT_WIDTH = 750;
export const DEFAULT_HEIGHT = 750;
export const BOARD_SIZE = 16;
export const BOARD_ROWS = 15;
export const BOARD_COLUMNS = 15;
export const CENTRAL_CASE_POSITION = { x: 7, y: 7 };
export const GRID_CASE_SIZE = DEFAULT_WIDTH / BOARD_SIZE;

export const EASEL_SIZE = 7;
export const ALL_EASEL_BONUS = 50;

export const MAX_NUMBER_OF_POSSIBILITY = 3;
export const ONE_POSSIBILITY = 1;
export const TWO_POSSIBILITY = 2;
export const NUMBER_OF_SKIP = 6;

export const ONE_SECOND_DELAY = 1000;
export const DELAY_TO_PLAY = 20000;
export const ERROR_MESSAGE_DELAY = 4000;
export const THREE_SECONDS_DELAY = 3000;

export const CENTRAL_CASE_POSITION_X = 7;
export const CENTRAL_CASE_POSITION_Y = 7;

export const PLAYERS_NUMBER = 2;
export const INDEX_INVALID = -1;
export const INDEX_PLAYER_ONE = 0;
export const INDEX_PLAYER_TWO = 1;
export const INDEX_PLAYER_AI = 1;

export const LAST_INDEX = -1;

export const FONT_SIZE_MAX = 20;
export const FONT_SIZE_MIN = 10;
export const DEFAULT_FONT_SIZE = 13;
export const SIZE_VARIATION = 1;

export const TRIPLE_WORD = 3;
export const DOUBLE_WORD = 2;
export const TRIPLE_LETTER = 3;
export const DOUBLE_LETTER = 2;
export const MIN_RESERVE_SIZE_TO_SWAP = 7;

export const MAX_SOLUTION = 3;

export const AI_NAME_DATABASE: string[] = ['Mister_Bucky', 'Mister_Samy', 'Miss_Betty'];

export const DICTIONARY: string[] = JSON.parse(JSON.stringify(dictionaryData)).words;

export enum PlacingStrategy {
    LessSix,
    SevenToTwelve,
    ThirteenToEighteen,
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

export const RESERVE: Letter[] = [
    {
        value: 'A',
        quantity: 9,
        points: 1,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'B',
        quantity: 2,
        points: 3,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'C',
        quantity: 2,
        points: 3,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'D',
        quantity: 3,
        points: 2,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'E',
        quantity: 15,
        points: 1,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'F',
        quantity: 2,
        points: 4,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'G',
        quantity: 2,
        points: 2,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'H',
        quantity: 2,
        points: 4,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'I',
        quantity: 8,
        points: 1,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'J',
        quantity: 1,
        points: 8,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'K',
        quantity: 1,
        points: 10,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'L',
        quantity: 5,
        points: 1,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'M',
        quantity: 3,
        points: 2,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'N',
        quantity: 6,
        points: 1,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'O',
        quantity: 6,
        points: 1,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'P',
        quantity: 2,
        points: 3,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'Q',
        quantity: 1,
        points: 8,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'R',
        quantity: 6,
        points: 1,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'S',
        quantity: 6,
        points: 1,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'T',
        quantity: 6,
        points: 1,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'U',
        quantity: 6,
        points: 1,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'V',
        quantity: 2,
        points: 4,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'W',
        quantity: 1,
        points: 10,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'X',
        quantity: 1,
        points: 10,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'Y',
        quantity: 1,
        points: 10,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: 'Z',
        quantity: 1,
        points: 10,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
    {
        value: '*',
        quantity: 2,
        points: 0,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    },
];

// positions are used for keys
// bonuses string are use for value
export const BONUS_POSITIONS: Map<string, string> = new Map<string, string>([
    ['A1', 'tripleWord'],
    ['A4', 'doubleLetter'],
    ['A8', 'tripleWord'],
    ['A12', 'doubleLetter'],
    ['A15', 'tripleWord'],
    ['B2', 'doubleWord'],
    ['B6', 'tripleLetter'],
    ['B10', 'tripleLetter'],
    ['B14', 'doubleWord'],
    ['C3', 'doubleWord'],
    ['C7', 'doubleLetter'],
    ['C9', 'doubleLetter'],
    ['C13', 'doubleWord'],
    ['D1', 'doubleLetter'],
    ['D4', 'doubleWord'],
    ['D8', 'doubleLetter'],
    ['D12', 'doubleWord'],
    ['D15', 'doubleLetter'],
    ['E5', 'doubleWord'],
    ['E11', 'doubleWord'],
    ['F2', 'tripleLetter'],
    ['F6', 'tripleLetter'],
    ['F10', 'tripleLetter'],
    ['F14', 'tripleLetter'],
    ['G3', 'doubleLetter'],
    ['G7', 'doubleLetter'],
    ['G9', 'doubleLetter'],
    ['G13', 'doubleLetter'],
    ['H1', 'tripleWord'],
    ['H4', 'doubleLetter'],
    ['H12', 'doubleLetter'],
    ['H15', 'tripleWord'],
    ['I3', 'doubleLetter'],
    ['I7', 'doubleLetter'],
    ['I9', 'doubleLetter'],
    ['I13', 'doubleLetter'],
    ['J2', 'tripleLetter'],
    ['J6', 'tripleLetter'],
    ['J10', 'tripleLetter'],
    ['J14', 'tripleLetter'],
    ['K5', 'doubleWord'],
    ['K11', 'doubleWord'],
    ['L1', 'doubleLetter'],
    ['L4', 'doubleWord'],
    ['L8', 'doubleLetter'],
    ['L12', 'doubleWord'],
    ['M3', 'doubleWord'],
    ['M7', 'doubleLetter'],
    ['M9', 'doubleLetter'],
    ['M13', 'doubleWord'],
    ['N2', 'doubleWord'],
    ['N6', 'tripleLetter'],
    ['N10', 'tripleLetter'],
    ['N14', 'doubleWord'],
    ['O1', 'tripleWord'],
    ['O4', 'doubleLetter'],
    ['O8', 'tripleWord'],
    ['O12', 'doubleLetter'],
    ['O15', 'tripleWord'],
]);
