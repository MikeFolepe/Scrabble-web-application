import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerIAComponent } from './player-ia.component';

describe('PlayerIAComponent', () => {
    let component: PlayerIAComponent;
    let fixture: ComponentFixture<PlayerIAComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayerIAComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerIAComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
