import * as fs from 'fs';
import { Service } from 'typedi';

@Service()
export class WordValidationService {
    // eslint-disable-next-line no-invalid-this
    dictionaryData = fs.readFileSync('@../../../client/src/assets/dictionary.json');
    private dictionary: string[];
    constructor() {
        this.dictionary = JSON.parse(this.dictionaryData.toString()).words;
    }

    isValidInDictionary(words: string[]): boolean {
        let countValidWords = 0;
        // the server console returns that words is not of type Iteratable<string>
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < words.length; i++) {
            for (const item of this.dictionary) {
                if (words[i].toLowerCase() === item) {
                    countValidWords++;
                }
            }
        }

        return countValidWords === words.length;
    }
}
