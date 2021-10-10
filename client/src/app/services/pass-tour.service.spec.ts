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

    it('should call updated func when changing message', () => {
        let number: number = 1;
        let message: string = 'test message';
        let fn = () => {
            number = number*=2; 
            return;
        }
        service.updateTour(fn);
        expect(service['updateFunc']).toBe(fn);
        let funcSpy = spyOn<any>(service, 'func');
        service.writeMessage(message);
        expect(funcSpy).toHaveBeenCalled();
    });
});
