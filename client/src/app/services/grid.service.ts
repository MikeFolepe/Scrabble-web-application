import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter!
export const DEFAULT_WIDTH = 800;
export const DEFAULT_HEIGHT = 800;
export const BOARD_SIZE = 15;

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    private caseWidth = DEFAULT_WIDTH / BOARD_SIZE;
    // private caseHeight = DEFAULT_HEIGHT / BOARD_SIZE;

    // TODO : pas de valeurs magiques!! Faudrait avoir une meilleure manière de le faire
    /* eslint-disable @typescript-eslint/no-magic-numbers */
    drawGrid() {
        // const startPosition: Vec2 = { x: 0, y: 0 };
        // this.gridContext.beginPath();
        // this.gridContext.strokeStyle = 'black';
        // this.gridContext.lineWidth = 3;
        // this.gridContext.fillText('LETTRE\n x2', startPosition.x, startPosition.y);
        // this.gridContext.stroke();
        this.gridContext.translate(DEFAULT_WIDTH / 2 + this.caseWidth / 2, DEFAULT_HEIGHT / 2 + this.caseWidth / 2);

        for (let i = 0; i < 4; i++) {
            this.drawSymetricGrid(this.gridContext);
            this.gridContext.rotate((Math.PI / 180) * 90);
        }
    }

    drawWord(word: string) {
        const startPosition: Vec2 = { x: 175, y: 100 };
        const step = 20;
        this.gridContext.font = '20px system-ui';
        for (let i = 0; i < word.length; i++) {
            this.gridContext.fillText(word[i], startPosition.x + step * i, startPosition.y);
        }
    }

    drawSymetricGrid(gridContext: CanvasRenderingContext2D) {
        const startPosition: Vec2 = { x: 0, y: 0 };
        for (let i = 0; i < 8; i++) {
            startPosition.y = 0;
            for (let j = 0; j < 8; j++) {
                gridContext.fillStyle = 'pink';
                gridContext.fillRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
                gridContext.strokeRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
                startPosition.y = startPosition.y + this.caseWidth;
            }
            startPosition.x = startPosition.x + this.caseWidth;
        }
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
    // this.gridContext.moveTo(100, 100);
    // this.gridContext.lineTo(100, 200);
    // this.gridContext.lineTo(200, 200);
    // this.gridContext.lineTo(200, 100);
    // this.gridContext.lineTo(100, 100);
}
