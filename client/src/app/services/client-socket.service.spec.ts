import { ClientSocketService } from './client-socket.service';

import { TestBed } from '@angular/core/testing';

describe('ClientSocketService', () => {
    let service: ClientSocketService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ClientSocketService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
