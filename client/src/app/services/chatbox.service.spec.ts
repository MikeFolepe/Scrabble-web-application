/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { INDEX_PLAYER_ONE, RESERVE } from '@app/classes/constants';
import { TypeMessage } from '@app/classes/enum';
import { Orientation, PossibleWords } from '@app/classes/scrabble-board-pattern';
import { Player } from '@app/models/player.model';
import { ChatboxService } from './chatbox.service';

describe('ChatboxService', () => {
    let service: ChatboxService;
    let possibleWord: PossibleWords;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
        });
        service = TestBed.inject(ChatboxService);

        const letterA = RESERVE[0];
        const letterB = RESERVE[1];
        const letterC = RESERVE[2];

        const firstPlayerEasel = [letterA, letterA, letterB, letterB, letterC, letterC, letterA];
        const firstPlayer = new Player(1, 'Player 1', firstPlayerEasel);
        service['playerService'].addPlayer(firstPlayer);
        possibleWord = { word: 'test', orientation: Orientation.HorizontalOrientation, line: 0, startIdx: 0, point: 1 };

        spyOn(service['sendMessageService'], 'displayMessageByType');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should have type error if command is not valid', () => {
        service.message = '!debugg';
        service.sendPlayerMessage(service.message);
        expect(service.message).toEqual('ERREUR : La syntaxe est invalide');
    });

    it('should have type player if command is valid', () => {
        spyOn(service, 'isValid').and.returnValue(true);

        service.message = '';
        service.sendPlayerMessage(service.message);
        expect(service.typeMessage).toEqual(TypeMessage.Player);
    });

    it('should have type player if command is valid', () => {
        spyOn(service, 'isValid').and.returnValue(true);

        service.sendPlayerMessage(service.message);
        expect(service.typeMessage).toEqual(TypeMessage.Player);
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

    it('using command !debug without debug messages should display the respective message', () => {
        service.command = 'debug';
        service['debugService'].isDebugActive = false;
        service['debugService'].clearDebugMessage();

        service.sendPlayerMessage('!debug');
        expect(service['sendMessageService'].displayMessageByType).toHaveBeenCalledWith(
            'Aucune possibilité de placement trouvée!',
            TypeMessage.System,
        );
    });

    it('using command !passer should display the respective message', () => {
        spyOn(service['skipTurn'], 'switchTurn');
        service['skipTurn'].isTurn = true;
        service.command = 'passer';
        service.sendPlayerMessage('!passer');
        expect(service.message).toEqual('!passer');
    });

    it('using a valid command !placer should display the respective message', async () => {
        spyOn(service['skipTurn'], 'switchTurn');
        service['skipTurn'].isTurn = true;
        spyOn(service['placeLetterService'], 'placeCommand').and.returnValue(Promise.resolve(true));
        service.command = 'placer';
        service.message = '!placer h8h hello';
        service.typeMessage = TypeMessage.Player;
        await service.executePlace();
        expect(service['sendMessageService'].displayMessageByType).toHaveBeenCalledWith('!placer h8h hello', TypeMessage.Player);
    });

    it('using a valid command !échanger should display the respective message', () => {
        spyOn(service['skipTurn'], 'switchTurn');
        service['skipTurn'].isTurn = true;
        spyOn(service['swapLetterService'], 'swapCommand').and.returnValue(true);
        service.command = 'echanger';
        service.sendPlayerMessage('!échanger abc');
        expect(service.message).toEqual('Player 1 : !échanger abc');
    });

    it('deactivating debug should display the respective message', () => {
        spyOn<any>(service, 'displayDebugMessage');

        service.command = 'debug';
        const table: { word: string; orientation: Orientation; line: number; startIdx: number; point: number }[] = [
            { word: 'message de debug', orientation: Orientation.HorizontalOrientation, line: 0, startIdx: 0, point: 1 },
        ];

        service['debugService'].debugServiceMessage = table;
        service['debugService'].isDebugActive = true;

        service.sendPlayerMessage('!debug');
        expect(service['sendMessageService'].displayMessageByType).toHaveBeenCalledWith('affichages de débogage désactivés', TypeMessage.System);
    });

    it('using command !passer while it is not your turn should display an error', () => {
        service['skipTurn'].isTurn = false;
        service.command = 'passer';
        service.sendPlayerMessage('!passer');
        expect(service['sendMessageService'].displayMessageByType).toHaveBeenCalledWith("ERREUR : Ce n'est pas ton tour", TypeMessage.Error);
    });

    it('using command !échanger while it is not your turn should display an error', () => {
        service['skipTurn'].isTurn = false;
        service.command = 'echanger';
        service.sendPlayerMessage('!échanger');
        expect(service['sendMessageService'].displayMessageByType).toHaveBeenCalledWith("ERREUR : Ce n'est pas ton tour", TypeMessage.Error);
    });

    it('using command !placer while it is not your turn should display an error', async () => {
        service['skipTurn'].isTurn = false;
        service.command = 'placer';
        await service.executePlace();
        expect(service['sendMessageService'].displayMessageByType).toHaveBeenCalledWith("ERREUR : Ce n'est pas ton tour", TypeMessage.Error);
    });

    it('should display the right debug message if no possibility has been found', () => {
        service['debugService'].debugServiceMessage = [];
        service.displayDebugMessage();
        expect(service['sendMessageService'].displayMessageByType).toHaveBeenCalledWith(
            'Aucune possibilité de placement trouvée!',
            TypeMessage.System,
        );
    });

    it('should display the right debug message if at least one possibility has been found', () => {
        service['debugService'].debugServiceMessage = [
            { word: 'test', orientation: Orientation.HorizontalOrientation, line: 0, startIdx: 0, point: 3 },
        ];
        service.displayDebugMessage();
        expect(service.message).toEqual('test: -- 3');
    });

    it('calling displayFinalMessage should send the respective message to the chatbox', () => {
        service['endGameService'].isEndGame = true;
        service.displayFinalMessage(INDEX_PLAYER_ONE);
        expect(service['sendMessageService'].displayMessageByType).toHaveBeenCalledWith('Player 1 : AABBCCA', TypeMessage.System);
    });

    it('should not write a message if swapCommand is false in executeSwap()', () => {
        service['skipTurn'].isTurn = true;
        const spy = spyOn(service['skipTurn'], 'switchTurn');
        spyOn(service['swapLetterService'], 'swapCommand').and.returnValue(false);
        service.message = '!échanger *s';
        service.executeSwap();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should return immediately if it is not the end of the game when displayFinalMessage() is called', () => {
        service.endGameService.isEndGame = false;
        service.displayFinalMessage(0);
        expect(service['sendMessageService'].displayMessageByType).not.toHaveBeenCalled();
    });

    it('should not display message if place is false when executePlace() is called', async () => {
        service['skipTurn'].isTurn = true;
        const spy = spyOn(service['skipTurn'], 'switchTurn');
        spyOn(service['placeLetterService'], 'placeCommand').and.returnValue(Promise.resolve(false));
        service.message = '!placer h8h test';
        await service.executePlace();
        expect(spy).not.toHaveBeenCalled();
    });
});