/* eslint-disable dot-notation */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AI_NAME_DATABASE } from '@app/classes/constants';
import { WaitingRoomComponent } from '@app/pages/waiting-room/waiting-room.component';
import { StartingPlayer } from '@common/game-settings';
import { FormComponent } from './form.component';

describe('FormComponent', () => {
    let component: FormComponent;
    let fixture: ComponentFixture<FormComponent>;
    RouterTestingModule.withRoutes([{ path: 'multiplayer-mode-waiting-room', component: WaitingRoomComponent }]);

    beforeEach(async () => {
        RouterTestingModule.withRoutes([{ path: 'multiplayer-mode-waiting-room', component: WaitingRoomComponent }]);
        await TestBed.configureTestingModule({
            declarations: [FormComponent],
            imports: [RouterTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
        component.form = new FormGroup({
            playerName: new FormControl(''),
            minuteInput: new FormControl('70'),
            secondInput: new FormControl('00'),
            levelInput: new FormControl('Facile'),
            randomBonus: new FormControl('Désactiver'),
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        component.gameSettingsService.gameSettings.playersName[0] = 'player 1';
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a predefined name for AI', () => {
        const result = component['chooseRandomAIName']();
        expect(AI_NAME_DATABASE).toContain(result);
    });

    it('should have a different name from the player', () => {
        component.form.controls.playerName.setValue(component['chooseRandomAIName']());
        // To consider randomness, we simulate three times the AI name
        const firstAiName = component['chooseRandomAIName']();
        const secondAiName = component['chooseRandomAIName']();
        const thirdAiName = component['chooseRandomAIName']();
        expect(firstAiName).not.toEqual(component.form.controls.playerName.value);
        expect(secondAiName).not.toEqual(component.form.controls.playerName.value);
        expect(thirdAiName).not.toEqual(component.form.controls.playerName.value);
    });

    it('should choose a valid starting player', () => {
        const result = component.chooseStartingPlayer();
        const players = Object.keys(StartingPlayer);
        expect(players).toContain(result.toString());
    });

    it('should call chooseRandomAIName()', async () => {
        spyOn(component['router'], 'navigate');
        const chooseRandomAINameSpy = spyOn(component, 'chooseRandomAIName');
        component.initGame();
        expect(chooseRandomAINameSpy).toHaveBeenCalled();
    });

    it('should call chooseStartingPlayer()', () => {
        spyOn(component['router'], 'navigate');
        const chooseStartingPlayerSpy = spyOn(component, 'chooseStartingPlayer');
        component.initGame();
        expect(chooseStartingPlayerSpy).toHaveBeenCalled();
    });

    it('should only initSoloGame and not initMultiplayerGame if it is soloGame', () => {
        const initSoloGameSpy = spyOn(component, 'initSoloGame');
        const initMultiplayerGameSpy = spyOn(component, 'initMultiplayerGame');
        component.gameSettingsService.isSoloMode = true;
        component.initGame();
        expect(initSoloGameSpy).toHaveBeenCalled();
        expect(initMultiplayerGameSpy).not.toHaveBeenCalled();
    });

    it('should initMultiplayerGame if it is not soloGame', () => {
        const initMultiplayerGameSpy = spyOn(component, 'initMultiplayerGame');
        component.gameSettingsService.isSoloMode = false;
        component.initGame();
        expect(initMultiplayerGameSpy).toHaveBeenCalled();
    });

    it('should call shuffleBonusPositons of randomBonusService if randomBonus are activated in the form', () => {
        const shuffleBonusPositionsSpy = spyOn(component['randomBonusService'], 'shuffleBonusPositions');
        component.form = new FormGroup({
            playerName: new FormControl(''),
            minuteInput: new FormControl('70'),
            secondInput: new FormControl('00'),
            levelInput: new FormControl('Facile'),
            randomBonus: new FormControl('Activer'),
        });
        component.getRightBonusPositions();
        expect(shuffleBonusPositionsSpy).toHaveBeenCalled();
    });

    // it('should initialize all GameSettings elements', () => {
    //     component.initGame();
    //     expect(gameSettingsServiceSpy.initializeSettings).toHaveBeenCalled();
    // });
});
