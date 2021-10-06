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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const emitTourSpy = spyOn<any>(service, 'emitTour').and.callThrough();
        const expectedTour = false;
        service.initializeTour(expectedTour);
        expect(service.getTour()).toBe(expectedTour);
        expect(emitTourSpy).toHaveBeenCalled();
    });

    it('should emit when emitTour() is called', () => {
        let emitted = false;
        service.tourSubject.subscribe(() => {
            emitted = true;
        });
        service.emitTour();
        expect(emitted).toBeTrue();
    });
});
