import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter!
export const DEFAULT_WIDTH = 600;
export const DEFAULT_HEIGHT = 600;
export const BOARD_SIZE = 15;

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    private caseWidth = DEFAULT_WIDTH / BOARD_SIZE;
    private doubleLetters: Array<Vec2> = [{x:4, y:0}, {x:5, y:1}, {x:1, y:1}, {x:7, y:4}, {x:4, y:7}, {x:1, y:5}, {x:0, y:4}];
    private tripleLetters: Array<Vec2> = [{x:2, y:2}, {x:6, y:2}, {x:2, y:6}];
    private doubleWords: Array<Vec2> = [{x:3, y:3}, {x:4, y:4}, {x:5, y:5}, {x:6, y:6}];
    private tripleWords: Array<Vec2> = [{x:7, y:0}, {x:7, y:7}, {x:0, y:7}];
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
        this.gridContext.translate(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT / 2);

        for (let i = 0; i < 4; i++) {
            this.drawSymetricGrid(this.gridContext);
            this.gridContext.rotate((Math.PI / 180) * 90);
        }
        //this.gridContext.translate(-DEFAULT_WIDTH / 2, -DEFAULT_HEIGHT / 2);
        //this.gridContext.setTransform(1,0,0,1,0,0);
        this.drawBonuses();
    }

    drawWord(ctx:CanvasRenderingContext2D, word: string, startPosition:Vec2) {
        ctx.font = '10px system-ui';
        ctx.fillStyle = 'black';
        ctx.fillText(word, startPosition.x + this.caseWidth/4, startPosition.y + this.caseWidth/2);
    }

    drawBonuses(){
        let startPosition: Vec2 = { x: 0, y: 0 };
        for(let i = 0; i < 8; i++) {
            startPosition.x = i * this.caseWidth - this.caseWidth/2;
            for (let j = 0; j < 8; j++) {
                startPosition.y = j * this.caseWidth - this.caseWidth/2;
                if(this.doubleLetters.some((element) => element.x == i && element.y ==j)){
                    this.drawWord(this.gridContext, 'Lx2', startPosition);
                    this.drawWord(this.gridContext, 'Lx2', {x: startPosition.x - 2*i*this.caseWidth, y: startPosition.y});
                    this.drawWord(this.gridContext, 'Lx2', {x: startPosition.x, y:startPosition.y - 2*j*this.caseWidth});
                    this.drawWord(this.gridContext, 'Lx2', {x: startPosition.x - 2*i*this.caseWidth, y:startPosition.y - 2*j*this.caseWidth});
                } else
                if(this.tripleLetters.some((element) => element.x == i && element.y ==j)){
                    this.drawWord(this.gridContext, 'Lx3', startPosition);
                    this.drawWord(this.gridContext, 'Lx3', {x: startPosition.x - 2*i*this.caseWidth, y: startPosition.y});
                    this.drawWord(this.gridContext, 'Lx3', {x: startPosition.x, y:startPosition.y - 2*j*this.caseWidth});
                    this.drawWord(this.gridContext, 'Lx3', {x: startPosition.x - 2*i*this.caseWidth, y:startPosition.y - 2*j*this.caseWidth});
                } else
                if(this.doubleWords.some((element) => element.x == i && element.y ==j)){
                    this.drawWord(this.gridContext, 'Wx2', startPosition);
                    this.drawWord(this.gridContext, 'Wx2', {x: startPosition.x - 2*i*this.caseWidth, y: startPosition.y});
                    this.drawWord(this.gridContext, 'Wx2', {x: startPosition.x, y:startPosition.y - 2*j*this.caseWidth});
                    this.drawWord(this.gridContext, 'Wx2', {x: startPosition.x - 2*i*this.caseWidth, y:startPosition.y - 2*j*this.caseWidth});
                } else
                if(this.tripleWords.some((element) => element.x == i && element.y ==j)){
                    this.drawWord(this.gridContext, 'Wx3', startPosition);
                    this.drawWord(this.gridContext, 'Wx3', {x: startPosition.x - 2*i*this.caseWidth, y: startPosition.y});
                    this.drawWord(this.gridContext, 'Wx3', {x: startPosition.x, y:startPosition.y - 2*j*this.caseWidth});
                    this.drawWord(this.gridContext, 'Wx3', {x: startPosition.x - 2*i*this.caseWidth, y:startPosition.y - 2*j*this.caseWidth});
                } else
                {

                }
            }
        }
    }

    drawSymetricGrid(gridContext: CanvasRenderingContext2D) {
        let startPosition: Vec2 = { x: 0, y: 0 };
        for (let i = 0; i < 8; i++) {
            startPosition.x = i * this.caseWidth - this.caseWidth/2;
            for (let j = 0; j < 8; j++) {
                startPosition.y = j * this.caseWidth - this.caseWidth/2;
                if(this.doubleLetters.some((element) => element.x == i && element.y ==j)){
                    this.doubleLetter(gridContext, startPosition);
                } else
                if(this.tripleLetters.some((element) => element.x == i && element.y ==j)){
                    this.tripleLetter(gridContext, startPosition);
                } else
                if(this.doubleWords.some((element) => element.x == i && element.y ==j)){
                    this.doubleWord(gridContext, startPosition);
                } else
                if(this.tripleWords.some((element) => element.x == i && element.y ==j)){
                    this.tripleWord(gridContext, startPosition);
                } else
                {
                    gridContext.fillStyle = 'lightGrey';
                    gridContext.fillRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
                    gridContext.strokeRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
                }
            }
        }
        gridContext.fillStyle = 'violet';
        gridContext.fillRect(-this.caseWidth/2, -this.caseWidth/2, this.caseWidth, this.caseWidth);
        gridContext.strokeRect(-this.caseWidth/2, -this.caseWidth/2, this.caseWidth, this.caseWidth);
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
        //ctx.fillStyle = 'black';
        //ctx.textAlign = 'center';
        //ctx.fillText('Lx2', startPosition.x + this.caseWidth/4, startPosition.y + this.caseWidth/2);
    }
    
    private tripleLetter = (ctx: CanvasRenderingContext2D, startPosition: Vec2): void => {
        ctx.fillStyle = 'cadetBlue';
        ctx.fillRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
        ctx.strokeRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
        //ctx.fillStyle = 'black';
        //ctx.textAlign = 'center';
        //ctx.fillText('Lx3', startPosition.x + this.caseWidth/4, startPosition.y + this.caseWidth/2);
    }

    private doubleWord = (ctx: CanvasRenderingContext2D, startPosition: Vec2): void => {
        ctx.fillStyle = 'pink';
        ctx.fillRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
        ctx.strokeRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
        //ctx.fillStyle = 'black';
        //ctx.textAlign = 'center';
        //ctx.fillText('Wx2', startPosition.x + this.caseWidth/4, startPosition.y + this.caseWidth/2);   
    }

    private tripleWord = (ctx: CanvasRenderingContext2D, startPosition: Vec2): void => {
        ctx.fillStyle = 'red';
        ctx.fillRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
        ctx.strokeRect(startPosition.x, startPosition.y, this.caseWidth, this.caseWidth);
        //ctx.fillStyle = 'black';
        //ctx.textAlign = 'center';
        //ctx.fillText('Wx3', startPosition.x + this.caseWidth/4, startPosition.y + this.caseWidth/2);    
    }
}
