/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { RESERVE } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { PlayerIA } from '@app/models/player-ia.model';
import { Player } from '@app/models/player.model';
import { EndGameService } from './end-game.service';

fdescribe('EndGameService', () => {
    let service: EndGameService;

    let letterA: Letter;
    let letterB: Letter;

    let player: Player;
    let playerIA: PlayerIA;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EndGameService);

        letterA = RESERVE[0];
        letterB = RESERVE[1];

        player = new Player(1, 'Player 1', [letterA]);
        playerIA = new PlayerIA(2, 'Player IA', [letterB]);
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
        // getReserveSize getLettersEasel[0] getLettersEasel[1]> expected
        //        0            EMPTY           EMPTY      =>   true
        //        0            EASEL           EMPTY      =>   true
        //        3            EMPTY           EMPTY      =>   false
        //        3            EASEL           EASEL      =>   false
        spyOn(service.letterService, 'getReserveSize').and.returnValues(0, 0, 3, 3);
        const testEasel = [letterA, letterA];
        const testEmptyEasel: Letter[] = [];
        spyOn<any>(service.playerService, 'getLettersEasel').and.returnValues(
            testEmptyEasel,
            testEmptyEasel,
            testEasel,
            testEmptyEasel,
            testEmptyEasel,
            testEmptyEasel,
            testEasel,
            testEasel,
        );

        expect(service['isEndGameByEasel']()).toBeTrue();
        expect(service['isEndGameByEasel']()).toBeTrue();
        expect(service['isEndGameByEasel']()).toBeFalse();
        expect(service['isEndGameByEasel']()).toBeFalse();
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
