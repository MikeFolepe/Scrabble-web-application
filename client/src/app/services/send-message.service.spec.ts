/* eslint-disable dot-notation */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TypeMessage } from '@app/classes/enum';
import { SendMessageService } from '@app/services/send-message.service';
import { io, Socket } from 'socket.io-client';
import { ClientSocketService } from './client-socket.service';

describe('SendMessageService', () => {
    let service: SendMessageService;
    let clientSocketServiceSpy: jasmine.SpyObj<ClientSocketService>;
    let url: string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
        });
        service = TestBed.inject(SendMessageService);
        let number = 1;
        service['displayMessage'] = () => {
            number = number *= 2;
            return;
        };
        // spyOn(clientSocketServiceSpy.socket, 'on');
        url = `http://${window.location.hostname}:3000`;
        service['clientSocketService'].socket = io(url);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('displaying a message should display the respective message and its type', () => {
        service.displayMessageByType('I am the player', TypeMessage.Player);
        expect(service.message).toEqual('I am the player');
        expect(service.typeMessage).toEqual(TypeMessage.Player);
    });

    it('should sendOpponentMessage on receiveMessageFromOpponent', () => {
        clientSocketServiceSpy.socket = jasmine.createSpyObj('Socket', ['on']) as unknown as Socket;
        const sendOpponentMessageSpy = spyOn(service, 'sendOpponentMessage');
        service['clientSocketService'].socket = {
            // eslint-disable-next-line no-unused-vars
            on: (eventName: string, callback: (message: string) => void) => {
                if (eventName === 'receiveRoomMessage') {
                    callback('fakeMessage');
                }
            },
        } as unknown as Socket;
        service.receiveMessageFromOpponent();
        expect(sendOpponentMessageSpy).toHaveBeenCalledWith('fakeMessage');
    });

    it('should send message as opponent when sendOpponentMessage() is called', () => {
        service.sendOpponentMessage('Opponent message');
        expect(service.message).toEqual('Opponent message');
        expect(service.typeMessage).toEqual(TypeMessage.Opponent);
    });
});
