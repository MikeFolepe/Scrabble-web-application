/* eslint-disable @typescript-eslint/no-magic-numbers */
import { BOARD_ROWS, CASE_SIZE, DEFAULT_HEIGHT, DEFAULT_WIDTH, RESERVE } from '@app/classes/constants';
import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { Orientation } from '@app/classes/scrabble-board-pattern';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContextBoardLayer: CanvasRenderingContext2D;
    gridContextLettersLayer: CanvasRenderingContext2D;
    gridContextPlacementLayer: CanvasRenderingContext2D;
    bonusPositions: Map<string, string>;
    private canvasSize: Vec2;
    private caseSize: number;
    private readonly gridLength = BOARD_ROWS;
    constructor() {
        this.canvasSize = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
        this.caseSize = CASE_SIZE;
        this.bonusPositions = new Map<string, string>();
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    setGridContext(gridContext: CanvasRenderingContext2D) {
        this.gridContextBoardLayer = gridContext;
    }

    // Transpose the positions from 15x15 array to 750x750 grid
    positionTabToPositionGrid(positionTabX: number, positionTabY: number): Vec2 {
        return {
            x: positionTabX * CASE_SIZE + CASE_SIZE,
            y: positionTabY * CASE_SIZE + CASE_SIZE,
        };
    }

    drawGrid() {
        this.writeGridIndexes(this.gridContextBoardLayer, this.gridLength);
        this.drawSimpleGrid(this.gridContextBoardLayer);
        this.drawBonusBoxes(this.bonusPositions);
        this.drawCenterBoxe();
    }

    // draw the game grid without any bonus on it
    drawSimpleGrid(context: CanvasRenderingContext2D) {
        const startPosition: Vec2 = { x: 0, y: 0 };
        for (let i = 1; i <= this.gridLength; i++) {
            startPosition.x = i * this.caseSize;
            for (let j = 1; j <= this.gridLength; j++) {
                startPosition.y = j * this.caseSize;
                context.fillStyle = 'lightGrey';
                context.fillRect(startPosition.x, startPosition.y, this.caseSize, this.caseSize);
                context.strokeRect(startPosition.x, startPosition.y, this.caseSize, this.caseSize);
            }
        }
    }

    writeGridIndexes(context: CanvasRenderingContext2D, columnsNumber: number) {
        context.font = '18px system-ui';
        context.fillStyle = 'black';
        // we have same number of columns and rows
        for (let i = 0; i < columnsNumber; i++) {
            const indexForColumns = i + 1;
            let indexForLines = 'A'.charCodeAt(0);
            indexForLines = indexForLines + i;
            context.fillText(indexForColumns.toString(), (5 * this.caseSize) / 4 + i * this.caseSize, (3 * this.caseSize) / 4);
            context.fillText(String.fromCharCode(indexForLines), this.caseSize / 2, (7 * this.caseSize) / 4 + i * this.caseSize);
        }
    }

    colorBonusBox(context: CanvasRenderingContext2D, color: string, startPosition: Vec2): void {
        context.fillStyle = color;
        context.fillRect(startPosition.x, startPosition.y, this.caseSize, this.caseSize);
        context.strokeRect(startPosition.x, startPosition.y, this.caseSize, this.caseSize);
    }

    writeBonusName(context: CanvasRenderingContext2D, text: string, startPosition: Vec2) {
        context.font = '12px system-ui';
        context.fillStyle = 'black';
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        const lines = text.split(' ');
        text = lines[0] + '\n' + lines[1];
        context.fillText(text, startPosition.x + this.caseSize / 2, startPosition.y + this.caseSize / 2);
    }

    // specify bonuses boxes on the grid by adding colors and bonuses names
    drawBonusBoxes(bonusPositions: Map<string, string>) {
        bonusPositions.forEach((bonus: string, position: string) => {
            const positionSplitted = position.split(/([0-9]+)/);
            const convertedPositon = {
                x: (positionSplitted[0].charCodeAt(0) - 'A'.charCodeAt(0) + 1) * this.caseSize,
                y: Number(positionSplitted[1]) * this.caseSize,
            };
            switch (bonus) {
                case 'doubleletter': {
                    this.colorBonusBox(this.gridContextBoardLayer, 'lightBlue', convertedPositon);
                    this.writeBonusName(this.gridContextBoardLayer, 'Lettre x2', convertedPositon);
                    break;
                }
                case 'tripleletter': {
                    this.colorBonusBox(this.gridContextBoardLayer, 'cadetBlue', convertedPositon);
                    this.writeBonusName(this.gridContextBoardLayer, 'Lettre x3', convertedPositon);
                    break;
                }
                case 'doubleword': {
                    this.colorBonusBox(this.gridContextBoardLayer, 'pink', convertedPositon);
                    this.writeBonusName(this.gridContextBoardLayer, 'Mot x2', convertedPositon);
                    break;
                }
                case 'tripleword': {
                    this.colorBonusBox(this.gridContextBoardLayer, 'red', convertedPositon);
                    this.writeBonusName(this.gridContextBoardLayer, 'Mot x3', convertedPositon);
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }

    // color the center box of the grid then draw a star on it
    drawCenterBoxe() {
        const centerPosition: Vec2 = { x: 8 * this.caseSize, y: 8 * this.caseSize };
        // coloring the box
        this.gridContextBoardLayer.fillStyle = 'pink';
        this.gridContextBoardLayer.fillRect(centerPosition.x, centerPosition.y, this.caseSize, this.caseSize);
        this.gridContextBoardLayer.strokeRect(centerPosition.x, centerPosition.y, this.caseSize, this.caseSize);
        // drawing star
        this.drawStar(centerPosition.x + this.caseSize / 2, centerPosition.y + this.caseSize / 2, 5, this.caseSize / 2.5, 8);
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

    drawBorder(context: CanvasRenderingContext2D, positionTab: Vec2) {
        const gridPosition = this.positionTabToPositionGrid(positionTab.x, positionTab.y);
        context.strokeStyle = 'purple';
        context.lineWidth = 5;
        context.strokeRect(gridPosition.x, gridPosition.y, CASE_SIZE, CASE_SIZE);
    }

    eraseLayer(context: CanvasRenderingContext2D) {
        // Clear all the elements drawn on a layer
        context.clearRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
    }

    drawLetter(context: CanvasRenderingContext2D, letter: string, positionTab: Vec2, fontSize: number) {
        const gridPosition = this.positionTabToPositionGrid(positionTab.x, positionTab.y);
        // Grid case style
        const borderOffSet = 2;
        context.fillStyle = 'black';
        context.fillRect(gridPosition.x, gridPosition.y, CASE_SIZE, CASE_SIZE);
        context.fillStyle = 'tan';
        context.fillRect(gridPosition.x + borderOffSet, gridPosition.y + borderOffSet, CASE_SIZE - borderOffSet * 2, CASE_SIZE - borderOffSet * 2);

        // Score of the letter placed
        let letterScore = 0;
        for (const letterReserve of RESERVE) {
            if (letter.toUpperCase() === letterReserve.value) {
                letterScore = letterReserve.points;
            }
        }
        // Placing the respective letter
        context.font = fontSize * 1.5 + 'px system-ui';
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(letter.toUpperCase(), gridPosition.x + CASE_SIZE / 2, gridPosition.y + CASE_SIZE / 2);
        // Placing the letter's score
        context.font = (fontSize / 2) * 1.5 + 'px system-ui';
        context.fillText(letterScore.toString(), gridPosition.x + CASE_SIZE / 2 + CASE_SIZE / 3, gridPosition.y + CASE_SIZE / 2 + CASE_SIZE / 3);
    }

    eraseLetter(context: CanvasRenderingContext2D, positionTab: Vec2) {
        const gridPosition = this.positionTabToPositionGrid(positionTab.x, positionTab.y);
        context.clearRect(gridPosition.x, gridPosition.y, CASE_SIZE, CASE_SIZE);
    }

    drawArrow(context: CanvasRenderingContext2D, positionTab: Vec2, orientation: Orientation) {
        const gridPosition = this.positionTabToPositionGrid(positionTab.x, positionTab.y);
        context.beginPath();
        if (orientation === Orientation.Horizontal) {
            context.moveTo(gridPosition.x + CASE_SIZE / 2, gridPosition.y + CASE_SIZE / 4);
            context.lineTo(gridPosition.x + CASE_SIZE / 2, gridPosition.y + (3 * CASE_SIZE) / 4);
            context.lineTo(gridPosition.x + (5 * CASE_SIZE) / 6, gridPosition.y + CASE_SIZE / 2);
            context.lineTo(gridPosition.x + CASE_SIZE / 2, gridPosition.y + CASE_SIZE / 4);
            context.lineTo(gridPosition.x + CASE_SIZE / 2, gridPosition.y + (3 * CASE_SIZE) / 4);
        } else {
            context.moveTo(gridPosition.x + CASE_SIZE / 4, gridPosition.y + CASE_SIZE / 2);
            context.lineTo(gridPosition.x + (3 * CASE_SIZE) / 4, gridPosition.y + CASE_SIZE / 2);
            context.lineTo(gridPosition.x + CASE_SIZE / 2, gridPosition.y + (5 * CASE_SIZE) / 6);
            context.lineTo(gridPosition.x + CASE_SIZE / 4, gridPosition.y + CASE_SIZE / 2);
            context.lineTo(gridPosition.x + (3 * CASE_SIZE) / 4, gridPosition.y + CASE_SIZE / 2);
        }
        context.fillStyle = 'orange';
        context.lineWidth = 4;
        context.strokeStyle = 'black';
        context.stroke();
        context.fill();
    }
}
