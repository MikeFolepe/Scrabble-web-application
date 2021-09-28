import { TestBed } from '@angular/core/testing';

import { MouseHandlerServiceService } from './mouse-handler-service.service';

describe('MouseHandlerServiceService', () => {
  let service: MouseHandlerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MouseHandlerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
