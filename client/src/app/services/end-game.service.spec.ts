/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { RESERVE } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { Orientation } from '@app/classes/scrabble-board-pattern';
import { PlayerAI } from '@app/models/player-ai.model';
import { Player } from '@app/models/player.model';
import { EndGameService } from './end-game.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EndGameService', () => {
    let service: EndGameService;

    let letterA: Letter;
    let letterB: Letter;

    let player: Player;
    let playerAI: PlayerAI;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
        });
        service = TestBed.inject(EndGameService);

        letterA = RESERVE[0];
        letterB = RESERVE[1];

        player = new Player(1, 'Player 1', [letterA]);
        playerAI = new PlayerAI(2, 'Player IA', [letterB]);
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
        playerAI.score = 8;

        service.playerService.players.push(player);
        service.playerService.players.push(playerAI);

        expect(service.getWinnerName()).toEqual(player.name);

        service.playerService.players[0].score = 8;
        service.playerService.players[1].score = 10;

        expect(service.getWinnerName()).toEqual(playerAI.name);

        service.playerService.players[0].score = 10;
        service.playerService.players[1].score = 10;

        expect(service.getWinnerName()).toEqual(player.name + '  ' + playerAI.name);
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
        const notEmptyEaselStub = [letterA, letterA];
        service.letterService.reserveSize = 0;
        player.letterTable = [];
        playerAI.letterTable = notEmptyEaselStub;
        service.playerService.players.push(player);
        service.playerService.players.push(playerAI);

        expect(service['isEndGameByEasel']()).toBeTrue();

        service.letterService.reserveSize = 0;
        service.playerService.players[0].letterTable = notEmptyEaselStub;
        service.playerService.players[1].letterTable = notEmptyEaselStub;
        expect(service['isEndGameByEasel']()).toBeFalse();

        service.letterService.reserveSize = 5;
        service.playerService.players[0].letterTable = notEmptyEaselStub;
        service.playerService.players[1].letterTable = [];
        expect(service['isEndGameByEasel']()).toBeFalse();
    });

    it("should subtract the points of the remaining easel's letter from the score", () => {
        service.isEndGame = true;
        const initialScore = 40;
        player.score = initialScore;
        playerAI.score = initialScore;
        player.letterTable = [letterA, letterA, letterA, letterB];
        playerAI.letterTable = [letterA, letterA, letterA, letterB];

        service.playerService.players.push(player);
        service.playerService.players.push(playerAI);
        const expectedScore = initialScore - 3 * letterA.points - letterB.points;

        service.getFinalScore(0);
        expect(service.playerService.players[0].score).toEqual(expectedScore);

        service.getFinalScore(1);
        expect(service.playerService.players[1].score).toEqual(expectedScore);
    });

    it('should set final score to 0 if score should be negative', () => {
        service.isEndGame = true;
        player.score = 5;
        player.letterTable = [letterA, letterA, letterA, letterB];
        service.playerService.players.push(player);

        service.getFinalScore(0);

        expect(service.playerService.players[0].score).toEqual(0);
    });

    it('should clear all data when clearAllData() is called', () => {
        service.playerService.players.push(player);
        service.playerService.players.push(playerAI);
        service.letterService.reserve = [letterA, letterB, letterA, letterB];
        service.isEndGame = true;
        service.actionsLog = ['passer', 'test'];
        service.debugService.debugServiceMessage = [{ word: 'test', orientation: Orientation.HorizontalOrientation, line: 0, startIdx: 0, point: 1 }];

        service.clearAllData();

        expect(service.playerService.players).toHaveSize(0);
        expect(service.letterService.reserve).toEqual(RESERVE);
        expect(service.isEndGame).toBeFalse();
        expect(service.actionsLog).toHaveSize(0);
        expect(service.debugService.debugServiceMessage).toHaveSize(0);
    });

    // it('should know if it is end game due to easel', () => {
    //     spyOn(service.letterService, 'isReserveEmpty').and.returnValues(true, false, true, false);
    //     spyOn(service.playerService, 'isEaselEmpty').and.returnValues(true, true, true, false, false, false, false, false);

    //     expect(service['isEndGameByEasel']()).toBeTrue();
    //     expect(service['isEndGameByEasel']()).toBeFalse();
    //     expect(service['isEndGameByEasel']()).toBeTrue();
    //     expect(service['isEndGameByEasel']()).toBeFalse();
    // });
});