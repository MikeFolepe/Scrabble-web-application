import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomBonusComponent } from './random-bonus.component';

describe('RandomBonusComponent', () => {
  let component: RandomBonusComponent;
  let fixture: ComponentFixture<RandomBonusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RandomBonusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
