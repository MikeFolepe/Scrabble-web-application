import { TestBed } from '@angular/core/testing';
import { ClientSocketService } from './client-socket.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ClientSocketService', () => {
    let service: ClientSocketService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
        });
        service = TestBed.inject(ClientSocketService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
