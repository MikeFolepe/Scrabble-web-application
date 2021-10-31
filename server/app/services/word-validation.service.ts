/* eslint-disable prettier/prettier  */ // I get an non sense error on every line and the auto fix doesn't work
// eslint-disable-next-line no-restricted-imports
import * as fs from 'fs';
import { Service } from 'typedi';

@Service()
export class WordValidationService {
<<<<<<< HEAD

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
=======
    // eslint-disable-next-line no-invalid-this
    dictionaryData = fs.readFileSync('@../../../client/src/assets/dictionary.json');
    private dictionary: string[];
    constructor(){
        // eslint-disable-next-line no-invalid-this

        this.dictionary = JSON.parse(this.dictionaryData.toString()).words;
        // console.log(this.dictionary);
    }

    isValidInDictionary( words: string[] ): boolean {
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        let countValidWords = 0;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < words.length; i++) {
            for (const item of this.dictionary) {
                if (words[i].toLowerCase() === item) {
                    countValidWords++;
                }
            }
        }

        if(countValidWords === words.length){
            return true;
        }
        return false;

        // return this.dictionary.find((word)=)
>>>>>>> b7bc76bb223ef4674011ed696c8d797922f78013
    }
}
