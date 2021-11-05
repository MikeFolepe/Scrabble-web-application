/* eslint-disable dot-notation */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TypeMessage } from '@app/classes/enum';
import { SendMessageService } from '@app/services/send-message.service';
import { io, Socket } from 'socket.io-client';

describe('SendMessageService', () => {
    let service: SendMessageService;
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

    it('should send message as opponent when sendOpponentMessage() is called', () => {
        service.sendOpponentMessage('Opponent message');
        expect(service.message).toEqual('Opponent message');
        expect(service.typeMessage).toEqual(TypeMessage.Opponent);
    });

    it('the emit receiveRoomMessage should call sendOpponentMessage', () => {
        service['clientSocketService'].socket = {
            // eslint-disable-next-line no-unused-vars
            on: (eventName: string, callback: (message: string) => void) => {
                if (eventName === 'receiveRoomMessage') {
                    callback('test');
                }
            },
        } as unknown as Socket;
        spyOn(service, 'sendOpponentMessage');
        service.receiveMessageFromOpponent();
        expect(service.sendOpponentMessage).toHaveBeenCalledWith('test');
    });

    it('displayBound should associate a function to displayMessage', () => {
        const functionTest = () => {
            return;
        };
        service.displayBound(functionTest);
        expect(service['displayMessage']).toEqual(functionTest);
    });
});
