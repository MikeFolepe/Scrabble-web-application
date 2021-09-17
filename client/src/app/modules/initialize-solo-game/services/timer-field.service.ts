import { Injectable } from '@angular/core';

export interface TimeRange {
    minTimerSecond: number;
    maxTimerSecond: number;
}
const secondPerMinute = 60;
const secondStep = 5;

@Injectable({
    providedIn: 'root',
})
export class TimerFieldService {
    timeRange: TimeRange = {
        minTimerSecond: 30, // 30 sec
        maxTimerSecond: 300, // 5 min
    };
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor() {
        // do nothing
    }

    getMinutes() {
        // eslint-disable-next-line prefer-const
        let selectionOfMinute: string[] = [];

        for (let index = 0; index <= this.timeRange.maxTimerSecond / secondPerMinute; index++) {
            selectionOfMinute.push(index.toLocaleString(undefined, { minimumIntegerDigits: 2 }).toString());
        }
        return selectionOfMinute;
    }

    // eslint-disable-next-line no-unused-vars
    getSeconds() {
        // eslint-disable-next-line prefer-const
        let selectionOfSecond: string[] = [];

        for (let index = 0; index < secondPerMinute; index += secondStep) {
            selectionOfSecond.push(index.toLocaleString(undefined, { minimumIntegerDigits: 2 }).toString());
        }
        return selectionOfSecond;
    }
}
