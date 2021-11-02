import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GiveUpGameDialogComponent } from './give-up-game-dialog.component';

describe('GiveUpGameDialogComponent', () => {
    let component: GiveUpGameDialogComponent;
    let fixture: ComponentFixture<GiveUpGameDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GiveUpGameDialogComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GiveUpGameDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
