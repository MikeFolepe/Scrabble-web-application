/* eslint-disable no-invalid-this */
import { Injectable } from '@angular/core';
import { BOARD_SIZE, DEFAULT_HEIGHT, DEFAULT_WIDTH, RESERVE } from '@app/classes/constants';
import { Vec2 } from '@app/classes/vec2';
import { RandomBonusesService } from './random-bonuses.service';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    gridContextLayer: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    private caseWidth = DEFAULT_WIDTH / BOARD_SIZE;
    bonusesPositions: Map<string, string>;
    constructor(private randomBonusesService: RandomBonusesService){
        randomBonusesService.shuffleBonusesPositions();
        this.bonusesPositions = new Map<string, string>(this.randomBonusesService.bonusesPositions);
    }
    
    // ngAfterViewInit(){
    //     this.bonusesPositions = new Map<string, string>(this.randomBonusesService.bonusesPositions);
    // }
    /* eslint-disable @typescript-eslint/no-magic-numbers */

    setGridContext(gridContext: CanvasRenderingContext2D) {
        this.gridContext = gridContext;
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }


    drawGrid() {
        this.writeGridIndexes(this.gridContext, 15);
        this.drawSimpleGrid(this.gridContext);
        this.drawBonusesBoxes();
        this.drawCenterBoxe();
    }

    writeBonusName(ctx: CanvasRenderingContext2D, text: string, startPosition: Vec2) {
        ctx.font = '12px system-ui';
        ctx.fillStyle = 'black';
        ctx.textBaseline = 'middle'; 
        ctx.textAlign = 'center'; 
        const lines = text.split(' ');
        text = lines[0] + '\n' + lines[1];
        ctx.fillText(text, startPosition.x + this.caseWidth/2, startPosition.y +  this.caseWidth/2);
    }

    //draw the game grid without any bonus on it
    drawSimpleGrid(gridContext: CanvasRenderingContext2D) {
        const startPosition: Vec2 = { x: 0, y: 0 };
        for (let i = 1; i < 16; i++) {
            startPosition.x = i* this.caseWidth;
            for (let j = 1; j < 16; j++) {
                startPosition.y = j * this.caseWidth;
                    gridContext.fillStyle = 'lightGrey';
                    gridContext.fillRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
                    gridContext.strokeRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
            }
        }
    }

    //*************should i create this function?
    // convertPosition(position: string): Vec2{
    //     return {x: position[0].charCodeAt(0) - 'a'.charCodeAt(0), y: Number(position[1])-1};
    // }

    //specify bonuses boxes on the grid by adding colors and bonuses names
    drawBonusesBoxes() {
        this.bonusesPositions.forEach((bonus: string, position: string) => {
            const positionSplitted = position.split(/([0-9]+)/)
            let convertedPositon = {x: (positionSplitted[0].charCodeAt(0) - 'A'.charCodeAt(0)+1)*this.caseWidth, y: Number(positionSplitted[1])*this.caseWidth};
            switch(bonus){
                case 'doubleletter': {
                    this.colorBonusBox(this.gridContext, 'lightBlue', convertedPositon);
                    this.writeBonusName(this.gridContext, 'Lettre x2', convertedPositon);
                    break;
                }
                case 'tripleletter': {
                    this.colorBonusBox(this.gridContext, 'cadetBlue', convertedPositon);
                    this.writeBonusName(this.gridContext, 'Lettre x3', convertedPositon);
                    break;
                }
                case 'doubleword': {
                    this.colorBonusBox(this.gridContext, 'pink', convertedPositon);
                    this.writeBonusName(this.gridContext, 'Mot x2', convertedPositon);
                    break;
                }
                case 'tripleword': {
                    this.colorBonusBox(this.gridContext, 'red', convertedPositon);
                    this.writeBonusName(this.gridContext, 'Mot x3', convertedPositon);
                    break;
                }
                default: {
                
                }
            }
        });
    }

    //color the center box of the grid then draw a star on it
    drawCenterBoxe(){
        const centerPosition: Vec2 = {x: 8*this.caseWidth, y: 8*this.caseWidth};
        //coloring the box
        this.gridContext.fillStyle = 'pink';
        this.gridContext.fillRect(centerPosition.x, centerPosition.y, this.caseWidth, this.caseWidth);
        this.gridContext.strokeRect(centerPosition.x, centerPosition.y, this.caseWidth, this.caseWidth);
        //drawing star
        this.drawStar(centerPosition.x + this.caseWidth/2, centerPosition.y + this.caseWidth/2, 5, this.caseWidth / 2.5, 8);
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

    writeGridIndexes(ctx: CanvasRenderingContext2D, columnsNumber: number) {
        ctx.font = '18px system-ui';
        ctx.fillStyle = 'black';
        //we have same number of columns and rows
        for (let i = 0; i < columnsNumber; i++) {
            let indexForColumns = i + 1;
            let indexForLines = 'A'.charCodeAt(0);
            indexForLines = indexForLines + i;
            ctx.fillText(indexForColumns.toString(), (5 * this.caseWidth) / 4 + i * this.caseWidth, (3 * this.caseWidth) / 4);
            ctx.fillText(String.fromCharCode(indexForLines), this.caseWidth / 2, (7 * this.caseWidth) / 4 + i * this.caseWidth);
        }
    }

    colorBonusBox(ctx: CanvasRenderingContext2D, color: string, startPosition: Vec2): void {
        ctx.fillStyle = color;
        ctx.fillRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
        ctx.strokeRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
    }

    //functions used by placeLetterService to place a word
    drawLetter(ctx: CanvasRenderingContext2D, letter: string, position: Vec2, fontSize: number) {
        // Grid case style
        ctx.fillStyle = 'tan';
        ctx.fillRect(position.x + DEFAULT_HEIGHT / 2, position.y + DEFAULT_HEIGHT / 2, this.caseWidth, this.caseWidth);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(position.x + DEFAULT_HEIGHT / 2, position.y + DEFAULT_HEIGHT / 2, this.caseWidth, this.caseWidth);

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
        ctx.fillText(
            letter.toUpperCase(),
            position.x + DEFAULT_HEIGHT / 2 + this.caseWidth / 2,
            position.y + DEFAULT_HEIGHT / 2 + this.caseWidth / 2,
        );
        // Placing the letter's score
        ctx.font = (fontSize / 2) * 1.5 + 'px system-ui';
        ctx.fillText(
            letterScore.toString(),
            position.x + DEFAULT_HEIGHT / 2 + this.caseWidth / 2 + this.caseWidth / 3,
            position.y + DEFAULT_HEIGHT / 2 + this.caseWidth / 2 + this.caseWidth / 3,
        );
    }

    eraseLetter(ctx: CanvasRenderingContext2D, position: Vec2) {
        ctx.clearRect(position.x + DEFAULT_HEIGHT / 2, position.y + DEFAULT_HEIGHT / 2, this.caseWidth, this.caseWidth);
    }
}
