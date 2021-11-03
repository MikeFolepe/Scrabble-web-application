import { ClientSocketService } from './client-socket.service';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';

describe('ClientSocketService', () => {
    let service: ClientSocketService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule, RouterTestingModule],
        });
        service = TestBed.inject(ClientSocketService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
