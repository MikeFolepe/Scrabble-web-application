/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { Player } from '@app/models/player.model';
import { ChatboxService } from './chatbox.service';
import { Orientation, PossibleWords } from '@app/classes/scrabble-board-pattern';
import { RESERVE } from '@app/classes/constants';

describe('ChatboxService', () => {
    let service: ChatboxService;
    let possibleWord: PossibleWords;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ChatboxService);

        let number = 1;
        service['displayMessage'] = () => {
            number = number *= 2;
            return;
        };

        const firstPlayerEasel = [RESERVE[0], RESERVE[0], RESERVE[1], RESERVE[1], RESERVE[2], RESERVE[2], RESERVE[0]];
        const firstPlayer = new Player(1, 'Player 1', firstPlayerEasel);
        service['playerService'].addPlayer(firstPlayer);
        possibleWord = { word: 'test', orientation: Orientation.HorizontalOrientation, line: 0, startIdx: 0, point: 1 };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should have type error if command is not valid', () => {
        spyOn(service, 'isValid').and.returnValue(false);

        service.message = '';
        service.sendPlayerMessage(service.message);
        expect(service.typeMessage).toEqual('error');
    });

    it('should have type player if command is valid', () => {
        spyOn(service, 'isValid').and.returnValue(true);

        service.message = '';
        service.sendPlayerMessage(service.message);
        expect(service.typeMessage).toEqual('player');
        expect(service.command).toEqual('');
    });

    it('should know if input is valid', () => {
        service.message = '!debug';
        expect(service.isValid()).toBeTrue();

        service.message = '!passer';
        expect(service.isValid()).toBeTrue();

        service.message = '!échanger *s';
        expect(service.isValid()).toBeTrue();

        service.message = '!échanger';
        expect(service.isValid()).toBeFalse();
        expect(service.message).toEqual('ERREUR : La syntaxe est invalide');

        service.message = '!placer h8h test';
        expect(service.isValid()).toBeTrue();

        service.message = '!placer 333';
        expect(service.isValid()).toBeFalse();

        service.message = '!placer';
        expect(service.isValid()).toBeFalse();

        service.message = '!notok';
        expect(service.isValid()).toBeFalse();

        service.message = 'random text';
        expect(service.isValid()).toBeTrue();
    });

    it('using command !debug should call executeDebug()', () => {
        const spy = spyOn(service, 'executeDebug');
        service.command = 'debug';
        const table: PossibleWords[] = [];
        table.push(possibleWord);

        service['debugService'].receiveAIDebugPossibilities(table);
        service.sendPlayerMessage('!debug');
        expect(spy).toHaveBeenCalled();
        service.sendPlayerMessage('!debug');
        expect(spy).toHaveBeenCalled();
    });

    it('using command !passer should display the respective message', () => {
        service.command = 'passer';
        service.skipTurn.isTurn = true;
        service.sendPlayerMessage('!passer');
        expect(service.message).toEqual('!passer');
    });

    it('using a valid command !placer should display the respective message', () => {
        spyOn(service['placeLetterService'], 'place').and.returnValue(true);
        service.command = 'placer';
        service.skipTurn.isTurn = true;
        service.sendPlayerMessage('!placer h8h hello');
        expect(service.message).toEqual('!placer h8h hello');
    });

    it('using a valid command !échanger should display the respective message', () => {
        spyOn(service['swapLetterService'], 'swap').and.returnValue(true);
        service.command = 'echanger';
        service.skipTurn.isTurn = true;
        service.sendPlayerMessage('!échanger abc');
        expect(service.message).toEqual('Player 1 : !échanger abc');
    });

    it('deactivating debug should display the respective message', () => {
        spyOn<any>(service, 'displayMessage');

        service.command = 'debug';
        const table: PossibleWords[] = [possibleWord];

        service['debugService'].debugServiceMessage = table;
        service['debugService'].isDebugActive = true;

        service.sendPlayerMessage('!debug');

        expect(service.message).toEqual('affichages de débogage désactivés');
    });

    it('activating debug should display the respective message', () => {
        spyOn<any>(service, 'displayMessage');
        spyOn<any>(service, 'displayDebugMessage');

        service.command = 'debug';
        const table: PossibleWords[] = [possibleWord];

        service['debugService'].debugServiceMessage = table;
        service['debugService'].isDebugActive = false;

        service.sendPlayerMessage('!debug');

        expect(service.message).toEqual('affichages de débogage activés');
    });

    it('using command !passer while it is not your turn should display an error', () => {
        service.command = 'passer';
        service.sendPlayerMessage('!passer');
        expect(service.message).toEqual("ERREUR : Ce n'est pas ton tour");
    });

    it('using command !échanger while it is not your turn should display an error', () => {
        service.command = 'echanger';
        service.sendPlayerMessage('!échanger');
        expect(service.message).toEqual("ERREUR : Ce n'est pas ton tour");
    });

    it('using command !placer while it is not your turn should display an error', () => {
        service.command = 'placer';
        service.sendPlayerMessage('!placer');
        expect(service.message).toEqual("ERREUR : Ce n'est pas ton tour");
    });

    it('using an invalid command !échanger should display an error', () => {
        spyOn(service['swapLetterService'], 'swap').and.returnValue(false);
        service.skipTurn.isTurn = true;
        service.command = 'echanger';
        service.sendPlayerMessage('!échanger xyz');
        expect(service.message).toEqual('ERREUR : La commande est impossible à réaliser');
    });

    it('using an invalid command !placer should display an error', () => {
        spyOn(service['placeLetterService'], 'place').and.returnValue(false);
        spyOn(service, 'executePlace').and.callThrough();
        service.skipTurn.isTurn = true;
        service.command = 'placer';
        service.sendPlayerMessage('!placer h10v top');
        expect(service.executePlace).toHaveBeenCalledTimes(1);
        expect(service.message).toEqual('ERREUR : Le placement est invalide');
    });

    it('displaying a message should display the respective message and its type', () => {
        service.displayMessageByType('I am the player', 'player');
        expect(service.message).toEqual('I am the player');
        expect(service.typeMessage).toEqual('player');
    });

    it('should display the right debug message if no possibility has been found', () => {
        service['debugService'].debugServiceMessage = [];
        service.displayDebugMessage();

        expect(service.typeMessage).toEqual('system');
        expect(service.message).toEqual('Aucune possibilité de placement trouvée!');
    });

    it('should display the right debug message if at least one possibility has been found', () => {
        service['debugService'].debugServiceMessage = [possibleWord];
        service.displayDebugMessage();

        expect(service.typeMessage).toEqual('system');
        expect(service.message).toEqual('test: -- 1');
    });

    it('should display final message with correct variables values', () => {
        const spy = spyOn(service, 'displayMessageByType');
        service.endGameService.isEndGame = true;
        service.displayFinalMessage(0);
        expect(spy).toHaveBeenCalledWith('Fin de partie - lettres restantes', 'system');
        expect(spy).toHaveBeenCalledWith('Player 1:AABBCCA', 'system');
    });

    it('should not display final message if it is not the end of the game', () => {
        const spy = spyOn(service, 'displayMessageByType');
        service.endGameService.isEndGame = false;
        service.displayFinalMessage(0);
        expect(spy).not.toHaveBeenCalled();
    });
});
