import { TestBed } from '@angular/core/testing';

import { TourService } from './tour.service';

describe('TourService', () => {
    let service: TourService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TourService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize and emit tour', () => {
        let emitTourSpy = spyOn<any>(service, 'emitTour').and.callThrough();
        let expectedTour: boolean = false;
        service.initializeTour(expectedTour);
        expect(service['tour']).toBe(expectedTour);
        expect(emitTourSpy).toHaveBeenCalled();
    })
});
