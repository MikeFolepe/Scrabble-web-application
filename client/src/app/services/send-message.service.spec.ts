/* eslint-disable dot-notation */
import { SendMessageService } from '@app/services/send-message.service';
import { TestBed } from '@angular/core/testing';
import { TypeMessage } from '@app/classes/enum';

describe('SendMessageService', () => {
    let service: SendMessageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
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
});
