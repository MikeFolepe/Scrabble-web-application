import { TestBed } from '@angular/core/testing';
import { PassertourService } from './passertour.service';

describe('PassertourService', () => {
    let service: PassertourService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PassertourService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
