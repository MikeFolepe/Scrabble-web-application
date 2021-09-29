import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordValidationComponent } from './word-validation.component';

describe('WordValidationComponent', () => {
    let component: WordValidationComponent;
    let fixture: ComponentFixture<WordValidationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WordValidationComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WordValidationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
