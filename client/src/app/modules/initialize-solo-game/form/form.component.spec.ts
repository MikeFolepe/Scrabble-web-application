/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AI_NAME_DATABASE } from '@app/classes/constants';
import { FormComponent } from './form.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { WaitingRoomComponent } from '@app/pages/waiting-room/waiting-room.component';

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
});
