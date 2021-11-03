/* eslint-disable dot-notation */
import { EndGameService } from './end-game.service';
import { GameSettingsService } from './game-settings.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ONE_SECOND_DELAY } from '@app/classes/constants';
import { RouterTestingModule } from '@angular/router/testing';
import { SkipTurnService }  from './skip-turn.service';
import { TestBed } from '@angular/core/testing';

describe('SkipTurnService', () => {
    let service: SkipTurnService;
    let gameSettingsService: jasmine.SpyObj<GameSettingsService>;
    let endGameService: jasmine.SpyObj<EndGameService>;
    beforeEach(() => {
        const settingsSpy = jasmine.createSpyObj('GameSettingsService', ['gameSettings']);
        const endGameSpy = jasmine.createSpyObj('EndGameService', ['isEndGame']);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [SkipTurnService, { provide: GameSettingsService, useValue: settingsSpy }, { provide: EndGameService, useValue: endGameSpy }],
        });
        service = TestBed.inject(SkipTurnService);
        gameSettingsService = TestBed.inject(GameSettingsService) as jasmine.SpyObj<GameSettingsService>;
        endGameService = TestBed.inject(EndGameService) as jasmine.SpyObj<EndGameService>;
    });

    beforeEach(() => {
        jasmine.clock().install();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should stopTimer when switching turn', () => {
        endGameService.isEndGame = false;
        const spy = spyOn(service, 'stopTimer');
        service.switchTurn();
        expect(spy).toHaveBeenCalled();
    });


    it('should startTimer when switching turns 2', () => {
        service.isTurn = true;
        const newTurn = false;
        endGameService.isEndGame = false;
        const spyStart = spyOn(service, 'startTimer');
        const spyOnAi = spyOn(service, 'bindAiTurn');
        service.switchTurn();
        jasmine.clock().tick(ONE_SECOND_DELAY + 1);
        expect(service.isTurn).toEqual(newTurn);
        expect(spyOnAi).toHaveBeenCalled();
        expect(spyStart).toHaveBeenCalled();
    });

    it('should decrease the countdown', () => {
        gameSettingsService.gameSettings.timeMinute = '00';
        gameSettingsService.gameSettings.timeSecond = '59';
        endGameService.isEndGame = false;
        service.startTimer();
        jasmine.clock().tick(ONE_SECOND_DELAY + 1);
        expect(service['minutes']).toEqual(0);
        expect(service['seconds']).toEqual(58);
    });

    it('should clearInterval when stopping timer', () => {
        service.stopTimer();
        expect(service['minutes']).toEqual(0);
        expect(service['seconds']).toEqual(0);
    });

    it('adapt time output to correct value when when only seconds input is 0', () => {
        gameSettingsService.gameSettings.timeMinute = '05';
        gameSettingsService.gameSettings.timeSecond = '00';
        endGameService.isEndGame = false;
        service.startTimer();
        jasmine.clock().tick(ONE_SECOND_DELAY + 1);
        expect(service['seconds']).toEqual(59);
        expect(service['minutes']).toEqual(4);
    });

    it('should do nothing when it is an endgame', () => {
        endGameService.isEndGame = true;
        service.isTurn = false;
        const newturn = false;
        service.switchTurn();
        expect(service.isTurn).toEqual(newturn);
    });

    it('should stop the timer if it is an end of game of start timer ', () => {
        endGameService.isEndGame = true;
        const spyOnStop = spyOn(service, 'stopTimer');
        service.startTimer();
        expect(spyOnStop).toHaveBeenCalled();
    });

    it('should bind to the playerAi play function', () => {
        const testFn = () => {
            let x = 0;
            return x++;
        };
        service.bindAiTurn(testFn);
        expect(service['playAiTurn']).toEqual(testFn);
    });

    it('should stop the timer and then switch turn when the countdown is done ', () => {
        gameSettingsService.gameSettings.timeMinute = '00';
        gameSettingsService.gameSettings.timeSecond = '00';
        endGameService.isEndGame = false;
        const spyOnStop = spyOn(service, 'stopTimer');
        const spyOnSwitch = spyOn(service, 'switchTurn');
        service.startTimer();
        jasmine.clock().tick(ONE_SECOND_DELAY + 1);
        expect(spyOnStop).toHaveBeenCalled();
        jasmine.clock().tick(ONE_SECOND_DELAY);
        expect(spyOnSwitch).toHaveBeenCalled();
    });
});
