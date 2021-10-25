export interface BoardPattern {
    horizontal: PatternInfo[];
    vertical: PatternInfo[];
}

export interface PatternInfo {
    line: number;
    pattern: string;
}

export enum Orientation {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    horizontal,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    vertical,
}

export interface PossibleWords {
    word: string;
    orientation: Orientation;
    line: number;
    startIdx: number;
    point: number;
}
