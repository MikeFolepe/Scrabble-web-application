/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { INDEX_REAL_PLAYER } from '@app/classes/constants';
import { Letter } from '@app/classes/letter';
import { Player } from '@app/models/player.model';
import { LetterEaselComponent } from './letter-easel.component';

fdescribe('LetterEaselComponent', () => {
    let component: LetterEaselComponent;
    let fixture: ComponentFixture<LetterEaselComponent>;
    let getLettersSpy: any;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LetterEaselComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LetterEaselComponent);
        component = fixture.componentInstance;
        getLettersSpy = spyOn(component['playerService'], 'getLettersEasel').and.returnValue(component.letterEaselTab);
        spyOn(component['playerService'], 'updateLettersEasel');
        fixture.detectChanges();

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
        const letterE: Letter = {
            value: 'E',
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
        component.letterEaselTab = [letterA, letterE, letterB, letterC, letterD, letterH, letterWhite];
        const firstPlayer = new Player(1, 'Player 1', component.letterEaselTab);
        component['playerService'].addPlayer(firstPlayer);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('each initialization should update by calling by calling getLettersEasel of player service', () => {
        const updateSpy = spyOn<any>(component, 'update');
        component.ngOnInit();
        expect(updateSpy).toHaveBeenCalled();
        expect(getLettersSpy).toHaveBeenCalled();
    });

    it('should update component fontSize and playerService fontSize with new fontSize', () => {
        const spy = spyOn(component['playerService'], 'updateFontSize').and.callThrough();
        const fontSize = 10;
        component.handleFontSizeEvent(fontSize);
        expect(component.fontSize).toEqual(fontSize);
        expect(spy).toHaveBeenCalled();
    });

    it('left clicking on a letter in the easel should call onLeftClick()', () => {
        spyOn(component, 'onLeftClick');
        fixture.detectChanges();
        const letterContainer = fixture.debugElement.query(By.css('.letter-container'));
        letterContainer.triggerEventHandler('click', null);
        expect(component.onLeftClick).toHaveBeenCalled();
    });

    it('right clicking on a letter in the easel should call onRightClick()', () => {
        spyOn(component, 'onRightClick');
        fixture.detectChanges();
        const letterContainer = fixture.debugElement.query(By.css('.letter-container'));
        letterContainer.triggerEventHandler('contextmenu', null);
        expect(component.onRightClick).toHaveBeenCalled();
    });

    it('left clicking the 1st letter that is unselected should select it for manipulation', () => {
        component.letterEaselTab[0].isSelectedForSwap = false;
        component.letterEaselTab[0].isSelectedForManipulation = false;
        const clickEvent = new MouseEvent('click');
        component.onLeftClick(clickEvent, 0);
        expect(component.letterEaselTab[0].isSelectedForManipulation).toBeTrue();
    });

    it('left clicking the 1st letter that is already selected for manipulation should unselect it', () => {
        component.letterEaselTab[0].isSelectedForManipulation = true;
        const clickEvent = new MouseEvent('click');
        component.onLeftClick(clickEvent, 0);
        expect(component.letterEaselTab[0].isSelectedForManipulation).toBeFalse();
    });

    it('right clicking the 1st letter that is unselected should select it for swapping', () => {
        component.letterEaselTab[0].isSelectedForSwap = false;
        component.letterEaselTab[0].isSelectedForManipulation = false;
        const clickEvent = new MouseEvent('contextmenu');
        component.onRightClick(clickEvent, 0);
        expect(component.letterEaselTab[0].isSelectedForSwap).toBeTrue();
    });

    it('right clicking the 1st letter that is already selected for swapping should unselect it', () => {
        component.letterEaselTab[0].isSelectedForSwap = true;
        const clickEvent = new MouseEvent('contextmenu');
        component.onRightClick(clickEvent, 0);
        expect(component.letterEaselTab[0].isSelectedForSwap).toBeFalse();
    });

    it('swapping a letter should call swap() from swapLetterService', () => {
        const swapSpy = spyOn(component['swapLetterService'], 'swap');
        spyOn(component['chatBoxService'], 'displayMessageByType');
        spyOn(component['passTurnService'], 'writeMessage');

        component.letterEaselTab[0].isSelectedForSwap = true;
        component.swap();
        expect(swapSpy).toHaveBeenCalledOnceWith(0, INDEX_REAL_PLAYER);
    });

    it('cancelling selection should unselect all letters and disactivate the cancel button', () => {
        for (const letters of component.letterEaselTab) {
            letters.isSelectedForSwap = true;
        }
        component.cancelSelection();
        expect(component.isCancelButtonActive()).toBeFalse();
    });

    it('cancel button should be active if at least one letter is selected', () => {
        component.letterEaselTab[0].isSelectedForSwap = true;
        expect(component.isCancelButtonActive()).toBeTrue();
    });

    it('swap button should be disactive if it is not your turn', () => {
        spyOn(component['turnService'], 'getTour').and.returnValue(false);
        expect(component.isSwapButtonActive()).toBeFalse();
    });

    it('swap button should be disactive if there is less than 7 letters in the reserve', () => {
        spyOn(component['turnService'], 'getTour').and.returnValue(true);
        spyOn(component['letterService'], 'getReserveSize').and.returnValue(6);
        expect(component.isSwapButtonActive()).toBeFalse();
    });

    it('swap button should be disactive if none letters are selected for swapping', () => {
        spyOn(component['turnService'], 'getTour').and.returnValue(true);
        spyOn(component['letterService'], 'getReserveSize').and.returnValue(7);
        expect(component.isSwapButtonActive()).toBeFalse();
    });

    it('swap button should be active if at least one letter is selected for swapping', () => {
        spyOn(component['turnService'], 'getTour').and.returnValue(true);
        spyOn(component['letterService'], 'getReserveSize').and.returnValue(7);
        component.letterEaselTab[0].isSelectedForSwap = true;
        expect(component.isSwapButtonActive()).toBeTrue();
    });

    it('clicking outside the easel should unselect all letters', () => {
        component.letterEaselTab[0].isSelectedForManipulation = true;
        const event = new Event('click');
        document.dispatchEvent(event);
        expect(component.letterEaselTab[0].isSelectedForManipulation).toBeFalse();
    });

    it('clicking inside the easel should not unselect all letters', () => {
        component.letterEaselTab[0].isSelectedForManipulation = true;
        spyOn(component, 'onLeftClick');
        fixture.detectChanges();
        const easelContainer = fixture.debugElement.query(By.css('.easel-container'));
        easelContainer.triggerEventHandler('click', null);
        expect(component.letterEaselTab[0].isSelectedForManipulation).toBeTrue();
    });
});
