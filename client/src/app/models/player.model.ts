import { Letter } from '@app/classes/letter';
export class Player {
    constructor(
        public id: number,
        public name: string,
        public score: number,
        public letterTable: Letter[], // public isTour: boolean, // public isIA: boolean
    ) {}
}
