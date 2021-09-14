import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationPannelComponent } from './information-pannel.component';

describe('InformationPannelComponent', () => {
  let component: InformationPannelComponent;
  let fixture: ComponentFixture<InformationPannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformationPannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationPannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
