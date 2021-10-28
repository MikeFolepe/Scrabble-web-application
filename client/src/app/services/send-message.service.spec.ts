/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';

import { SendMessageService } from './send-message.service';

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
        service.displayMessageByType('I am the player', 'player');
        expect(service.message).toEqual('I am the player');
        expect(service.typeMessage).toEqual('player');
    });
});
