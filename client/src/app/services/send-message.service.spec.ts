/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { TypeMessage } from '@app/classes/enum';
import { SendMessageService } from './send-message.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SendMessageService', () => {
    let service: SendMessageService;

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
});
