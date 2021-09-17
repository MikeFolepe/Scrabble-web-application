import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, BOARD_SIZE } from '@app/classes/constants';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    private caseWidth = DEFAULT_WIDTH / BOARD_SIZE;

    // TODO : pas de valeurs magiques!! Faudrait avoir une meilleure manière de le faire
    /* eslint-disable @typescript-eslint/no-magic-numbers */
    drawGrid() {
        this.gridContext.translate(this.width / 2, this.height / 2);

        for (let i = 0; i < 4; i++) {
            this.drawSymetricGrid(this.gridContext);
            this.gridContext.rotate((Math.PI / 180) * 90);
        }
    }

    drawSymetricGrid(gridContext: CanvasRenderingContext2D) {
        const startPosition: Vec2 = { x: 0, y: 0 };
        for (let i = 0; i < 8; i++) {
            startPosition.x = i * this.caseWidth - this.caseWidth / 2;
            for (let j = 0; j < 8; j++) {
                // Any case = {i, j};
                startPosition.y = j * this.caseWidth - this.caseWidth / 2;
                if (
                    (i == 4 && j == 0) ||
                    (i == 5 && j == 1) ||
                    (i == 1 && j == 1) ||
                    (i == 7 && j == 4) ||
                    (i == 4 && j == 7) ||
                    (i == 1 && j == 5)
                ) {
                    // {x:4, y:0}, {x:5, y:1}, {x:1, y:1}, {x:7, y:4}, {x:4, y:7}, {x:1, y:5}
                    this.doubleLetter(gridContext, startPosition);
                    // gridContext.fillStyle = 'pink';
                    // gridContext.fillRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
                    // gridContext.strokeRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
                } else if ((i == 2 && j == 2) || (i == 6 && j == 2) || (i == 2 && j == 6)) {
                    // [{x:2, y:2}, {x:6, y:2}, {x:2, y:6}];
                    this.tripleLetter(gridContext, startPosition);
                } else if ((i == 3 && j == 3) || (i == 4 && j == 4) || (i == 5 && j == 5) || (i == 6 && j == 6)) {
                    // [{x:3, y:3}, {x:4, y:4}, {x:5, y:5}, {x:6, y:6}];
                    this.doubleWord(gridContext, startPosition);
                } else if ((i == 7 && j == 0) || (i == 7 && j == 7) || (i == 0 && j == 7)) {
                    // [{x:7, y:0}, {x:7, y:7}, {x:0, y:7}];
                    this.tripleWord(gridContext, startPosition);
                } else {
                    gridContext.fillStyle = 'lightGrey';
                    gridContext.fillRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
                    gridContext.strokeRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
                }
            }
        }
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    doubleLetter(ctx: CanvasRenderingContext2D, startPosition: Vec2): void {
        ctx.fillStyle = 'lightBlue';
        ctx.fillRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
        ctx.strokeRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
        ctx.fillStyle = 'black';
        //ctx.textAlign = 'center';
        ctx.fillText('Lx2', startPosition.x + this.caseWidth / 4, startPosition.y + this.caseWidth / 2);
    }

    private tripleLetter = (ctx: CanvasRenderingContext2D, startPosition: Vec2): void => {
        ctx.fillStyle = 'cadetBlue';
        ctx.fillRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
        ctx.strokeRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
        ctx.fillStyle = 'black';
        //ctx.textAlign = 'center';
        ctx.fillText('Lx3', startPosition.x + this.caseWidth / 4, startPosition.y + this.caseWidth / 2);
    };

    private doubleWord = (ctx: CanvasRenderingContext2D, startPosition: Vec2): void => {
        ctx.fillStyle = 'pink';
        ctx.fillRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
        ctx.strokeRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
        ctx.fillStyle = 'black';
        //ctx.textAlign = 'center';
        ctx.fillText('Wx2', startPosition.x + this.caseWidth / 4, startPosition.y + this.caseWidth / 2);
    };

    private tripleWord = (ctx: CanvasRenderingContext2D, startPosition: Vec2): void => {
        ctx.fillStyle = 'red';
        ctx.fillRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
        ctx.strokeRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
        ctx.fillStyle = 'black';
        //ctx.textAlign = 'center';
        ctx.fillText('Wx3', startPosition.x + this.caseWidth / 4, startPosition.y + this.caseWidth / 2);
    };
}
