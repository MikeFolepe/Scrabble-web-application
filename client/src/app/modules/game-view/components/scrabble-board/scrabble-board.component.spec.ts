/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardHandlerService } from '@app/services/board-handler.service';
import { ScrabbleBoardComponent } from './scrabble-board.component';

describe('ScrabbleBoardComponent', () => {
    let component: ScrabbleBoardComponent;
    let fixture: ComponentFixture<ScrabbleBoardComponent>;
    let boardHandlerServiceSpy: jasmine.SpyObj<BoardHandlerService>;

    beforeEach(() => {
        boardHandlerServiceSpy = jasmine.createSpyObj('BoardHandlerService', ['mouseHitDetect', 'buttonDetect']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ScrabbleBoardComponent],
            providers: [{ provide: BoardHandlerService, useValue: boardHandlerServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ScrabbleBoardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    /*
    it('buttonDetect should modify the buttonPressed variable', () => {
        spyOn(component['gridService'], 'setGridContext');
        const expectedKey = 'a';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        component.buttonDetect(buttonEvent);
        expect(component.buttonPressed).toEqual(expectedKey);
    });
    /*
    it('mouse hit detect should call mouse hit detect from gridService', () => {
        spyOn(component['gridService'], 'setGridContext');
        const mouseEvent = {
            offsetX: 10,
            offsetY: 1,
            button: 0,
        } as MouseEvent;
        component.mouseHitDetect(mouseEvent);
        expect(mouseServiceSpy.mouseHitDetect).toHaveBeenCalledWith(mouseEvent);
    });
    */
});
