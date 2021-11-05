import * as dictionaryData from '@common/dictionary.json';
import { Service } from 'typedi';
@Service()
export class WordValidationService {
    private dictionary: string[];
    constructor() {
        this.dictionary = JSON.parse(JSON.stringify(dictionaryData)).words;
    }

    isValidInDictionary(words: string[]): boolean {
        let validWordsCount = 0;
        // the server console returns that words is not of type Iteratable<string>
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < words.length; i++) {
            for (const item of this.dictionary) {
                if (words[i].toLowerCase() === item) {
                    validWordsCount++;
                }
            }
        }
        return validWordsCount === words.length;
    }
}
