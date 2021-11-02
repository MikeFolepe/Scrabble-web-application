/* eslint-disable sort-imports */
// import { CommunicationService } from '@app/services/communication.service';
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ALL_EASEL_BONUS, BOARD_COLUMNS, BOARD_ROWS } from '@app/classes/constants';
import { ScoreValidation } from '@app/classes/validation-score';
import { CommunicationService } from '@app/services/communication.service';
import { WordValidationService } from '@app/services/word-validation.service';
import { Observable } from 'rxjs';

fdescribe('WordValidationService', () => {
    let httpMock: HttpTestingController;
    let service: WordValidationService;
    const scrabbleBoard: string[][] = [];
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CommunicationService],
        });
        service = TestBed.inject(WordValidationService);
        service['newPlayedWords'].clear();
        httpMock = TestBed.inject(HttpTestingController);
        for (let i = 0; i < BOARD_ROWS; i++) {
            scrabbleBoard[i] = [];
            for (let j = 0; j < BOARD_COLUMNS; j++) {
                // To generate a grid with some letters anywhere on it
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                if ((i + j) % 11 === 0) {
                    scrabbleBoard[i][j] = 'X';
                } else {
                    scrabbleBoard[i][j] = '';
                }
            }
        }
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should have validationPost function', () => {
        expect(service['httpServer'].validationPost).toBeTruthy();
    });

    it('should pass through all rows and columns', () => {
        service['newWords'] = ['', 'mais', ''];
        service['newPlayedWords'].set('humour', ['B2', 'B3', 'B4', 'B5', 'B6', 'B7']);
        service['playedWords'].set('ma', ['C1', 'C2']);
        const isEaselSize = true;
        const isRow = true;
        const passThroughAllRowsOrColumnsSpy = spyOn(service, 'passThroughAllRowsOrColumns').and.callThrough();
        service.validateAllWordsOnBoard(scrabbleBoard, isEaselSize, isRow);
        const req = httpMock.expectOne(`${service['httpServer']['baseUrl']}/multiplayer/validateWords`);
        expect(req.request.method).toBe('POST');
        expect(passThroughAllRowsOrColumnsSpy).toHaveBeenCalledTimes(2);
    });
    // it('should return the correct state and score to the player when validation is true', async () => {
    //     const easelSize = false;
    //     const isRow = true;
    //     service['newPlayedWords'].set('mAison', ['H8', 'H9', 'H10', 'H11', 'H12', 'H13']);
    //     // const expectedResult: ScoreValidation = { validation: true, score: 7 };
    //     // spyOn(service['httpServer'], 'validationPost').and.returnValue( new Observable(true));
    //     // service.validateAllWordsOnBoard(scrabbleBoard, easelSize, isRow).then((validation) => {
    //     //     expect(validation.score).toEqual(expectedResult.score);
    //     //     expect(validation.validation).toEqual(expectedResult.validation);
    //     //     done();
    //     // });
    //     // const validation = await service.validateAllWordsOnBoard(scrabbleBoard, easelSize, isRow);
    //     const req = httpMock.expectOne(`${service['httpServer']['baseUrl']}/multiplayer/validateWords`);
    //     expect(req.request.method).toBe('POST');
    // });

    it('should double word score if word is placed on a double word case', () => {
        spyOn(service['bonusesPositions'], 'get').and.returnValue('doubleword');
        const initialScore = 10;
        const score = service.applyBonusesWord(initialScore, ['aaa']);
        expect(score).toEqual(initialScore * 2);
    });

    it('should triple letter score if word is placed on a triple letter case', () => {
        spyOn(service['bonusesPositions'], 'get').and.returnValue('tripleletter');
        const initialScore = 10;
        const score = service.calculateLettersScore(initialScore, 'a', ['H9']);
        expect(score).toEqual(initialScore + 3);
    });

    it('should add easel bonus when condition encountered and validateAllWordsOnBoard() is called', () => {
        const initialScore = 100;
        spyOn(service, 'calculateTotalScore').and.returnValue(initialScore);
        service.validateAllWordsOnBoard(scrabbleBoard, true, true).then((validation) => {
            expect(validation.score).toEqual(initialScore + ALL_EASEL_BONUS);
        });
        const req = httpMock.expectOne(`${service['httpServer']['baseUrl']}/multiplayer/validateWords`);
        expect(req.request.method).toBe('POST');
    });

    it('should call the right functions in case word is greater than two letters in passThroughAllRowsOrColumns()', () => {
        const spyOnHorizontalOrVertical = spyOn(service, 'getWordHorizontalOrVerticalPositions');
        const spyOnCheck = spyOn(service, 'checkIfPlayed');
        const spyOnAddToPlayedWords = spyOn(service, 'addToPlayedWords');
        service['newWords'] = ['', '', '', '', 't', 'e', 's', 't', '', '', '', '', '', '', ''];
        service['newPositions'] = ['H8', 'H9', 'H10', 'H11'];
        service.passThroughAllRowsOrColumns(scrabbleBoard, true);
        service['newWords'] = ['', '', '', '', 't', 'e', 's', 't', '', '', '', '', '', '', ''];
        service['newPositions'] = ['H8', 'H9', 'H10', 'H11'];
        service.passThroughAllRowsOrColumns(scrabbleBoard, false);
        expect(spyOnHorizontalOrVertical).toHaveBeenCalledTimes(2);
        expect(spyOnCheck).toHaveBeenCalledTimes(2);
        expect(spyOnAddToPlayedWords).toHaveBeenCalledTimes(2);
    });

    it('validate all words should be false once one word is not valid in dictionnary', () => {
        service['newPlayedWords'].set('nrteu', ['A1', 'A2', 'A3', 'A4', 'A5']);
        service['playedWords'].set('ma', ['B1', 'B2']);
        const isEaselSize = false;
        const isRow = true;
        const expectedResult: ScoreValidation = { validation: false, score: 0 };
        const spyToServer = spyOn(service['httpServer'], 'validationPost').and.callThrough();
        service.validateAllWordsOnBoard(scrabbleBoard, isEaselSize, isRow).then((result) => {
            expect(result).toEqual(expectedResult);
        });
        expect(spyToServer).toHaveBeenCalled();
        const req = httpMock.expectOne(`${service['httpServer']['baseUrl']}/multiplayer/validateWords`);
        expect(req.request.method).toBe('POST');
    });

    it('check if played should return false if there is no matching played word', () => {
        service['playedWords'].set('', []);
        const result = service.checkIfPlayed('ma', ['A1', 'A2']);
        expect(result).toEqual(false);
    });

    it('check if played should return true if there is already a played word at the given position', () => {
        service['playedWords'].set('ma', ['A1', 'A2']);
        const result = service.checkIfPlayed('ma', ['A1', 'A2']);
        expect(result).toEqual(true);
    });

    it('should not add the already played word when passing through lines and columns', () => {
        service['playedWords'] = new Map<string, string[]>([['test', ['H8', 'H9', 'H10', 'H11']]]);
        service['foundWords'] = ['test'];
        service['newPositions'] = ['H8', 'H9', 'H10', 'H11'];
        service.passThroughAllRowsOrColumns(scrabbleBoard, true);
        service.passThroughAllRowsOrColumns(scrabbleBoard, false);
        expect(service['newPlayedWords'].size).toEqual(0);
    });

    it('add to playedWords should add the new position to the words map if the concerned word is already played', () => {
        const word = 'ma';
        const positions = ['H8', 'H9'];
        const playedWordsStub: Map<string, string[]> = new Map();
        playedWordsStub.set('ma', ['A1', 'A2']);
        service.addToPlayedWords(word, positions, playedWordsStub);
        expect(playedWordsStub.get(word)).toEqual(['A1', 'A2', 'H8', 'H9']);
    });

    it('should correctly return the letters positions of the vertically given word', () => {
        service['newWords'] = ['', '', '', 'm', 'a', ''];
        const word = 'ma';
        const indexLine = 7;
        const indexColumn = 7;
        const isRow = false;
        const expectedPositions = ['D8', 'E8'];
        const returnedPositions = service.getWordHorizontalOrVerticalPositions(word, indexLine, indexColumn, isRow);
        expect(returnedPositions).toEqual(expectedPositions);
    });

    it('should find words of a given line or column', () => {
        const lineOrColumn: string[] = ['', '', 'm', 'a', '', 'b', 'e', 'b', 'e'];
        const result = service.findWords(lineOrColumn);
        const expectedResult = ['', 'ma', 'bebe'];
        expect(result).toEqual(expectedResult);
    });

    it('should find *(the emptyCharacter) when calculating score and apply bonuses', () => {
        const score = 0;
        const map: Map<string, string[]> = new Map<string, string[]>([['mAisonee', ['H8', 'H9', 'H10', 'H11', 'H12', 'H13', 'H14', 'H15']]]);
        const scoreResult = service.calculateTotalScore(score, map);
        const expectedScore = 27;
        expect(scoreResult).toEqual(expectedScore);
    });

    it('should remove the bonus when a turn is done', () => {
        const map: Map<string, string[]> = new Map<string, string[]>([['mAisonee', ['H8', 'H9', 'H10', 'H11', 'H12', 'H13', 'H14', 'H15']]]);
        const expectedSize = service['bonusesPositions'].size - 2;
        service.removeBonuses(map);
        expect(service['bonusesPositions'].size).toEqual(expectedSize);
        expect(service['bonusesPositions'].get('H12')).toBe(undefined);
        expect(service['bonusesPositions'].get('H15')).toBe(undefined);
    });
});
