/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerService } from '@app/services/player.service';
import { LetterEaselComponent } from './letter-easel.component';

describe('LetterEaselComponent', () => {
    let component: LetterEaselComponent;
    let fixture: ComponentFixture<LetterEaselComponent>;
    let playerServiceSpy: jasmine.SpyObj<PlayerService>;

    beforeEach(() => {
        playerServiceSpy = jasmine.createSpyObj('PlayerService', ['updateLettersEasel', 'getLettersEasel', 'updateFontSize']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LetterEaselComponent],
            providers: [{ provide: PlayerService, useValue: playerServiceSpy }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LetterEaselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('each initialization should update by calling by calling getLettersEasel of player service', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateSpy = spyOn<any>(component, 'update');
        component.ngOnInit();
        expect(updateSpy).toHaveBeenCalled();
        expect(playerServiceSpy.getLettersEasel).toHaveBeenCalled();
    });

    it('should update component fontSize and playerService fontSize with new fontSize', () => {
        const fontSize = 10;
        component.handleFontSizeEvent(fontSize);
        expect(component.fontSize).toEqual(fontSize);
        expect(playerServiceSpy.updateFontSize).toHaveBeenCalled();
    });
});
