/* eslint-disable @typescript-eslint/no-explicit-any */
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

    it('should call updated func', () => {
        let number = 1;
        const fn = () => {
            number = number *= 2;
            return;
        };
        service.updateTour(fn);
        expect(service.updateFunc).toBe(fn);
    });

    it('should call updated func when changing message', () => {
        let number = 1;
        const message = 'test message';
        service.updateFunc = () => {
            number = number *= 2;
            return;
        };
        const updateFuncSpy = spyOn<any>(service, 'updateFunc');
        service.writeMessage(message);
        expect(updateFuncSpy).toHaveBeenCalled();
    });
});
