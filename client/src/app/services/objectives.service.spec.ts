import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ObjectivesService } from './objectives.service';

describe('ObjectivesService', () => {
    let service: ObjectivesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
        });
        service = TestBed.inject(ObjectivesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
