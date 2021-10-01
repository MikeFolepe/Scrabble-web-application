/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';

import { Letter } from '@app/classes/letter';
import { PlayerService } from './player.service';
import { Player } from '@app/models/player.model';
import { PlayerIA } from '@app/models/player-ia.model';
import { FONT_SIZE_MIN, FONT_SIZE_MAX, BOARD_ROWS, BOARD_COLUMNS } from '@app/classes/constants';

describe('PlayerService', () => {
    let service: PlayerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PlayerService);
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
        service['players'].push(new Player(1, 'Player 1', []));
        service['players'].push(new Player(2, 'Player 2', []));
        service.clearPlayers();
        expect(service['players']).toHaveSize(0);
    });

    it('should add players when addPlayer() is called', () => {
        const letterEmpty: Letter = {
            value: '',
            quantity: 0,
            points: 0,
        };
        expect(service.playerSubject.observers.toString()).toHaveSize(0);
        const testPlayer = new Player(1, 'Player 1', [letterEmpty]);
        service.addPlayer(testPlayer);
        expect(service['players']).toHaveSize(1);

        const playerIA = new PlayerIA(2, 'Player 2', [letterEmpty]);
        service.addPlayer(playerIA);
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
        const player = new Player(1, 'Player 1', []);
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
        expect(service.fontSize).toEqual(newFontSize * 2);
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
        expect(service.fontSize).toEqual(FONT_SIZE_MIN * 2);

        const tooBigValue = 300;
        service.updateFontSize(tooBigValue);
        expect(service.fontSize).toEqual(FONT_SIZE_MAX * 2);
    });

    it("should return right player's easel when getLettersEasel() is called", () => {
        const letterA: Letter = {
            value: 'A',
            quantity: 0,
            points: 0,
        };
        const letterB: Letter = {
            value: 'B',
            quantity: 0,
            points: 0,
        };
        const letterC: Letter = {
            value: 'C',
            quantity: 0,
            points: 0,
        };
        const letterD: Letter = {
            value: 'D',
            quantity: 0,
            points: 0,
        };

        const playerEasel = [letterA, letterA, letterB, letterB, letterC, letterC, letterD];
        const player = new Player(1, 'Player 1', playerEasel);
        service['players'].push(player);

        const playerIaEasel = [letterA, letterB, letterC, letterD, letterA, letterB, letterC];
        const playerIA = new PlayerIA(2, 'Player IA', playerIaEasel);
        service['players'].push(playerIA);

        expect(service.getLettersEasel(0)).toEqual(playerEasel);
        expect(service.getLettersEasel(1)).toEqual(playerIaEasel);
    });

    it('should return players when getPlayers() is called', () => {
        const player = new Player(1, 'Player 1', []);
        service['players'].push(player);

        const playerIA = new PlayerIA(2, 'Player IA', []);
        service['players'].push(playerIA);

        expect(service.getPlayers()).toEqual([player, playerIA]);
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

        spyOn(service, 'posTabToPosGrid');
        spyOn(service['gridService'], 'eraseLetter').and.returnValue();
        spyOn(service['gridService'], 'drawLetter').and.returnValue();

        service.updateGridFontSize();

        expect(service.posTabToPosGrid).toHaveBeenCalledTimes(numberLettersOnGrid);
        expect(service['gridService'].eraseLetter).toHaveBeenCalledTimes(numberLettersOnGrid);
        expect(service['gridService'].drawLetter).toHaveBeenCalledTimes(numberLettersOnGrid);
    });
});
