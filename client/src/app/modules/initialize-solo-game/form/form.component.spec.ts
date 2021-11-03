/* eslint-disable sort-imports */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AI_NAME_DATABASE } from '@app/classes/constants';
import { GameSettingsService } from '@app/services/game-settings.service';
import { StartingPlayer } from '@common/game-settings';
import { FormComponent } from './form.component';

describe('FormComponent', () => {
    let gameSettingsServiceSpy: jasmine.SpyObj<GameSettingsService>;
    let component: FormComponent;
    let fixture: ComponentFixture<FormComponent>;

    beforeEach(() => {
        gameSettingsServiceSpy = jasmine.createSpyObj('GameSettingsService', ['initializeSettings']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FormComponent],
            imports: [RouterModule, RouterTestingModule],
            providers: [{ provide: GameSettingsService, useValue: gameSettingsServiceSpy }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a predefined name for AI', () => {
        const result = component.chooseRandomAIName();
        expect(AI_NAME_DATABASE).toContain(result);
    });

    it('should have a different name from the player', () => {
        component.form.controls.playerName.setValue(component.chooseRandomAIName());
        // To consider randomness, we simulate three times the AI name
        const firstAiName = component.chooseRandomAIName();
        const secondAiName = component.chooseRandomAIName();
        const thirdAiName = component.chooseRandomAIName();
        expect(firstAiName).not.toEqual(component.form.controls.playerName.value);
        expect(secondAiName).not.toEqual(component.form.controls.playerName.value);
        expect(thirdAiName).not.toEqual(component.form.controls.playerName.value);
    });

    it('should choose a valid starting player', () => {
        const result = component.chooseStartingPlayer();
        const players = Object.keys(StartingPlayer);
        expect(players).toContain(result.toString());
    });

    it('should call chooseRandomAIName()', () => {
        const spy = spyOn(component, 'chooseRandomAIName');
        component.initGame();
        expect(spy).toHaveBeenCalled();
    });

    it('should call chooseStartingPlayer()', () => {
        const spy = spyOn(component, 'chooseStartingPlayer');
        component.initGame();
        expect(spy).toHaveBeenCalled();
    });

    // it('should initialize all GameSettings elements', () => {
    //     component.initGame();
    //     expect(gameSettingsServiceSpy.initializeSettings).toHaveBeenCalled();
    // });
});
