/* eslint-disable @typescript-eslint/no-magic-numbers */
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/classes/constants';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { GridService } from '@app/services/grid.service';
import { TestBed } from '@angular/core/testing';

describe('GridService', () => {
    let service: GridService;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GridService);
        ctxStub = CanvasTestHelper.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.gridContextBoardLayer = ctxStub;
        service.gridContextLettersLayer = ctxStub;
        service.gridContextPlacementLayer = ctxStub;
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
        const fillTextSpy = spyOn(service.gridContextLettersLayer, 'fillText').and.callThrough();
        service.drawLetter(service.gridContextLettersLayer, 'L', { x: 1, y: 5 }, 13);
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it(' drawLetter should color pixels on the canvas', () => {
        let imageData = service.gridContextLettersLayer.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service.drawLetter(service.gridContextLettersLayer, 'L', { x: 1, y: 5 }, 13);
        imageData = service.gridContextLettersLayer.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' drawGrid should color pixels on the canvas', () => {
        let imageData = service.gridContextBoardLayer.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service.drawGrid();
        imageData = service.gridContextBoardLayer.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it('eraseLetter should call clearRect on the canvas', () => {
        const clearRectSpy = spyOn(service.gridContextLettersLayer, 'clearRect').and.callThrough();
        service.eraseLetter(service.gridContextLettersLayer, { x: 1, y: 5 });
        expect(clearRectSpy).toHaveBeenCalled();
    });

    it('eraseLayer should call clearRect on the canvas', () => {
        const clearRectSpy = spyOn(service.gridContextLettersLayer, 'clearRect').and.callThrough();
        service.eraseLayer(service.gridContextLettersLayer);
        expect(clearRectSpy).toHaveBeenCalled();
    });

    it('drawBorder should call strokeRect on the canvas', () => {
        const strokeRectSpy = spyOn(service.gridContextLettersLayer, 'strokeRect').and.callThrough();
        service.drawBorder(service.gridContextLettersLayer, { x: 1, y: 5 });
        expect(strokeRectSpy).toHaveBeenCalled();
    });

    it('drawBonusesBoxes should call colorBonusBox and writeBonusName', () => {
        const bonusPositionsStub = new Map<string, string>([
            ['A1', 'tripleword'],
            ['A4', 'doubleletter'],
            ['A8', 'tripleletter'],
            ['A12', 'doubleword'],
            ['A15', 'tripleword'],
            ['B2', 'doubleword'],
            ['B6', 'tripleletter'],
            ['B10', 'doubleletter'],
            ['B14', 'doubleword'],
            ['C3', ''],
        ]);
        const colorBonusBoxSpy = spyOn(service, 'colorBonusBox').and.callThrough();
        const writeBonusNameSpy = spyOn(service, 'writeBonusName').and.callThrough();
        service.drawBonusBoxes(bonusPositionsStub);
        expect(colorBonusBoxSpy).toHaveBeenCalled();
        expect(writeBonusNameSpy).toHaveBeenCalled();
    });

    it('should set grid context', () => {
        service.setGridContext(ctxStub);
        expect(service.gridContextBoardLayer).toBe(ctxStub);
    });

    it('drawArrow should call stroke and fill on the canvas', () => {
        const strokeSpy = spyOn(service.gridContextPlacementLayer, 'stroke');
        const fillSpy = spyOn(service.gridContextPlacementLayer, 'fill');
        service.drawArrow(service.gridContextPlacementLayer, { x: 7, y: 7 }, 'h');
        service.drawArrow(service.gridContextPlacementLayer, { x: 7, y: 7 }, 'v');
        expect(strokeSpy).toHaveBeenCalledTimes(2);
        expect(fillSpy).toHaveBeenCalledTimes(2);
    });
});
