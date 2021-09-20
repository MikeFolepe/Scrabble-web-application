import { Injectable } from '@angular/core';

export interface CharRange {
    minCharacter: number;
    maxCharacter: number;
}

@Injectable({
    providedIn: 'root',
})
export class PlayerNameFieldService {
    charRange: CharRange = {
        minCharacter: 4,
        maxCharacter: 12,
    };
    pattern: string = '[a-zA-Z]*';

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor() {
        // do nothing
    }

    getCharRange() {
        return this.charRange;
    }

    getPattern() {
        return this.pattern;
    }
}
