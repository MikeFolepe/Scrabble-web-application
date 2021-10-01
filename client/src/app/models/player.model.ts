import { Letter } from '@app/classes/letter';
export class Player {
    score: number;
    constructor(
        public id: number,
        public name: string,
        public letterTable: Letter[], // public tour: boolean, // public isIA: boolean
    ) {
        this.score = 0;
    }
}
