import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DifficultyService {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor() {
        // do nothing
    }

    getLevel() {
        return ['Easy', 'Hard'];
    }
}
