import * as dictionaryData from '@../../../assets/dictionary.json';

export const DICTIONARY: string[] = JSON.parse(JSON.stringify(dictionaryData)).words;

