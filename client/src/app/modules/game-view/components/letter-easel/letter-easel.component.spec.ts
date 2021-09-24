import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterEaselComponent } from './letter-easel.component';

describe('LetterEaselComponent', () => {
    // let component: LetterEaselComponent;
    let fixture: ComponentFixture<LetterEaselComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LetterEaselComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LetterEaselComponent);
        // component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('should create', () => {
    //     expect(component).toBeTruthy();
    // });
});
