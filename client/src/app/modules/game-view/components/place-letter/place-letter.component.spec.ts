import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaceLetterComponent } from './place-letter.component';

describe('PlaceLetterComponent', () => {
    let component: PlaceLetterComponent;
    let fixture: ComponentFixture<PlaceLetterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlaceLetterComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlaceLetterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
