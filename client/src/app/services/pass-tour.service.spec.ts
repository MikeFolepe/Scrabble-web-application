import { TestBed } from '@angular/core/testing';
import { PassTourService } from './pass-tour.service';

describe('PassTourService', () => {
    let service: PassTourService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PassTourService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call updated func when changing message', () => {
        let number = 1;
        const message = 'test message';
        const fn = () => {
            number = number *= 2;
            return;
        };
        service.updateTour(fn);
        expect(service.updateTour).toBe(fn);
        const updateTourSpy = spyOn<any>(service, 'updateTour');
        service.writeMessage(message);
        expect(updateTourSpy).toHaveBeenCalled();
    });
});
