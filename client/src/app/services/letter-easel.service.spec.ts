import { TestBed } from '@angular/core/testing';

import { LetterEaselService } from './letter-easel.service';

describe('LetterEaselService', () => {
  let service: LetterEaselService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LetterEaselService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
