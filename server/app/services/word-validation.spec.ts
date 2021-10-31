/* eslint-disable dot-notation */
import { expect } from 'chai';
import { WordValidationService } from './word-validation.service';

describe('WordValidation service', () => {
    let wordValidationService: WordValidationService;
    beforeEach(() => {
        wordValidationService = new WordValidationService();
    });

    it('should return false when finding an invalid word ( a word which is not in the dictionary', () => {
        const words: string[] = ['aaaa', 'bbbdeh', 'manger', 'dormir'];
        const result = wordValidationService.isValidInDictionary(words);
        expect(result).to.equals(false);
    });

    it('should return true when finding an valid word ( a word which is in the dictionary', () => {
        const words: string[] = ['manger', 'toi', 'eau', 'dormir'];
        const result = wordValidationService.isValidInDictionary(words);
        expect(result).to.equals(true);
    });
});
