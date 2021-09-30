import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapLetterComponent } from './swap-letter.component';

describe('SwapLetterComponent', () => {
  let component: SwapLetterComponent;
  let fixture: ComponentFixture<SwapLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwapLetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwapLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
