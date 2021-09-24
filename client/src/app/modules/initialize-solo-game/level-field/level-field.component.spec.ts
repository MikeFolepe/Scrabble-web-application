import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LevelFieldComponent } from './level-field.component';

describe('LevelFieldComponent', () => {
    //let component: LevelFieldComponent;
    let fixture: ComponentFixture<LevelFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LevelFieldComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LevelFieldComponent);
        //component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // it('should create', () => {
    //     expect(component).toBeTruthy();
    // });
});
