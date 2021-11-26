/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RESERVE } from '@app/classes/constants';
import { PlayerAI } from '@app/models/player-ai.model';
import { Player } from '@app/models/player.model';
import { GameSettings } from '@common/game-settings';
import { Socket } from 'socket.io-client';
import { GiveUpHandlerService } from './give-up-handler.service';

describe('GiveUpHandlerService', () => {
    let service: GiveUpHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
        });
        service = TestBed.inject(GiveUpHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should on at the event receiveEndGame from Server and the Winner is the fake  winner', () => {
        service['gameSettingsService'].isSoloMode = false;
        service['gameSettingsService'].gameSettings = new GameSettings(
            ['Paul', 'Mike'],
            1,
            '00',
            '30',
            'facile',
            'Désactiver',
            "[['A1', 'doubleLetter'], ['A4', 'tripleLetter']]",
            [],
        );
        const fakeGiveUp = true;
        const fakeWinner = 'Jojo';
        service['clientSocket'].socket = {
            // eslint-disable-next-line no-unused-vars
            on: (eventName: string, callback: (isGiveUp: boolean, winnerName: string) => void) => {
                if (eventName === 'receiveEndGameByGiveUp') {
                    callback(fakeGiveUp, fakeWinner);
                }
            },
        } as unknown as Socket;

        const letterA = RESERVE[0];
        const letterB = RESERVE[1];
        const player1 = new Player(1, 'Player1', [letterA]);
        const player2 = new Player(2, 'Player2', [letterB]);
        service['playerService'].players.push(player1);
        service['playerService'].players.push(player2);
        // Function Call
        service.receiveEndGameByGiveUp();
        // Expectation
        expect(service.isGivenUp).toEqual(false);
        expect(service['gameSettingsService'].isSoloMode).toEqual(false);
        expect(service['playerService'].players[1].name).toEqual('Player2');
        expect(service['playerService'].players[1].name).toEqual('Player2');

        expect(service['gameSettingsService'].gameSettings.playersNames[1]).toEqual('Mike');
    });

    it('should on at the event receiveEndGame from Server and the Winner is the truth  winner and should call play method is the turn is false', () => {
        service['gameSettingsService'].isSoloMode = false;
        service.skipTurnService.isTurn = false;
        service['gameSettingsService'].gameSettings = new GameSettings(
            ['Paul', 'Mike'],
            1,
            '00',
            '30',
            'facile',
            'Désactiver',
            "[['A1', 'doubleLetter'], ['A4', 'tripleLetter']]",
            [],
        );
        const fakeGiveUp = true;
        const fakeWinner = 'Paul';
        service['clientSocket'].socket = {
            // eslint-disable-next-line no-unused-vars
            on: (eventName: string, callback: (isGiveUp: boolean, winnerName: string) => void) => {
                if (eventName === 'receiveEndGameByGiveUp') {
                    callback(fakeGiveUp, fakeWinner);
                }
            },
        } as unknown as Socket;

        const letterA = RESERVE[0];
        const letterB = RESERVE[1];
        const player1 = new Player(1, 'Player1', [letterA]);
        const player2 = new Player(2, 'Player2', [letterB]);
        service['playerService'].players.push(player1);
        service['playerService'].players.push(player2);
        // Function Call
        service.receiveEndGameByGiveUp();
        const spyPlay = spyOn<any>(service['playerService'].players[1], 'play');
        // Expectation
        expect(service.isGivenUp).toEqual(true);
        expect(service['gameSettingsService'].isSoloMode).toEqual(true);
        expect(service['playerService'].players[1].name).toEqual('Miss_Betty');
        expect(service['playerService'].players[1]).toBeInstanceOf(PlayerAI);
        expect(spyPlay).not.toHaveBeenCalled();
        expect(service['gameSettingsService'].gameSettings.playersNames[1]).toEqual('Miss_Betty');
    });

    it('should on at the event receiveEndGame from Server and the Winner is the truth  winner and do not call play method if the turn is true', () => {
        service['gameSettingsService'].isSoloMode = false;
        service.skipTurnService.isTurn = true;
        service['gameSettingsService'].gameSettings = new GameSettings(
            ['Paul', 'Mike'],
            1,
            '00',
            '30',
            'facile',
            'Désactiver',
            "[['A1', 'doubleLetter'], ['A4', 'tripleLetter']]",
            [],
        );
        const fakeGiveUp = true;
        const fakeWinner = 'Paul';
        service['clientSocket'].socket = {
            // eslint-disable-next-line no-unused-vars
            on: (eventName: string, callback: (isGiveUp: boolean, winnerName: string) => void) => {
                if (eventName === 'receiveEndGameByGiveUp') {
                    callback(fakeGiveUp, fakeWinner);
                }
            },
        } as unknown as Socket;

        const letterA = RESERVE[0];
        const letterB = RESERVE[1];
        const player1 = new Player(1, 'Player1', [letterA]);
        const player2 = new Player(2, 'Player2', [letterB]);
        service['playerService'].players.push(player1);
        service['playerService'].players.push(player2);
        // Function Call
        service.receiveEndGameByGiveUp();
        const spyPlay = spyOn<any>(service['playerService'].players[1], 'play');
        // Expectation
        expect(service.isGivenUp).toEqual(true);
        expect(service['gameSettingsService'].isSoloMode).toEqual(true);
        expect(service['playerService'].players[1].name).toEqual('Miss_Betty');
        expect(service['playerService'].players[1]).toBeInstanceOf(PlayerAI);
        expect(spyPlay).not.toHaveBeenCalled();
        expect(service['gameSettingsService'].gameSettings.playersNames[1]).toEqual('Miss_Betty');
    });
});
