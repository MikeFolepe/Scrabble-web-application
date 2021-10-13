import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Letter } from '@app/classes/letter';
import { PlayerService } from '@app/services/player.service';
import { LetterEaselComponent } from './letter-easel.component';

xdescribe('LetterEaselComponent', () => {
    let component: LetterEaselComponent;
    let fixture: ComponentFixture<LetterEaselComponent>;
    let playerServiceSpy: jasmine.SpyObj<PlayerService>;

    const letterA: Letter = {
        value: 'A',
        quantity: 0,
        points: 0,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    };
    const letterB: Letter = {
        value: 'B',
        quantity: 0,
        points: 0,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    };
    const letterC: Letter = {
        value: 'C',
        quantity: 0,
        points: 0,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    };
    const letterD: Letter = {
        value: 'D',
        quantity: 0,
        points: 0,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    };
    const letterH: Letter = {
        value: 'H',
        quantity: 0,
        points: 0,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    };
    const letterWhite: Letter = {
        value: '*',
        quantity: 0,
        points: 0,
        isSelectedForSwap: false,
        isSelectedForManipulation: false,
    };

    beforeEach(() => {
        playerServiceSpy = jasmine.createSpyObj('PlayerService', ['updateLettersEasel', 'getLettersEasel', 'updateFontSize']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LetterEaselComponent],
            providers: [{ provide: PlayerService, useValue: playerServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LetterEaselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        component.letterEaselTab = [letterA, letterA, letterB, letterC, letterD, letterH, letterWhite];
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
