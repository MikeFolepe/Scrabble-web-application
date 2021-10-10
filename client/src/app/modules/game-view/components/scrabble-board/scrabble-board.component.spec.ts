import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridService } from '@app/services/grid.service';
import { MouseHandlerService } from '@app/services/mouse-handler.service';
import { ScrabbleBoardComponent } from './scrabble-board.component';

describe('ScrabbleBoardComponent', () => {
    let component: ScrabbleBoardComponent;
    let fixture: ComponentFixture<ScrabbleBoardComponent>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let mouseServiceSpy: jasmine.SpyObj<MouseHandlerService>;

    beforeEach(() => {
        gridServiceSpy = jasmine.createSpyObj('GridService', ['drawGrid'], ['setGridContext']);
        mouseServiceSpy = jasmine.createSpyObj('MouseHandlerService', ['mouseHitDetect']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ScrabbleBoardComponent],
            providers: [
                { provide: GridService, useValue: gridServiceSpy },
                { provide: MouseHandlerService, useValue: mouseServiceSpy },
            ],
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

    it('buttonDetect should modify the buttonPressed variable', () => {
        const expectedKey = 'a';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        component.buttonDetect(buttonEvent);
        expect(component.buttonPressed).toEqual(expectedKey);
    });

    it('mouse hit detect should call mouse hit detect from gridService', () => {
        gridServiceSpy.setGridContext.and.callFake(() => {
            return;
        });
        const mouseEvent = {
            offsetX: 10,
            offsetY: 1,
            button: 0,
        } as MouseEvent;
        component.mouseHitDetect(mouseEvent);
        expect(mouseServiceSpy.mouseHitDetect).toHaveBeenCalledWith(mouseEvent);
    });
});
