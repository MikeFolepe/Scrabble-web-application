import { Service } from 'typedi';
@Service()
export class WordValidationService {
    // TODO: Find a way to initialize the dictionary
    isValidInDictionary(words: string[], dictionary: string[]): boolean {
        if (words.length === 0) return false;
        let validWordsCount = 0;
        // JUSTIFICATION : the server console returns that words is not of type Iteratable <string>
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < words.length; i++) {
            for (const item of dictionary) {
                if (words[i].toLowerCase() === item) {
                    validWordsCount++;
                }
            }
        }
        return validWordsCount === words.length;
    }
}
