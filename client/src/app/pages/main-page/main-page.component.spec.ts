/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientModule, RouterTestingModule],
            declarations: [MainPageComponent],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should route to the right page according to the selected game mode', () => {
        const spy = spyOn(component['router'], 'navigate').and.callThrough();

        component.selectedGameMode = 'Jouer une partie en solo';
        component.route();
        expect(component.gameSettingsService.isSoloMode).toBeTrue();
        expect(spy).toHaveBeenCalledOnceWith(['solo-game-ai']);

        component.selectedGameMode = 'Créer une partie multijoueur';
        component.route();
        expect(component.gameSettingsService.isSoloMode).toBeFalse();
        expect(spy).toHaveBeenCalledWith(['multiplayer-mode']);

        component.selectedGameMode = 'Joindre une partie multijoueur';
        component.route();
        expect(spy).toHaveBeenCalledWith(['multiplayer-mode']);
    });
});
