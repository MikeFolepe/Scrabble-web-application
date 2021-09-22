/* eslint-disable no-useless-escape */
/* eslint-disable prettier/prettier */
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
        maxCharacter: 8,
    };

    pattern: string = '^([A-Za-z][A-Za-z][A-Za-z][A-Za-z])[A-Za-z0-9!@#$%^&*_]*';

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
