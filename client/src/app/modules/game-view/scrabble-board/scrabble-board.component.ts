import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from '@app/services/grid.service';
import { MouseHandlerService } from '@app/services/mouse-handler.service';

@Component({
    selector: 'app-scrabble-board',
    templateUrl: './scrabble-board.component.html',
    styleUrls: ['./scrabble-board.component.scss'],
})
export class ScrabbleBoardComponent implements /* OnInit,*/ AfterViewInit, OnDestroy {
    @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('gridCanvasLayer', { static: false }) private gridCanvasLayer!: ElementRef<HTMLCanvasElement>;

    mousePosition: Vec2 = { x: 0, y: 0 };
    buttonPressed = '';
    constructor(private readonly gridService: GridService, private mouseService: MouseHandlerService) {}

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    ngAfterViewInit(): void {
        this.gridService.gridContextLayer = this.gridCanvasLayer.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridService.drawGrid();
        this.gridCanvas.nativeElement.focus();
        this.gridService.setGridContext(this.gridService.gridContext);
    }

    get width(): number {
        return this.gridService.width;
    }

    get height(): number {
        return this.gridService.height;
    }

    mouseHitDetect(event: MouseEvent) {
        this.mouseService.mouseHitDetect(event);
    }
    ngOnDestroy(): void {
        this.gridCanvasLayer.nativeElement.remove();
    }
}
