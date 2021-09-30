import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { GridService } from '@app/services/grid.service';
import { MouseHandlerService } from '@app/services/mouse-handler.service';

@Component({
    selector: 'app-scrabble-board',
    templateUrl: './scrabble-board.component.html',
    styleUrls: ['./scrabble-board.component.scss'],
})
export class ScrabbleBoardComponent implements AfterViewInit {

    @ViewChild('gridCanvas', { static: false }) gridCanvas!: ElementRef<HTMLCanvasElement>;

    buttonPressed = '';
   
 constructor(private readonly gridService: GridService, private mouseService: MouseHandlerService) {}
    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridService.drawGrid();
        this.gridCanvas.nativeElement.focus();
    }

    get width(): number {
        return this.gridService.width;
    }

    get height(): number {
        return this.gridService.height;
    }

    mouseHitDetect(event: MouseEvent){
        this.mouseService.mouseHitDetect(event);
    }
}
