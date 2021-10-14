/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { RESERVE } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { PlayerAI } from '@app/models/player-ai.model';
import { Player } from '@app/models/player.model';
import { EndGameService } from './end-game.service';

describe('EndGameService', () => {
    let service: EndGameService;

    let letterA: Letter;
    let letterB: Letter;

    let player: Player;
    let playerIA: PlayerAI;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EndGameService);

        letterA = RESERVE[0];
        letterB = RESERVE[1];

        player = new Player(1, 'Player 1', [letterA]);
        playerIA = new PlayerAI(2, 'Player IA', [letterB]);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should check if it is the end of the game when checkEndGame()', () => {
        spyOn<any>(service, 'isEndGameByActions').and.returnValues(false, false, true, true);
        spyOn<any>(service, 'isEndGameByEasel').and.returnValues(false, true, false, true);

        service.checkEndGame();
        expect(service.isEndGame).toBeFalse();

        service.checkEndGame();
        expect(service.isEndGame).toBeTrue();

        service.checkEndGame();
        expect(service.isEndGame).toBeTrue();

        service.checkEndGame();
        expect(service.isEndGame).toBeTrue();
    });

    it('should return the right winner name when getWinnerName() is called', () => {
        player.score = 10;
        playerIA.score = 8;

        service.playerService.players.push(player);
        service.playerService.players.push(playerIA);

        expect(service.getWinnerName()).toEqual(player.name);

        service.playerService.players[0].score = 8;
        service.playerService.players[1].score = 10;

        expect(service.getWinnerName()).toEqual(playerIA.name);

        service.playerService.players[0].score = 10;
        service.playerService.players[1].score = 10;

        expect(service.getWinnerName()).toEqual(player.name + '  ' + playerIA.name);
    });

    it("should know if the six last actions are 'passer'", () => {
        service.actionsLog = ['passer', 'passer', 'passer', 'passer', 'passer', 'passer'];
        expect(service['isEndGameByActions']()).toBeTrue();

        service.actionsLog = ['false', 'passer', 'passer', 'passer', 'passer', 'passer'];
        expect(service['isEndGameByActions']()).toBeFalse();

        service.actionsLog = ['true', 'true', 'true', 'passer', 'passer', 'passer', 'passer', 'passer', 'passer'];
        expect(service['isEndGameByActions']()).toBeTrue();

        service.actionsLog = ['passer', 'passer', 'passer', 'passer', 'passer'];
        expect(service['isEndGameByActions']()).toBeFalse();

        service.actionsLog = ['passer', 'passer', 'passer', 'passer', 'passer', 'false'];
        expect(service['isEndGameByActions']()).toBeFalse();
    });

    it('should know whether it is the end of the game or not', () => {
        spyOn(service.letterService, 'getReserveSize').and.returnValues(0, 0, 0, 3, 3);
        const testEasel = [letterA, letterA];
        const testEmptyEasel: Letter[] = [];
        spyOn<any>(service.playerService, 'getLettersEasel').and.returnValues(
            testEmptyEasel,
            testEmptyEasel,
            testEasel,
            testEmptyEasel,
            testEasel,
            testEasel,
            testEmptyEasel,
            testEmptyEasel,
            testEasel,
            testEasel,
        );

        expect(service['isEndGameByEasel']()).toBeTrue();
        expect(service['isEndGameByEasel']()).toBeTrue();
        expect(service['isEndGameByEasel']()).toBeTrue();
        expect(service['isEndGameByEasel']()).toBeFalse();
        expect(service['isEndGameByEasel']()).toBeFalse();
    });

    it("should substract the points of the remaining easel's letter from the score", () => {
        const testEasel = [letterA, letterA, letterA, letterB];
        spyOn<any>(service.playerService, 'getLettersEasel').and.returnValues(testEasel, testEasel);

        service.isEndGame = true;
        const initialScore = 40;
        player.score = initialScore;
        playerIA.score = initialScore;

        service.playerService.players.push(player);
        service.playerService.players.push(playerIA);
        const expectedScore = initialScore - 3 * letterA.points - letterB.points;

        service.getFinalScore(0);
        expect(service.playerService.players[0].score).toEqual(expectedScore);

        service.getFinalScore(1);
        expect(service.playerService.players[1].score).toEqual(expectedScore);
    });

    it('should set final score to 0 if score should be negative', () => {
        spyOn<any>(service.playerService, 'getLettersEasel').and.returnValues([letterA, letterA, letterA, letterB]);

        service.isEndGame = true;
        player.score = 5;
        service.playerService.players.push(player);

        service.getFinalScore(0);

        expect(service.playerService.players[0].score).toEqual(0);
    });

    it('should not change score if it is not the end of game', () => {
        spyOn<any>(service.playerService, 'getLettersEasel');

        // isEndGame = false by default
        player.score = 40;
        service.playerService.players.push(player);
        const expectedScore = service.playerService.players[0].score;

        service.getFinalScore(0);
        expect(service.playerService.players[0].score).toEqual(expectedScore);
        expect(service.playerService.getLettersEasel).not.toHaveBeenCalled();
    });

    it('should not change score if score is null', () => {
        spyOn<any>(service.playerService, 'getLettersEasel');
        service.isEndGame = true;
        player.score = 0;
        service.playerService.players.push(player);
        const expectedScore = service.playerService.players[0].score;

        service.getFinalScore(0);
        expect(service.playerService.players[0].score).toEqual(expectedScore);
        expect(service.playerService.getLettersEasel).not.toHaveBeenCalled();
    });

    it('should clear all data when clearAllData() is called', () => {
        service.playerService.players.push(player);
        service.playerService.players.push(playerIA);
        service.letterService.reserve = [letterA, letterB, letterA, letterB];
        service.isEndGame = true;
        service.actionsLog = ['passer', 'test'];
        service.debugService.debugServiceMessage = [{ word: 'test', nbPt: 10 }];

        service.clearAllData();

        expect(service.playerService.players).toHaveSize(0);
        expect(service.letterService.reserve).toEqual(RESERVE);
        expect(service.isEndGame).toBeFalse();
        expect(service.actionsLog).toHaveSize(0);
        expect(service.debugService.debugServiceMessage).toHaveSize(0);
    });
});
