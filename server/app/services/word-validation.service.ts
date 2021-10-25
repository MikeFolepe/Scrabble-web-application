/* eslint-disable prettier/prettier  */ // I get an non sense error on every line and the auto fix doesn't work
// eslint-disable-next-line no-restricted-imports
import * as fs from 'fs';
import { Service } from 'typedi';

@Service()
export class WordValidationService {

    private dictionaryData = fs.readFileSync('../../../assets/dictionary.json');
    // eslint-disable-next-line no-invalid-this
    private dictionary: string[] = JSON.parse(JSON.stringify(this.dictionaryData)).words;

    isValidInDictionary(word: string): boolean {
        if (word.length >= 2) {
            for (const item of this.dictionary) {
                if (word === item) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }
}
