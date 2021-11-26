import { TestBed } from '@angular/core/testing';
import { PlacementsHandlerService } from './placements-handler.service';

describe('PlacementsHandlerService', () => {
    let service: PlacementsHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PlacementsHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
