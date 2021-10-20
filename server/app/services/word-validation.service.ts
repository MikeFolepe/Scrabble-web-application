/* eslint-disable prettier/prettier  */ // I get an non sense error on every line and the auto fix doesn't work
// eslint-disable-next-line no-restricted-imports
import { DICTIONARY } from '../classes/constants';
import { Service } from 'typedi';

@Service()
export class WordValidationService {

    
    isValidInDictionary(word: string): boolean {
        if (word.length >= 2) {
            for (const item of DICTIONARY) {
                if (word === item) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }
}
