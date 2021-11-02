import * as fs from 'fs';
import { Service } from 'typedi';

@Service()
export class WordValidationService {
    dictionaryData = fs.readFileSync('@../../../client/src/assets/dictionary.json');
    private dictionary: string[];
    constructor() {
        this.dictionary = JSON.parse(this.dictionaryData.toString()).words;
    }

    isValidInDictionary(words: string[]): boolean {
        let countValidWords = 0;
        for (const word of words) {
            for (const item of this.dictionary) {
                if (word.toLowerCase() === item) {
                    countValidWords++;
                }
            }
        }
        return countValidWords === words.length;
    }
}
