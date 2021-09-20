import { TestBed } from '@angular/core/testing';
import { PlayerNameFieldService } from './player-name-field.service';

describe('PlayerNameFieldService', () => {
    let service: PlayerNameFieldService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PlayerNameFieldService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
