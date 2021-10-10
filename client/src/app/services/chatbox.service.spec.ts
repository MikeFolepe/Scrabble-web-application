/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { Letter } from '@app/classes/letter';
import { Player } from '@app/models/player.model';
import { ChatboxService } from './chatbox.service';

describe('ChatboxService', () => {
  let service: ChatboxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatboxService);

    let number = 1;
    service['displayMessage'] = () => {
      number = number *= 2;
      return;
    };

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
    const firstPlayerEasel = [letterA, letterA, letterB, letterB, letterC, letterC, letterA];
    const firstPlayer = new Player(1, 'Player 1', firstPlayerEasel);
    service['playerService'].addPlayer(firstPlayer);
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

  it('using command !debug should call commandDebug()', () => {
    const spy = spyOn(service, 'commandDebug').and.callThrough();
    service.command = 'debug';
    service.sendPlayerMessage('!debug');
    expect(spy).toHaveBeenCalled();
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
    spyOn(service['placeLetterService'], 'place').and.returnValue(true);
    service.command = 'placer';
    service.sendPlayerMessage('!placer h8h hello');
    expect(service.message).toEqual('!placer h8h hello');
  });

  it('using a valid command !échanger should display the respective message', () => {
    spyOn(service['passTourService'], 'writeMessage');
    spyOn(service['tourService'], 'getTour').and.returnValue(true);
    spyOn(service['swapLetterService'], 'swap').and.returnValue(true);
    service.command = 'echanger';
    service.sendPlayerMessage('!échanger abc');
    expect(service.message).toEqual('Player 1 : !échanger abc');
  });

  it('desactivating debug should display the respective message', () => {
    service.command = 'debug';
    service.debugOn = false;
    service.sendPlayerMessage('!debug');
    expect(service.message).toEqual('affichages de débogage désactivés');
  });

  it('using command !passer while it is not your turn should display an error', () => {
    spyOn(service['tourService'], 'getTour').and.returnValue(false);
    service.command = 'passer';
    service.sendPlayerMessage('!passer');
    expect(service.message).toEqual("ERREUR : Ce n'est pas ton tour");
  });

  it('using command !échanger while it is not your turn should display an error', () => {
    spyOn(service['tourService'], 'getTour').and.returnValue(false);
    service.command = 'echanger';
    service.sendPlayerMessage('!échanger');
    expect(service.message).toEqual("ERREUR : Ce n'est pas ton tour");
  });

  it('using command !placer while it is not your turn should display an error', () => {
    spyOn(service['tourService'], 'getTour').and.returnValue(false);
    service.command = 'placer';
    service.sendPlayerMessage('!placer');
    expect(service.message).toEqual("ERREUR : Ce n'est pas ton tour");
  });

  it('using an unvalid command !échanger should display an error', () => {
    spyOn(service['tourService'], 'getTour').and.returnValue(true);
    spyOn(service['swapLetterService'], 'swap').and.returnValue(false);
    spyOn(service['passTourService'], 'writeMessage');
    service.command = 'echanger';
    service.sendPlayerMessage('!échanger xyz');
    expect(service.message).toEqual('ERREUR : La commande est impossible à réaliser');
  });

  it('using an unvalid command !placer should display an error', () => {
    spyOn(service['tourService'], 'getTour').and.returnValue(true);
    spyOn(service['placeLetterService'], 'place').and.returnValue(false);
    spyOn(service['passTourService'], 'writeMessage');
    service.command = 'placer';
    service.sendPlayerMessage('!placer h10v top');
    expect(service.message).toEqual('ERREUR : Le placement est invalide');
  });

  it('displaying a message should display the respective message and its type', () => {
    service.displayMessageByType('I am the player', 'player');
    expect(service.message).toEqual('I am the player');
    expect(service.typeMessage).toEqual('player');
  });
});
