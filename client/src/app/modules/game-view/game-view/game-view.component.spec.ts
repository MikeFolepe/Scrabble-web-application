import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameViewComponent } from './game-view.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('GameViewComponent', () => {
    let component: GameViewComponent;
    let fixture: ComponentFixture<GameViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameViewComponent],
            imports: [RouterModule, RouterTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
