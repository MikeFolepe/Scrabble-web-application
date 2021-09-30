/* eslint-disable no-invalid-this */
import { Injectable } from '@angular/core';
import { BOARD_SIZE, DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/classes/constants';
import { Vec2 } from '@app/classes/vec2';

// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter!

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    private caseWidth = DEFAULT_WIDTH / BOARD_SIZE;
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

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    drawGrid() {
        this.writeColumnsIndex(this.gridContext, 15);
        this.writeLinesIndex(this.gridContext, 15);
        this.gridContext.translate(DEFAULT_WIDTH / 2 + this.caseWidth / 2, DEFAULT_HEIGHT / 2 + this.caseWidth / 2);
        for (let i = 0; i < 4; i++) {
            this.drawSymetricGrid(this.gridContext);
            this.gridContext.rotate((Math.PI / 180) * 90);
        }
        this.drawStar(0, 0, 5, this.caseWidth / 2 - 9, 6);
        this.writeBonuses();
    }

    writeWord(ctx: CanvasRenderingContext2D, word: string, startPosition: Vec2) {
        ctx.font = '12px system-ui';
        ctx.fillStyle = 'black';
        const lineheight = 12;
        const lines = word.split(' ');
        for (let i = 0; i < lines.length; i++)
            ctx.fillText(lines[i], startPosition.x + this.caseWidth / 8 + i * lineheight, startPosition.y + this.caseWidth / 2 + i * lineheight);
    }

    drawLetter(ctx: CanvasRenderingContext2D, letter: string, position: Vec2, fontSize: number) {
        ctx.fillStyle = 'tan';
        ctx.fillRect(position.x - this.caseWidth / 2, position.y - this.caseWidth / 2, this.caseWidth, this.caseWidth);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(position.x - this.caseWidth / 2, position.y - this.caseWidth / 2, this.caseWidth, this.caseWidth);

        ctx.font = fontSize + 'px system-ui';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(letter.toUpperCase(), position.x, position.y);
    }

    eraseLetter(ctx: CanvasRenderingContext2D, position: Vec2) {
        ctx.clearRect(position.x - this.caseWidth / 2, position.y - this.caseWidth / 2, this.caseWidth, this.caseWidth);
    }

    writeBonuses() {
        const startPosition: Vec2 = { x: 0, y: 0 };
        for (let i = 0; i < 8; i++) {
            startPosition.x = i * this.caseWidth - this.caseWidth / 2;
            for (let j = 0; j < 8; j++) {
                startPosition.y = j * this.caseWidth - this.caseWidth / 2;
                if (this.doubleLetters.some((element) => element.x === i && element.y === j)) {
                    this.writeWord(this.gridContext, 'Lettre x2', startPosition);
                    this.writeWord(this.gridContext, 'Lettre x2', { x: startPosition.x - 2 * i * this.caseWidth, y: startPosition.y });
                    this.writeWord(this.gridContext, 'Lettre x2', { x: startPosition.x, y: startPosition.y - 2 * j * this.caseWidth });
                    this.writeWord(this.gridContext, 'Lettre x2', {
                        x: startPosition.x - 2 * i * this.caseWidth,
                        y: startPosition.y - 2 * j * this.caseWidth,
                    });
                } else if (this.tripleLetters.some((element) => element.x === i && element.y === j)) {
                    this.writeWord(this.gridContext, 'Lettre x3', startPosition);
                    this.writeWord(this.gridContext, 'Lettre x3', { x: startPosition.x - 2 * i * this.caseWidth, y: startPosition.y });
                    this.writeWord(this.gridContext, 'Lettre x3', { x: startPosition.x, y: startPosition.y - 2 * j * this.caseWidth });
                    this.writeWord(this.gridContext, 'Lettre x3', {
                        x: startPosition.x - 2 * i * this.caseWidth,
                        y: startPosition.y - 2 * j * this.caseWidth,
                    });
                } else if (this.doubleWords.some((element) => element.x === i && element.y === j)) {
                    this.writeWord(this.gridContext, 'Mot x2', startPosition);
                    this.writeWord(this.gridContext, 'Mot x2', { x: startPosition.x - 2 * i * this.caseWidth, y: startPosition.y });
                    this.writeWord(this.gridContext, 'Mot x2', { x: startPosition.x, y: startPosition.y - 2 * j * this.caseWidth });
                    this.writeWord(this.gridContext, 'Mot x2', {
                        x: startPosition.x - 2 * i * this.caseWidth,
                        y: startPosition.y - 2 * j * this.caseWidth,
                    });
                } else if (this.tripleWords.some((element) => element.x === i && element.y === j)) {
                    this.writeWord(this.gridContext, 'Mot x3', startPosition);
                    this.writeWord(this.gridContext, 'Mot x3', { x: startPosition.x - 2 * i * this.caseWidth, y: startPosition.y });
                    this.writeWord(this.gridContext, 'Mot x3', { x: startPosition.x, y: startPosition.y - 2 * j * this.caseWidth });
                    this.writeWord(this.gridContext, 'Mot x3', {
                        x: startPosition.x - 2 * i * this.caseWidth,
                        y: startPosition.y - 2 * j * this.caseWidth,
                    });
                }
            }
        }
    }

    drawSymetricGrid(gridContext: CanvasRenderingContext2D) {
        const startPosition: Vec2 = { x: 0, y: 0 };
        for (let i = 0; i < 8; i++) {
            startPosition.x = i * this.caseWidth - this.caseWidth / 2;
            for (let j = 0; j < 8; j++) {
                startPosition.y = j * this.caseWidth - this.caseWidth / 2;
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
                    gridContext.fillRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
                    gridContext.strokeRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
                }
            }
        }
        gridContext.fillStyle = 'pink';
        gridContext.fillRect(-this.caseWidth / 2, -this.caseWidth / 2, this.caseWidth, this.caseWidth);
        gridContext.strokeRect(-this.caseWidth / 2, -this.caseWidth / 2, this.caseWidth, this.caseWidth);
    }

    drawStar(cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        this.gridContext.beginPath();
        this.gridContext.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.gridContext.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.gridContext.lineTo(x, y);
            rot += step;
        }
        this.gridContext.lineTo(cx, cy - outerRadius);
        this.gridContext.closePath();
        this.gridContext.lineWidth = 5;
        this.gridContext.strokeStyle = 'darkSlateGrey';
        this.gridContext.stroke();
        this.gridContext.fillStyle = 'darkSlateGrey';
        this.gridContext.fill();
    }

    writeColumnsIndex(ctx: CanvasRenderingContext2D, columnsNumber: number) {
        for (let i = 0; i < columnsNumber; i++) {
            const index = i + 1;
            ctx.font = '18px system-ui';
            ctx.fillStyle = 'black';
            ctx.fillText(index.toString(), (5 * this.caseWidth) / 4 + i * this.caseWidth, (3 * this.caseWidth) / 4);
        }
    }

    writeLinesIndex(ctx: CanvasRenderingContext2D, linesNumber: number) {
        for (let i = 0; i < linesNumber; i++) {
            let index = 'A'.charCodeAt(0);
            index = index + i;
            ctx.font = '18px system-ui';
            ctx.fillStyle = 'black';
            ctx.fillText(String.fromCharCode(index), this.caseWidth / 2, (7 * this.caseWidth) / 4 + i * this.caseWidth);
        }
    }

    doubleLetter(ctx: CanvasRenderingContext2D, startPosition: Vec2): void {
        ctx.fillStyle = 'lightBlue';
        ctx.fillRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
        ctx.strokeRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);

    }

    private tripleLetter = (ctx: CanvasRenderingContext2D, startPosition: Vec2): void => {
        ctx.fillStyle = 'cadetBlue';
        ctx.fillRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
        ctx.strokeRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);

    };

    private doubleWord = (ctx: CanvasRenderingContext2D, startPosition: Vec2): void => {
        ctx.fillStyle = 'pink';
        ctx.fillRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
        ctx.strokeRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);

    };

    private tripleWord = (ctx: CanvasRenderingContext2D, startPosition: Vec2): void => {
        ctx.fillStyle = 'red';
        ctx.fillRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
        ctx.strokeRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);

    };
}
