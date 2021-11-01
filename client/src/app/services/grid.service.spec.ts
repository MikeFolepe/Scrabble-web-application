import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/classes/constants';
import { GridService } from '@app/services/grid.service';
import { TestBed } from '@angular/core/testing';

describe('GridService', () => {
    let service: GridService;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GridService);
        ctxStub = CanvasTestHelper.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.gridContext = ctxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return canvas default width', () => {
        expect(service.width).toEqual(DEFAULT_WIDTH);
    });

    it('should return canvas default height', () => {
        expect(service.height).toEqual(DEFAULT_HEIGHT);
    });

    it(' drawLetter should call fillText on the canvas', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        service.drawLetter(service.gridContext, 'L', {x:1, y:5}, 13);
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it(' drawLetter should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service.drawLetter(service.gridContext, 'L', {x:1, y:5}, 13);
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it('drawGrid should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service.drawGrid();
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });
    
    it('eraseLetter should call clearRect on the canvas', () => {
        const clearRectSpy = spyOn(service.gridContext, 'clearRect').and.callThrough();
        service.eraseLetter(service.gridContext, {x:1, y:5});
        expect(clearRectSpy).toHaveBeenCalled();
    });

    it('drawBonusesBoxes should call colorBonusBox and writeBonusName', () => {
        const bonusPositionsStub = new Map<string, string>([
            ['A1', 'tripleword'],
            ['A4', 'doubleletter'],
            ['A8', 'tripleLetter'],
            ['A12', 'doubleWord'],
            ['A15', 'tripleword']
        ]);
        const colorBonusBoxSpy = spyOn(service, 'colorBonusBox').and.callThrough();
        const writeBonusNameSpy = spyOn(service, 'writeBonusName').and.callThrough();
        service.drawBonusBoxes(bonusPositionsStub);
        expect(colorBonusBoxSpy).toHaveBeenCalled();
        expect(writeBonusNameSpy).toHaveBeenCalled();
    });

    it('should set grid context', () => {
        service.setGridContext(ctxStub);
        expect(service.gridContext).toBe(ctxStub);
    });
});