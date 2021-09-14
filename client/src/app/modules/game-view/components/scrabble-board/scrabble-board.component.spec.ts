import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrabbleBoardComponent } from './scrabble-board.component';

describe('ScrabbleBoardComponent', () => {
  let component: ScrabbleBoardComponent;
  let fixture: ComponentFixture<ScrabbleBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrabbleBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrabbleBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
