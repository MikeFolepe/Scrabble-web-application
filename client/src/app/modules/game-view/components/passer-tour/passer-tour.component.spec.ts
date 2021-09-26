import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasserTourComponent } from './passer-tour.component';

describe('PasserTourComponent', () => {
  let component: PasserTourComponent;
  let fixture: ComponentFixture<PasserTourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasserTourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasserTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
