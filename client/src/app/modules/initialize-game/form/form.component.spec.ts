/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StartingPlayer } from '@common/game-settings';
import { Level } from '@common/level';
import { FormComponent } from './form.component';

describe('FormComponent', () => {
    let component: FormComponent;
    let fixture: ComponentFixture<FormComponent>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        router = jasmine.createSpyObj('Router', ['navigate']);
        await TestBed.configureTestingModule({
            declarations: [FormComponent],
            providers: [
                { provide: Router, useValue: router },
                {
                    provide: MatDialog,
                    useValue: {},
                },
                {
                    provide: MatSnackBar,
                    useValue: {},
                },
            ],
            imports: [HttpClientTestingModule, RouterTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.form = new FormGroup({
            playerName: new FormControl(''),
            minuteInput: new FormControl('70'),
            secondInput: new FormControl('00'),
            levelInput: new FormControl(Level.Beginner),
            randomBonus: new FormControl('Désactiver'),
        });

        component.gameSettingsService.gameSettings.playersNames[0] = 'player 1';
        component.gameSettingsService.isSoloMode = true;
        component.adminService.expertNames = [
            {
                _id: '1',
                aiName: 'Mister_Felix',
                isDefault: true,
            },
            {
                _id: '2',
                aiName: 'Miss_Patty',
                isDefault: true,
            },
            {
                _id: '3',
                aiName: 'Miss_Judith',
                isDefault: true,
            },
        ];

        component.adminService.beginnerNames = [
            {
                _id: '1',
                aiName: 'Mister_Bucky',
                isDefault: true,
            },
            {
                _id: '2',
                aiName: 'Miss_Betty',
                isDefault: true,
            },
            {
                _id: '3',
                aiName: 'Mister_Samy',
                isDefault: true,
            },
        ];
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('should have a predefined name for AI', () => {
    //     const result = component['chooseRandomAIName'](Level.Beginner);
    //     expect(component.expertsAi.values).toContain(result);
    // });

    it('should have a different name from the player', () => {
        component.form.controls.playerName.setValue(component['chooseRandomAIName'](Level.Beginner));
        // To consider randomness, we simulate three times the AI name
        const firstAiName = component['chooseRandomAIName'](Level.Beginner);
        const secondAiName = component['chooseRandomAIName'](Level.Beginner);
        const thirdAiName = component['chooseRandomAIName'](Level.Beginner);
        expect(firstAiName).not.toEqual(component.form.controls.playerName.value);
        expect(secondAiName).not.toEqual(component.form.controls.playerName.value);
        expect(thirdAiName).not.toEqual(component.form.controls.playerName.value);
    });

    it('should choose a valid starting player', () => {
        const result = component['chooseStartingPlayer']();
        const players = Object.keys(StartingPlayer);
        expect(players).toContain(result.toString());
    });

    // it('should call chooseRandomAIName()', async () => {
    //     const chooseRandomAINameSpy = spyOn<any>(component, 'chooseRandomAIName');
    //     component.initializeGame();
    //     expect(chooseRandomAINameSpy).toHaveBeenCalled();
    // });

    // it('should call chooseStartingPlayer()', () => {
    //     const chooseStartingPlayerSpy = spyOn<any>(component, 'chooseStartingPlayer');
    //     component.initializeGame();
    //     expect(chooseStartingPlayerSpy).toHaveBeenCalled();
    // });

    // it('should route to game if it is soloGame', () => {
    //     component.gameSettingsService.isSoloMode = true;
    //     component.initializeGame();
    //     expect(router.navigate).toHaveBeenCalledWith(['game']);
    // });

    // it('should route to multiplayer-mode-waiting-room if it is not soloGame', () => {
    //     component.gameSettingsService.isSoloMode = false;
    //     component.initializeGame();
    //     expect(router.navigate).toHaveBeenCalledWith(['multiplayer-mode-waiting-room']);
    // });

    it('should call shuffleBonusPositons of randomBonusService if randomBonus are activated in the form', () => {
        const shuffleBonusPositionsSpy = spyOn(component['randomBonusService'], 'shuffleBonusPositions').and.returnValue(
            new Map<string, string>([['A1', 'doubleLetter']]),
        );
        component.form = new FormGroup({
            playerName: new FormControl(''),
            minuteInput: new FormControl('01'),
            secondInput: new FormControl('00'),
            levelInput: new FormControl(Level.Beginner),
            randomBonus: new FormControl('Activer'),
        });
        const bonus = component['getRightBonusPositions']();
        expect(bonus).toBeInstanceOf(String);
        expect(shuffleBonusPositionsSpy).toHaveBeenCalled();
    });
});
