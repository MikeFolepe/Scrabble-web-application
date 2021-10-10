/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';

import { ChatboxService } from './chatbox.service';

describe('ChatboxService', () => {
    let service: ChatboxService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ChatboxService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should have type error if command is not valid', () => {
        spyOn(service, 'isValid').and.returnValue(false);
        let number = 1;
        service['displayMessage'] = () => {
            number = number *= 2;
            return;
        };
        service.message = '';
        service.sendPlayerMessage(service.message);
        expect(service.typeMessage).toEqual('error');
    });

    it('should have type player if command is valid', () => {
        spyOn(service, 'isValid').and.returnValue(true);
        let number = 1;
        service['displayMessage'] = () => {
            number = number *= 2;
            return;
        };
        service.message = '';
        service.sendPlayerMessage(service.message);
        expect(service.typeMessage).toEqual('player');
    });

    it('should have type player if command is valid', () => {
        spyOn(service, 'isValid').and.returnValue(true);

        let number = 1;
        service['displayMessage'] = () => {
            number = number *= 2;
            return;
        };

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
});
