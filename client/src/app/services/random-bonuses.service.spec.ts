import { TestBed } from '@angular/core/testing';

import { RandomBonusesService } from './random-bonuses.service';

describe('RandomBonusesService', () => {
  let service: RandomBonusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RandomBonusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
