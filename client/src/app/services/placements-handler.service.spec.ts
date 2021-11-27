import { TestBed } from '@angular/core/testing';
import { PlacementsHandlerService } from './placements-handler.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('PlacementsHandlerService', () => {
    let service: PlacementsHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
        });
        service = TestBed.inject(PlacementsHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
