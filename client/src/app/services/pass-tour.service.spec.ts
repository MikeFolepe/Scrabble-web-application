import { TestBed } from '@angular/core/testing';
import { PassTourService } from './pass-tour.service';

describe('PasserTourService', () => {
    let service: PassTourService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PassTourService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
