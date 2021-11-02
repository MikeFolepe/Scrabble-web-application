import { Injectable } from '@angular/core';
import { CASE_SIZE, DEFAULT_HEIGHT, DEFAULT_WIDTH, RESERVE } from '@app/classes/constants';
import { Vec2 } from '@app/classes/vec2';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContextBoardLayer: CanvasRenderingContext2D;
    gridContextLettersLayer: CanvasRenderingContext2D;
    gridContextPlacementLayer: CanvasRenderingContext2D;

    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    private doubleLetters: Vec2[] = [
        { x: 4, y: 0 },
        { x: 5, y: 1 },
        { x: 1, y: 1 },
        { x: 7, y: 4 },
        { x: 4, y: 7 },
        { x: 1, y: 5 },
        { x: 0, y: 4 },
    ];
    private tripleLetters: Vec2[] = [
        { x: 2, y: 2 },
        { x: 6, y: 2 },
        { x: 2, y: 6 },
    ];
    private doubleWords: Vec2[] = [
        { x: 3, y: 3 },
        { x: 4, y: 4 },
        { x: 5, y: 5 },
        { x: 6, y: 6 },
    ];
    private tripleWords: Vec2[] = [
        { x: 7, y: 0 },
        { x: 7, y: 7 },
        { x: 0, y: 7 },
    ];
    // TODO : pas de valeurs magiques!! Faudrait avoir une meilleure manière de le faire
    /* eslint-disable @typescript-eslint/no-magic-numbers */

    setGridContext(gridContext: CanvasRenderingContext2D) {
        this.gridContextBoardLayer = gridContext;
    }

    // Transpose the positions from 15x15 array to 750x750 grid
    posTabToPosGrid(positionTabX: number, positionTabY: number): Vec2 {
        return {
            x: positionTabX * CASE_SIZE + CASE_SIZE,
            y: positionTabY * CASE_SIZE + CASE_SIZE,
        };
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    drawGrid() {
        this.writeColumnsIndex(this.gridContextBoardLayer, 15);
        this.writeLinesIndex(this.gridContextBoardLayer, 15);
        this.gridContextBoardLayer.translate(DEFAULT_WIDTH / 2 + CASE_SIZE / 2, DEFAULT_HEIGHT / 2 + CASE_SIZE / 2);
        for (let i = 0; i < 4; i++) {
            this.drawSymetricGrid(this.gridContextBoardLayer);
            this.gridContextBoardLayer.rotate((Math.PI / 180) * 90);
        }
        this.drawStar(0, 0, 5, CASE_SIZE / 2 - 10, 6);
        this.writeBonuses();
    }

    writeWord(ctx: CanvasRenderingContext2D, word: string, startPosition: Vec2) {
        ctx.font = '12px system-ui';
        ctx.fillStyle = 'black';
        const lineHeight = 12;
        const lines = word.split(' ');
        for (let i = 0; i < lines.length; i++)
            ctx.fillText(lines[i], startPosition.x + CASE_SIZE / 8 + i * lineHeight, startPosition.y + CASE_SIZE / 2 + i * lineHeight);
    }

    drawBorder(ctx: CanvasRenderingContext2D, positionTabX: number, positionTabY: number) {
        const gridPosition = this.posTabToPosGrid(positionTabX, positionTabY);
        ctx.strokeStyle = 'purple';
        ctx.lineWidth = 5;
        ctx.strokeRect(gridPosition.x, gridPosition.y, CASE_SIZE, CASE_SIZE);
    }

    eraseLayer(ctx: CanvasRenderingContext2D) {
        // Clear all the elements drawn on a layer
        ctx.clearRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
    }

    drawLetter(ctx: CanvasRenderingContext2D, letter: string, positionTabX: number, positionTabY: number, fontSize: number) {
        const gridPosition = this.posTabToPosGrid(positionTabX, positionTabY);
        // Grid case style
        const borderOffSet = 2;
        ctx.fillStyle = 'black';
        ctx.fillRect(gridPosition.x, gridPosition.y, CASE_SIZE, CASE_SIZE);
        ctx.fillStyle = 'tan';
        ctx.fillRect(gridPosition.x + borderOffSet, gridPosition.y + borderOffSet, CASE_SIZE - borderOffSet * 2, CASE_SIZE - borderOffSet * 2);

        // Score of the letter placed
        let letterScore = 0;
        for (const letterReserve of RESERVE) {
            if (letter.toUpperCase() === letterReserve.value) {
                letterScore = letterReserve.points;
            }
        }
        // Placing the respective letter
        ctx.font = fontSize * 1.5 + 'px system-ui';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(letter.toUpperCase(), gridPosition.x + CASE_SIZE / 2, gridPosition.y + CASE_SIZE / 2);
        // Placing the letter's score
        ctx.font = (fontSize / 2) * 1.5 + 'px system-ui';
        ctx.fillText(letterScore.toString(), gridPosition.x + CASE_SIZE / 2 + CASE_SIZE / 3, gridPosition.y + CASE_SIZE / 2 + CASE_SIZE / 3);
    }

    eraseLetter(ctx: CanvasRenderingContext2D, positionTabX: number, positionTabY: number) {
        const gridPosition = this.posTabToPosGrid(positionTabX, positionTabY);
        ctx.clearRect(gridPosition.x, gridPosition.y, CASE_SIZE, CASE_SIZE);
    }

    drawArrow(ctx: CanvasRenderingContext2D, positionTabX: number, positionTabY: number, orientation: string) {
        const gridPosition = this.posTabToPosGrid(positionTabX, positionTabY);
        ctx.beginPath();
        if (orientation === 'h') {
            // Horizontal arrow
            ctx.moveTo(gridPosition.x + CASE_SIZE / 2, gridPosition.y + CASE_SIZE / 4);
            ctx.lineTo(gridPosition.x + CASE_SIZE / 2, gridPosition.y + (3 * CASE_SIZE) / 4);
            ctx.lineTo(gridPosition.x + (5 * CASE_SIZE) / 6, gridPosition.y + CASE_SIZE / 2);
            ctx.lineTo(gridPosition.x + CASE_SIZE / 2, gridPosition.y + CASE_SIZE / 4);
            ctx.lineTo(gridPosition.x + CASE_SIZE / 2, gridPosition.y + (3 * CASE_SIZE) / 4);
        } else {
            // Vertical arrow
            ctx.moveTo(gridPosition.x + CASE_SIZE / 4, gridPosition.y + CASE_SIZE / 2);
            ctx.lineTo(gridPosition.x + (3 * CASE_SIZE) / 4, gridPosition.y + CASE_SIZE / 2);
            ctx.lineTo(gridPosition.x + CASE_SIZE / 2, gridPosition.y + (5 * CASE_SIZE) / 6);
            ctx.lineTo(gridPosition.x + CASE_SIZE / 4, gridPosition.y + CASE_SIZE / 2);
            ctx.lineTo(gridPosition.x + (3 * CASE_SIZE) / 4, gridPosition.y + CASE_SIZE / 2);
        }
        ctx.fillStyle = 'orange';
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fill();
    }

    writeBonuses() {
        const startPosition: Vec2 = { x: 0, y: 0 };
        for (let i = 0; i < 8; i++) {
            startPosition.x = i * CASE_SIZE - CASE_SIZE / 2;
            for (let j = 0; j < 8; j++) {
                startPosition.y = j * CASE_SIZE - CASE_SIZE / 2;
                if (this.doubleLetters.some((element) => element.x === i && element.y === j)) {
                    this.writeWord(this.gridContextBoardLayer, 'Lettre x2', startPosition);
                    this.writeWord(this.gridContextBoardLayer, 'Lettre x2', { x: startPosition.x - 2 * i * CASE_SIZE, y: startPosition.y });
                    this.writeWord(this.gridContextBoardLayer, 'Lettre x2', { x: startPosition.x, y: startPosition.y - 2 * j * CASE_SIZE });
                    this.writeWord(this.gridContextBoardLayer, 'Lettre x2', {
                        x: startPosition.x - 2 * i * CASE_SIZE,
                        y: startPosition.y - 2 * j * CASE_SIZE,
                    });
                } else if (this.tripleLetters.some((element) => element.x === i && element.y === j)) {
                    this.writeWord(this.gridContextBoardLayer, 'Lettre x3', startPosition);
                    this.writeWord(this.gridContextBoardLayer, 'Lettre x3', { x: startPosition.x - 2 * i * CASE_SIZE, y: startPosition.y });
                    this.writeWord(this.gridContextBoardLayer, 'Lettre x3', { x: startPosition.x, y: startPosition.y - 2 * j * CASE_SIZE });
                    this.writeWord(this.gridContextBoardLayer, 'Lettre x3', {
                        x: startPosition.x - 2 * i * CASE_SIZE,
                        y: startPosition.y - 2 * j * CASE_SIZE,
                    });
                } else if (this.doubleWords.some((element) => element.x === i && element.y === j)) {
                    this.writeWord(this.gridContextBoardLayer, 'Mot x2', startPosition);
                    this.writeWord(this.gridContextBoardLayer, 'Mot x2', { x: startPosition.x - 2 * i * CASE_SIZE, y: startPosition.y });
                    this.writeWord(this.gridContextBoardLayer, 'Mot x2', { x: startPosition.x, y: startPosition.y - 2 * j * CASE_SIZE });
                    this.writeWord(this.gridContextBoardLayer, 'Mot x2', {
                        x: startPosition.x - 2 * i * CASE_SIZE,
                        y: startPosition.y - 2 * j * CASE_SIZE,
                    });
                } else if (this.tripleWords.some((element) => element.x === i && element.y === j)) {
                    this.writeWord(this.gridContextBoardLayer, 'Mot x3', startPosition);
                    this.writeWord(this.gridContextBoardLayer, 'Mot x3', { x: startPosition.x - 2 * i * CASE_SIZE, y: startPosition.y });
                    this.writeWord(this.gridContextBoardLayer, 'Mot x3', { x: startPosition.x, y: startPosition.y - 2 * j * CASE_SIZE });
                    this.writeWord(this.gridContextBoardLayer, 'Mot x3', {
                        x: startPosition.x - 2 * i * CASE_SIZE,
                        y: startPosition.y - 2 * j * CASE_SIZE,
                    });
                }
            }
        }
    }

    drawSymetricGrid(gridContext: CanvasRenderingContext2D) {
        const startPosition: Vec2 = { x: 0, y: 0 };
        for (let i = 0; i < 8; i++) {
            startPosition.x = i * CASE_SIZE - CASE_SIZE / 2;
            for (let j = 0; j < 8; j++) {
                startPosition.y = j * CASE_SIZE - CASE_SIZE / 2;
                if (this.doubleLetters.some((element) => element.x === i && element.y === j)) {
                    this.doubleLetter(gridContext, startPosition);
                } else if (this.tripleLetters.some((element) => element.x === i && element.y === j)) {
                    this.tripleLetter(gridContext, startPosition);
                } else if (this.doubleWords.some((element) => element.x === i && element.y === j)) {
                    this.doubleWord(gridContext, startPosition);
                } else if (this.tripleWords.some((element) => element.x === i && element.y === j)) {
                    this.tripleWord(gridContext, startPosition);
                } else {
                    gridContext.fillStyle = 'lightGrey';
                    gridContext.fillRect(startPosition.x, startPosition.y, CASE_SIZE, CASE_SIZE);
                    gridContext.strokeRect(startPosition.x, startPosition.y, CASE_SIZE, CASE_SIZE);
                }
            }
        }
        gridContext.fillStyle = 'pink';
        gridContext.fillRect(-CASE_SIZE / 2, -CASE_SIZE / 2, CASE_SIZE, CASE_SIZE);
        gridContext.strokeRect(-CASE_SIZE / 2, -CASE_SIZE / 2, CASE_SIZE, CASE_SIZE);
    }

    drawStar(cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        this.gridContextBoardLayer.beginPath();
        this.gridContextBoardLayer.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.gridContextBoardLayer.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.gridContextBoardLayer.lineTo(x, y);
            rot += step;
        }
        this.gridContextBoardLayer.lineTo(cx, cy - outerRadius);
        this.gridContextBoardLayer.closePath();
        this.gridContextBoardLayer.lineWidth = 5;
        this.gridContextBoardLayer.strokeStyle = 'darkSlateGrey';
        this.gridContextBoardLayer.stroke();
        this.gridContextBoardLayer.fillStyle = 'darkSlateGrey';
        this.gridContextBoardLayer.fill();
    }

    writeColumnsIndex(ctx: CanvasRenderingContext2D, columnsNumber: number) {
        for (let i = 0; i < columnsNumber; i++) {
            const index = i + 1;
            ctx.font = '18px system-ui';
            ctx.fillStyle = 'black';
            ctx.fillText(index.toString(), (5 * CASE_SIZE) / 4 + i * CASE_SIZE, (3 * CASE_SIZE) / 4);
        }
    }

    writeLinesIndex(ctx: CanvasRenderingContext2D, linesNumber: number) {
        for (let i = 0; i < linesNumber; i++) {
            let index = 'A'.charCodeAt(0);
            index = index + i;
            ctx.font = '18px system-ui';
            ctx.fillStyle = 'black';
            ctx.fillText(String.fromCharCode(index), CASE_SIZE / 2, (7 * CASE_SIZE) / 4 + i * CASE_SIZE);
        }
    }

    doubleLetter(ctx: CanvasRenderingContext2D, startPosition: Vec2): void {
        ctx.fillStyle = 'lightBlue';
        ctx.fillRect(startPosition.x, startPosition.y, CASE_SIZE, CASE_SIZE);
        ctx.strokeRect(startPosition.x, startPosition.y, CASE_SIZE, CASE_SIZE);
    }

    private tripleLetter = (ctx: CanvasRenderingContext2D, startPosition: Vec2): void => {
        ctx.fillStyle = 'cadetBlue';
        // eslint-disable-next-line no-invalid-this
        ctx.fillRect(startPosition.x, startPosition.y, CASE_SIZE, CASE_SIZE);
        // eslint-disable-next-line no-invalid-this
        ctx.strokeRect(startPosition.x, startPosition.y, CASE_SIZE, CASE_SIZE);
    };

    private doubleWord = (ctx: CanvasRenderingContext2D, startPosition: Vec2): void => {
        ctx.fillStyle = 'pink';
        // eslint-disable-next-line no-invalid-this
        ctx.fillRect(startPosition.x, startPosition.y, CASE_SIZE, CASE_SIZE);
        // eslint-disable-next-line no-invalid-this
        ctx.strokeRect(startPosition.x, startPosition.y, CASE_SIZE, CASE_SIZE);
    };

    private tripleWord = (ctx: CanvasRenderingContext2D, startPosition: Vec2): void => {
        ctx.fillStyle = 'red';
        // eslint-disable-next-line no-invalid-this
        ctx.fillRect(startPosition.x, startPosition.y, CASE_SIZE, CASE_SIZE);
        // eslint-disable-next-line no-invalid-this
        ctx.strokeRect(startPosition.x, startPosition.y, CASE_SIZE, CASE_SIZE);
    };
}
