/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { INDEX_REAL_PLAYER } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { Player } from '@app/models/player.model';
import { ChatboxService } from './chatbox.service';

describe('ChatboxService', () => {
    let service: ChatboxService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ChatboxService);

        const letterA: Letter = {
            value: 'A',
            quantity: 0,
            points: 0,
            isSelectedForSwap: false,
            isSelectedForManipulation: false,
        };
        const letterB: Letter = {
            value: 'B',
            quantity: 0,
            points: 0,
            isSelectedForSwap: false,
            isSelectedForManipulation: false,
        };
        const letterC: Letter = {
            value: 'C',
            quantity: 0,
            points: 0,
            isSelectedForSwap: false,
            isSelectedForManipulation: false,
        };
        const firstPlayerEasel = [letterA, letterA, letterB, letterB, letterC, letterC, letterA];
        const firstPlayer = new Player(1, 'Player 1', firstPlayerEasel);
        service['playerService'].addPlayer(firstPlayer);

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
        expect(service.typeMessage).toEqual('player');
    });

    it('should have type player if command is valid', () => {
        spyOn(service, 'isValid').and.returnValue(true);

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
        spyOn(service, 'executeDebug');
        service.command = 'debug';
        const word = 'message de debug';
        const nbPt = 1;
        const table: { word: string; nbPt: number }[] = [];
        table.push({ word, nbPt });

        service.sendPlayerMessage('!debug');
        expect(service.executeDebug).toHaveBeenCalled();
    });

    it('using command !debug without debug messages should display the respective message', () => {
        service.command = 'debug';
        service['debugService'].isDebugActive = false;
        service['debugService'].clearDebugMessage();

        service.sendPlayerMessage('!debug');
        expect(service['sendMessageService'].displayMessageByType).toHaveBeenCalledWith('Aucune possibilité de placement trouvée!', 'system');
    });

    it('using command !passer should display the respective message', () => {
        spyOn(service['passTourService'], 'writeMessage');
        spyOn(service['tourService'], 'getTour').and.returnValue(true);
        service.command = 'passer';
        service.sendPlayerMessage('!passer');
        expect(service.message).toEqual('!passer');
    });

    it('using a valid command !placer should display the respective message', () => {
        spyOn(service['passTourService'], 'writeMessage');
        spyOn(service['tourService'], 'getTour').and.returnValue(true);
        spyOn(service['placeLetterService'], 'placeCommand').and.returnValue(true);
        service.command = 'placer';
        service.sendPlayerMessage('!placer h8h hello');
        expect(service.message).toEqual('!placer h8h hello');
    });

    it('using a valid command !échanger should display the respective message', () => {
        spyOn(service['passTourService'], 'writeMessage');
        spyOn(service['tourService'], 'getTour').and.returnValue(true);
        spyOn(service['swapLetterService'], 'swapCommand').and.returnValue(true);
        service.command = 'echanger';
        service.sendPlayerMessage('!échanger abc');
        expect(service.message).toEqual('Player 1 : !échanger abc');
    });

    it('deactivating debug should display the respective message', () => {
        spyOn<any>(service, 'displayDebugMessage');

        service.command = 'debug';
        const word = 'message de debug';
        const nbPt = 1;
        const table: { word: string; nbPt: number }[] = [{ word, nbPt }];

        service['debugService'].debugServiceMessage = table;
        service['debugService'].isDebugActive = true;

        service.sendPlayerMessage('!debug');
        expect(service['sendMessageService'].displayMessageByType).toHaveBeenCalledWith('affichages de débogage désactivés', 'system');
    });

    it('using command !passer while it is not your turn should display an error', () => {
        spyOn(service['tourService'], 'getTour').and.returnValue(false);
        service.command = 'passer';
        service.sendPlayerMessage('!passer');
        expect(service['sendMessageService'].displayMessageByType).toHaveBeenCalledWith("ERREUR : Ce n'est pas ton tour", 'error');
    });

    it('using command !échanger while it is not your turn should display an error', () => {
        spyOn(service['tourService'], 'getTour').and.returnValue(false);
        service.command = 'echanger';
        service.sendPlayerMessage('!échanger');
        expect(service['sendMessageService'].displayMessageByType).toHaveBeenCalledWith("ERREUR : Ce n'est pas ton tour", 'error');
    });

    it('using command !placer while it is not your turn should display an error', () => {
        spyOn(service['tourService'], 'getTour').and.returnValue(false);
        service.command = 'placer';
        service.sendPlayerMessage('!placer');
        expect(service.message).toEqual("ERREUR : Ce n'est pas ton tour");
    });

    it('ngOnDestroy should call unsubscribe', () => {
        const spyUnsubscribe = spyOn(service.tourSubscription, 'unsubscribe').and.callThrough();
        service.ngOnDestroy();
        expect(spyUnsubscribe).toHaveBeenCalled();
    });

    it('should display the right debug message if no possibility has been found', () => {
        service['debugService'].debugServiceMessage = [];
        service.displayDebugMessage();
        expect(service['sendMessageService'].displayMessageByType).toHaveBeenCalledWith('Aucune possibilité de placement trouvée!', 'system');
    });

    it('should display the right debug message if at least one possibility has been found', () => {
        service['debugService'].debugServiceMessage = [{ word: 'test', nbPt: 3 }];
        service.displayDebugMessage();
        expect(service.message).toEqual('test: -- 3');
    });

    it('calling displayFinalMessage should send the respective message to the chatbox', () => {
        service['endGameService'].isEndGame = true;
        service.displayFinalMessage(INDEX_REAL_PLAYER);
        expect(service['sendMessageService'].displayMessageByType).toHaveBeenCalledWith('Player 1 : AABBCCA', 'system');
    });

    it('should not write a message if swapCommand is false in executeSwap()', () => {
        spyOn(service['tourService'], 'getTour').and.returnValue(true);
        const spy = spyOn(service['passTourService'], 'writeMessage');
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

    it('should not display message if place is false when executePlace() is called', () => {
        spyOn(service['tourService'], 'getTour').and.returnValue(true);
        const spy = spyOn(service['passTourService'], 'writeMessage');
        spyOn(service['placeLetterService'], 'placeCommand').and.returnValue(false);
        service.message = '!placer h8h test';
        service.executePlace();
        expect(spy).not.toHaveBeenCalled();
    });
});
