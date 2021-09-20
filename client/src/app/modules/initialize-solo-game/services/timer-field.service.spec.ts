import { TestBed } from '@angular/core/testing';
import { TimerFieldService } from './timer-field.service';

describe('TimerFieldService', () => {
    let service: TimerFieldService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TimerFieldService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
