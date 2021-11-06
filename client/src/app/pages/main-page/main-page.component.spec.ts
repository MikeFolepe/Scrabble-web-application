/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

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

    it('should route to solo-game-ia when selected mode is solo', () => {
        const spyNavigate = spyOn(component['router'], 'navigate');

        component.selectedGameMode = 'Jouer une partie en solo';
        component.routeToGameMode();
        expect(component.gameSettingsService.isSoloMode).toBeTrue();
        expect(spyNavigate).toHaveBeenCalledOnceWith(['solo-game-ai']);
    });

    it('should route to multiplayer-mode when selected mode is multiplayer', () => {
        const spyNavigate = spyOn(component['router'], 'navigate');

        component.selectedGameMode = 'Créer une partie multijoueur';
        component.routeToGameMode();
        expect(component.gameSettingsService.isSoloMode).toBeFalse();
        expect(spyNavigate).toHaveBeenCalledWith(['multiplayer-mode']);

        component.selectedGameMode = 'Joindre une partie multijoueur';
        component.routeToGameMode();
        expect(spyNavigate).toHaveBeenCalledWith(['multiplayer-mode']);
    });

    it('should route to join-room when selected mode is join multiplayer', () => {
        const spyNavigate = spyOn(component['router'], 'navigate');

        component.selectedGameMode = 'Joindre une partie multijoueur';
        component.routeToGameMode();
        expect(spyNavigate).toHaveBeenCalledWith(['join-room']);
    });
});
