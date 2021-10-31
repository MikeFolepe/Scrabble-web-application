import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD

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
=======
import { RandomBonusComponent } from './random-bonus.component';

describe('RandomBonusComponent', () => {
    let component: RandomBonusComponent;
    let fixture: ComponentFixture<RandomBonusComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RandomBonusComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RandomBonusComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
>>>>>>> b7bc76bb223ef4674011ed696c8d797922f78013
});
