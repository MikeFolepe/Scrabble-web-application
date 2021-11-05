/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ONE_SECOND_DELAY, THREE_SECONDS_DELAY } from '@app/classes/constants';
import { Socket } from 'socket.io-client';
import { EndGameService } from './end-game.service';
import { GameSettingsService } from './game-settings.service';
import { SkipTurnService } from './skip-turn.service';

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

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should get the newTurn from the server', () => {
        service['clientSocket'].socket = {
            on: (eventName: string, callback: (turn: boolean) => void) => {
                if (eventName === 'turnSwitched') {
                    callback(true);
                }
            },
        } as unknown as Socket;

        service.receiveNewTurn();
        expect(service.isTurn).toEqual(true);
    });

    it('should get the newTurn from the server', () => {
        service['clientSocket'].socket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === 'startTimer') {
                    callback();
                }
            },
        } as unknown as Socket;
        spyOn(service, 'stopTimer');
        spyOn(service, 'startTimer');
        service.receiveStartFromServer();
        expect(service.stopTimer).toHaveBeenCalled();
        expect(service.startTimer).toHaveBeenCalled();
    });

    it('should stopTimer when switching turn', () => {
        endGameService.isEndGame = false;
        const spy = spyOn(service, 'stopTimer');
        service.switchTurn();
        expect(spy).toHaveBeenCalled();
    });

    it('should startTimer when switching turns', () => {
        gameSettingsService.isSoloMode = true;
        service.isTurn = false;
        const newTurn = true;
        endGameService.isEndGame = false;
        const spyStart = spyOn(service, 'startTimer');
        service.switchTurn();
        jasmine.clock().tick(THREE_SECONDS_DELAY + 1);
        jasmine.clock().tick(ONE_SECOND_DELAY);
        expect(service.isTurn).toEqual(newTurn);
        expect(spyStart).toHaveBeenCalled();
    });

    it('should startTimer when switching turns 2', () => {
        gameSettingsService.isSoloMode = true;
        service.isTurn = true;
        const newTurn = false;
        endGameService.isEndGame = false;
        const spyStart = spyOn(service, 'startTimer');
        service.switchTurn();
        jasmine.clock().tick(THREE_SECONDS_DELAY + 1);
        jasmine.clock().tick(ONE_SECOND_DELAY);
        expect(service.isTurn).toEqual(newTurn);
        expect(spyStart).toHaveBeenCalled();
    });

    it('should startTimer when switching when in multiplayer mode', () => {
        gameSettingsService.isSoloMode = false;
        service.isTurn = true;
        const newTurn = false;
        endGameService.isEndGame = false;
        service.switchTurn();
        jasmine.clock().tick(THREE_SECONDS_DELAY + 1);
        jasmine.clock().tick(ONE_SECOND_DELAY);
        expect(service.isTurn).toEqual(newTurn);
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

    it('should stop the timer and then switch turn when the countdown is done ', () => {
        service.gameSettingsService.gameSettings.timeMinute = '00';
        service.gameSettingsService.gameSettings.timeSecond = '00';
        endGameService.isEndGame = false;
        service.isTurn = true;
        const spyOnStop = spyOn(service, 'stopTimer');
        const spyOnSwitch = spyOn(service, 'switchTurn').and.callThrough();
        service.startTimer();
        jasmine.clock().tick(ONE_SECOND_DELAY + 1);
        expect(spyOnStop).toHaveBeenCalled();
        jasmine.clock().tick(ONE_SECOND_DELAY);
        expect(spyOnSwitch).toHaveBeenCalled();
    });
});
