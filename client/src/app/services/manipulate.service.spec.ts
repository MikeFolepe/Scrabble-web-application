import { TestBed } from '@angular/core/testing';

import { ManipulateService } from './manipulate.service';

describe('ManipulateService', () => {
    let service: ManipulateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ManipulateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
