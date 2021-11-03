/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameSettings } from '@common/game-settings';
import { InformationPanelComponent } from './information-panel.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SkipTurnService } from '@app/services/skip-turn.service';

describe('InformationPanelComponent', () => {
    let component: InformationPanelComponent;
    let fixture: ComponentFixture<InformationPanelComponent>;
    let skipTurnSpy: jasmine.SpyObj<SkipTurnService>;

    beforeEach(() => {
        skipTurnSpy = jasmine.createSpyObj('SkipTurnService', ['startTimer', 'stopTimer']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InformationPanelComponent],
            providers: [{ provide: SkipTurnService, useValue: skipTurnSpy }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InformationPanelComponent);
        component = fixture.componentInstance;
        component['gameSettings'] = new GameSettings(
            ['Paul', 'Mike'],
            1,
            '00',
            '30',
            'facile',
            'Désactiver',
            "[['A1', 'doubleLetter'], ['A4', 'tripleLetter']]",
            'français',
        );
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call clearPlayers on Destroy', () => {
        spyOn(component.playerService, 'clearPlayers');
        component.ngOnDestroy();
        expect(component.playerService.clearPlayers).toHaveBeenCalled();
    });

    it('should start timer if game is solo', () => {
        component.gameSettingsService.isSoloMode = true;
        component.ngOnInit();
        expect(skipTurnSpy.startTimer).toHaveBeenCalledTimes(1);
    });
});
