/* eslint-disable max-lines */
/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { BOARD_COLUMNS, BOARD_ROWS, FONT_SIZE_MAX, FONT_SIZE_MIN, INDEX_INVALID, RESERVE } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { PlayerAI } from '@app/models/player-ai.model';
import { Player } from '@app/models/player.model';
import { PlayerService } from './player.service';

describe('PlayerService', () => {
    let letterA: Letter;
    let letterB: Letter;
    let letterC: Letter;
    let letterD: Letter;

    let player: Player;
    let service: PlayerService;
    let playerAI: PlayerAI;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PlayerService);

        letterA = RESERVE[0];
        letterB = RESERVE[1];
        letterC = RESERVE[2];
        letterD = RESERVE[3];

        player = new Player(1, 'Player 1', [letterA]);
        playerAI = new PlayerAI(2, 'Player AI', [letterB]);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should do nothing when clearPlayers() is called and players list is empty', () => {
        const emptyPlayers = service['players'];
        service.clearPlayers();
        expect(service['players']).toEqual(emptyPlayers);
    });

    it('should clear players when clearPlayers() is called', () => {
        service['players'].push(player);
        service['players'].push(playerAI);
        service.clearPlayers();
        expect(service['players']).toHaveSize(0);
    });

    it('should add players when addPlayer() is called', () => {
        expect(service.playerSubject.observers.toString()).toHaveSize(0);
        service.addPlayer(player);
        expect(service['players']).toHaveSize(1);
        service.addPlayer(playerAI);
        expect(service['players']).toHaveSize(2);
    });

    it('should emit when adding players', () => {
        let emitted = false;
        service.playerSubject.subscribe(() => {
            emitted = true;
        });
        service.emitPlayers();
        expect(emitted).toBeTrue();
    });

    it('should subscribe when adding players', () => {
        let players: Player[] = [];
        service.playerSubject.subscribe((p) => {
            players = p;
        });

        service.addPlayer(player);

        expect(players).toHaveSize(1);
        expect(players[0]).toEqual(player);
    });

    it('should update scrabble board value when updateScrabbleBoard() is called', () => {
        const testBoard = [
            ['', '', '', ''],
            ['A', 'B', 'C', 'D'],
            ['', '', '', ''],
            ['A', 'B', 'C', 'D'],
        ];
        service.updateScrabbleBoard(testBoard);
        expect(service.scrabbleBoard).toEqual(testBoard);
    });

    it('should change font size when updateFontSize() is called', () => {
        service.scrabbleBoard = []; // Initializes the array with empty letters
        for (let i = 0; i < BOARD_ROWS; i++) {
            service.scrabbleBoard[i] = [];
            for (let j = 0; j < BOARD_COLUMNS; j++) {
                service.scrabbleBoard[i][j] = '';
            }
        }
        const newFontSize = 18;
        service.updateFontSize(newFontSize);
        expect(service.fontSize).toEqual(newFontSize);
    });

    it('should give font size a valid value', () => {
        service.scrabbleBoard = []; // Initializes the array with empty letters
        for (let i = 0; i < BOARD_ROWS; i++) {
            service.scrabbleBoard[i] = [];
            for (let j = 0; j < BOARD_COLUMNS; j++) {
                service.scrabbleBoard[i][j] = '';
            }
        }
        const tooSmallValue = -2;
        service.updateFontSize(tooSmallValue);
        expect(service.fontSize).toEqual(FONT_SIZE_MIN);

        const tooBigValue = 300;
        service.updateFontSize(tooBigValue);
        expect(service.fontSize).toEqual(FONT_SIZE_MAX);
    });

    it("should return right player's easel when getLettersEasel() is called", () => {
        const playerEasel = [letterA, letterA, letterB, letterB, letterC, letterC, letterD];
        player.letterTable = playerEasel;
        service['players'].push(player);

        const playerAIEasel = [letterA, letterB, letterC, letterD, letterA, letterB, letterC];
        playerAI.letterTable = playerAIEasel;
        service['players'].push(playerAI);

        expect(service.getLettersEasel(0)).toEqual(playerEasel);
        expect(service.getLettersEasel(1)).toEqual(playerAIEasel);
    });

    it('should return players when getPlayers() is called', () => {
        service['players'].push(player);
        service['players'].push(playerAI);
        expect(service.getPlayers()).toEqual([player, playerAI]);
    });

    it('should call the right times functions that updates the grid font size when updateGridFontSize() is called', () => {
        service.scrabbleBoard = []; // Initializes the array with empty letters
        let numberLettersOnGrid = 0;
        for (let i = 0; i < BOARD_ROWS; i++) {
            service.scrabbleBoard[i] = [];
            for (let j = 0; j < BOARD_COLUMNS; j++) {
                // To generate a grid with some letters anywhere on it
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                if ((i + j) % 11 === 0) {
                    service.scrabbleBoard[i][j] = 'X';
                } else {
                    service.scrabbleBoard[i][j] = '';
                }
            }
            numberLettersOnGrid += service.scrabbleBoard[i].filter(Boolean).length;
        }
        // Return value is meaningless because it's only used to be called as a parameter
        // for the two following functions. And the results of these functions are meaningless regarding this test
        spyOn(service['gridService'], 'eraseLetter').and.returnValue();
        spyOn(service['gridService'], 'drawLetter').and.returnValue();

        service.updateGridFontSize();

        expect(service['gridService'].eraseLetter).toHaveBeenCalledTimes(numberLettersOnGrid);
        expect(service['gridService'].drawLetter).toHaveBeenCalledTimes(numberLettersOnGrid);
    });

    it('should remove a letter when removeLetter() is called', () => {
        const playerEasel = [letterA, letterB, letterC, letterD];
        player.letterTable = playerEasel;
        service['players'].push(player);
        let number = 1;
        service['myFunc'] = () => {
            number = number *= 2;
            return;
        };

        service.removeLetter(0, 0);
        playerEasel.slice(0, 1);
        expect(service['players'][0].letterTable).toEqual(playerEasel);

        service.removeLetter(3, 0);
        playerEasel.pop();
        expect(service['players'][0].letterTable).toEqual(playerEasel);
    });

    it('should remove only one letter if two letters have the same value than the letter to delete', () => {
        const playerEasel = [letterA, letterA, letterB, letterB, letterC, letterC, letterD];
        player.letterTable = playerEasel;
        service['players'].push(player);
        let number = 1;
        service['myFunc'] = () => {
            number = number *= 2;
            return;
        };

        service.removeLetter(2, 0);
        playerEasel.slice(2, 1);

        expect(service['players'][0].letterTable).toEqual(playerEasel);
    });

    it('should remove the letter for the right player', () => {
        const playerEasel = [letterA, letterB];
        player.letterTable = playerEasel;
        service['players'].push(player);
        const playerAIEasel = [letterC, letterD];
        playerAI.letterTable = playerAIEasel;
        service['players'].push(playerAI);

        let number = 1;
        service['myFunc'] = () => {
            number = number *= 2;
            return;
        };
        service.removeLetter(1, 0);
        playerEasel.splice(1, 1);
        expect(service['players'][0].letterTable).toEqual(playerEasel);

        service.removeLetter(0, 1);
        playerAIEasel.splice(0, 1);
        expect(service['players'][1].letterTable).toEqual(playerAIEasel);
    });

    it('should change function when updateLettersEasel() is called', () => {
        let number = 1;
        const fn = () => {
            number = number *= 2;
            return;
        };
        service.updateLettersEasel(fn);
        expect(service['myFunc']).toBe(fn);
    });

    it("should refill player's empty easel when refillEasel() is called", () => {
        let number = 1;
        service['myFunc'] = () => {
            number = number *= 2;
            return;
        };
        player.letterTable = [];
        const emptyLetter: Letter = { value: '', quantity: 0, points: 0, isSelectedForSwap: false, isSelectedForManipulation: false };
        service['players'].push(player);
        const expectedEasel = [letterA, letterB, letterD, letterC, letterA, emptyLetter, letterD];
        spyOn(service['letterService'], 'getRandomLetter').and.returnValues(letterA, letterB, letterD, letterC, letterA, emptyLetter, letterD);
        service.refillEasel(0);
        expectedEasel.pop();
        expectedEasel.pop();
        expect(service['players'][0].letterTable).toEqual(expectedEasel);
    });

    it("should refill player's easel that already has values when refillEasel() is called", () => {
        let number = 1;
        service['myFunc'] = () => {
            number = number *= 2;
            return;
        };
        const expectedEasel = [letterA, letterB, letterD, letterC, letterD, letterA, letterA];
        player.letterTable = expectedEasel;
        service['players'].push(player);
        spyOn(service['letterService'], 'getRandomLetter').and.returnValue(letterC);
        expectedEasel.push(letterC);
        service.refillEasel(0);
        expect(service['players'][0].letterTable).toEqual(expectedEasel);
    });

    it('should add letters when addLetterToEasel() is called', () => {
        service['players'].push(player);
        const expectedEasel = [letterA, letterB, letterD];
        service.addLetterToEasel('B', 0);
        service.addLetterToEasel('D', 0);
        expect(service['players'][0].letterTable).toEqual(expectedEasel);
    });

    it('should know if easel contains letter', () => {
        player.letterTable = [letterA, letterB];
        service['players'].push(player);
        playerAI.letterTable = [];
        service['players'].push(playerAI);

        expect(service.indexLetterInEasel('a', 0, 0)).not.toEqual(INDEX_INVALID);
        expect(service.indexLetterInEasel('b', 0, 0)).not.toEqual(INDEX_INVALID);
        expect(service.indexLetterInEasel('c', 0, 0)).toEqual(INDEX_INVALID);
        expect(service.indexLetterInEasel('a', 0, 1)).toEqual(INDEX_INVALID);
    });

    it("should know letter's index in easel", () => {
        player.letterTable = [letterA, letterB];
        service['players'].push(player);
        playerAI.letterTable = [letterC];
        service['players'].push(playerAI);

        expect(service.indexLetterInEasel('a', 0, 0)).toEqual(0);
        expect(service.indexLetterInEasel('b', 1, 0)).toEqual(1);
        expect(service.indexLetterInEasel('b', 0, 0)).toEqual(1);
        expect(service.indexLetterInEasel('c', 0, 1)).toEqual(0);
        expect(service.indexLetterInEasel('d', 0, 0)).toEqual(INDEX_INVALID);
    });

    it('should add score when addScore() is called', () => {
        const INITIAL_SCORE = 40;
        player.score = INITIAL_SCORE;
        service['players'].push(player);
        const ADDED_SCORE = 10;
        service.addScore(ADDED_SCORE, 0);
        expect(service['players'][0].score).toEqual(INITIAL_SCORE + ADDED_SCORE);
    });

    it("should return player's score", () => {
        const playerScore = 40;
        player.score = playerScore;
        service['players'].push(player);
        const playerAIScore = 60;
        playerAI.score = playerAIScore;
        service['players'].push(playerAI);
        expect(service.getScore(0)).toEqual(playerScore);
        expect(service.getScore(1)).toEqual(playerAIScore);
    });

    it('should replace a letter from player easel when swap() is called', () => {
        spyOn(service['letterService'], 'getRandomLetter').and.returnValue(letterC);
        let number = 1;
        service['myFunc'] = () => {
            number = number *= 2;
            return;
        };
        const easel = [letterA, letterB, letterD, letterC, letterD, letterA, letterA];
        player.letterTable = easel;
        service['players'].push(player);
        const easelAI = [letterC, letterD];
        playerAI.letterTable = easelAI;
        service['players'].push(playerAI);
        service.swap(2, 0);
        easel[2] = letterC;
        expect(service['players'][0].letterTable).toEqual(easel);
    });
});
