import { AIStrategy, PlacingStrategy } from '@app/classes/enum';
import { Letter } from '@app/classes/letter';
// eslint-disable-next-line no-restricted-imports
import dictionaryData from '@common/dictionary.json';

export const DEFAULT_WIDTH = 750;
export const DEFAULT_HEIGHT = 750;
export const BOARD_SIZE = 16;
export const BOARD_ROWS = 15;
export const BOARD_COLUMNS = 15;
export const CENTRAL_CASE_POSITION = 7;
export const CASE_SIZE = DEFAULT_WIDTH / BOARD_SIZE;

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
      ['L1', 'doubleletter'],
      ['L4', 'doubleword'],
      ['L8', 'doubleletter'],
      ['L12', 'doubleword'],
      ['M3', 'doubleword'],
      ['M7', 'doubleletter'],
      ['M9', 'doubleletter'],
      ['M13', 'doubleword'],
      ['N2', 'doubleword'],
      ['N6', 'tripleletter'],
      ['N10', 'tripleletter'],
      ['N14', 'doubleword'],
      ['O1', 'tripleword'],
      ['O4', 'doubleletter'],
      ['O8', 'tripleword'],
      ['O12', 'doubleletter'],
      ['O15', 'tripleword'],
]);
