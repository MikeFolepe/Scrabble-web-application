import { Injectable } from '@angular/core';
import { MinLengthValidator } from '@angular/forms';
import { Vec2 } from '@app/classes/vec2';

// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter!
export const DEFAULT_WIDTH = 640;
export const DEFAULT_HEIGHT = 640;
export const BOARD_SIZE = 16;
export const MINTILESIZE = 4; //en pixel
export const MAXTILESIZE = 25; //en pixel

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
    private tilesSize:number = 15;
    
    // TODO : pas de valeurs magiques!! Faudrait avoir une meilleure manière de le faire
    /* eslint-disable @typescript-eslint/no-magic-numbers */

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    setTilesSize(tilesSize:number):void{
        if (this.tilesSize < MINTILESIZE){
            this.tilesSize = MINTILESIZE;
        } else
        if (this.tilesSize > MAXTILESIZE){
            this.tilesSize = MAXTILESIZE;
        } else
        {
            this.tilesSize = tilesSize;
        }
    }

    drawGrid() {      
        this.writeColumnsIndex(this.gridContext, 15);
        this.writeLinesIndex(this.gridContext, 15)
        this.gridContext.translate(DEFAULT_WIDTH / 2 +  this.caseWidth/2, DEFAULT_HEIGHT / 2 + this.caseWidth/2);
        for (let i = 0; i < 4; i++) {
            this.drawSymetricGrid(this.gridContext);
            this.gridContext.rotate((Math.PI / 180) * 90);
        }
        this.drawStar(0,0,5,this.caseWidth/2-3,8);
        this.writeBonuses();
    }

    drawWord(ctx:CanvasRenderingContext2D, word: string, startPosition:Vec2) {
        ctx.font = '12px system-ui';
        ctx.fillStyle = 'black';
        let lineheight = 12;
        let lines = word.split(' ');
        for (var i = 0; i<lines.length; i++)
            ctx.fillText(lines[i], startPosition.x + this.caseWidth/8 + i*lineheight, startPosition.y + this.caseWidth/2 + i*lineheight);
    }

    writeBonuses(){
        let startPosition: Vec2 = { x: 0, y: 0 };
        for(let i = 0; i < 8; i++) {
            startPosition.x = i * this.caseWidth - this.caseWidth/2;
            for (let j = 0; j < 8; j++) {
                startPosition.y = j * this.caseWidth - this.caseWidth/2;
                if(this.doubleLetters.some((element) => element.x == i && element.y ==j)){
                    this.drawWord(this.gridContext, 'Lettre x2', startPosition);
                    this.drawWord(this.gridContext, 'Lettre x2', {x: startPosition.x - 2*i*this.caseWidth, y: startPosition.y});
                    this.drawWord(this.gridContext, 'Lettre x2', {x: startPosition.x, y:startPosition.y - 2*j*this.caseWidth});
                    this.drawWord(this.gridContext, 'Lettre x2', {x: startPosition.x - 2*i*this.caseWidth, y:startPosition.y - 2*j*this.caseWidth});
                } else
                if(this.tripleLetters.some((element) => element.x == i && element.y ==j)){
                    this.drawWord(this.gridContext, 'Lettre x3', startPosition);
                    this.drawWord(this.gridContext, 'Lettre x3', {x: startPosition.x - 2*i*this.caseWidth, y: startPosition.y});
                    this.drawWord(this.gridContext, 'Lettre x3', {x: startPosition.x, y:startPosition.y - 2*j*this.caseWidth});
                    this.drawWord(this.gridContext, 'Lettre x3', {x: startPosition.x - 2*i*this.caseWidth, y:startPosition.y - 2*j*this.caseWidth});
                } else
                if(this.doubleWords.some((element) => element.x == i && element.y ==j)){
                    this.drawWord(this.gridContext, 'Word x2', startPosition);
                    this.drawWord(this.gridContext, 'Word x2', {x: startPosition.x - 2*i*this.caseWidth, y: startPosition.y});
                    this.drawWord(this.gridContext, 'Word x2', {x: startPosition.x, y:startPosition.y - 2*j*this.caseWidth});
                    this.drawWord(this.gridContext, 'Word x2', {x: startPosition.x - 2*i*this.caseWidth, y:startPosition.y - 2*j*this.caseWidth});
                } else
                if(this.tripleWords.some((element) => element.x == i && element.y ==j)){
                    this.drawWord(this.gridContext, 'Word x3', startPosition);
                    this.drawWord(this.gridContext, 'Word x3', {x: startPosition.x - 2*i*this.caseWidth, y: startPosition.y});
                    this.drawWord(this.gridContext, 'Word x3', {x: startPosition.x, y:startPosition.y - 2*j*this.caseWidth});
                    this.drawWord(this.gridContext, 'Word x3', {x: startPosition.x - 2*i*this.caseWidth, y:startPosition.y - 2*j*this.caseWidth});
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
        gridContext.fillStyle = 'pink';
        gridContext.fillRect(-this.caseWidth/2, -this.caseWidth/2, this.caseWidth, this.caseWidth);
        gridContext.strokeRect(-this.caseWidth/2, -this.caseWidth/2, this.caseWidth, this.caseWidth);
    }

    drawStar(cx:number,cy:number,spikes:number,outerRadius:number,innerRadius:number){
        var rot=Math.PI/2*3;
        var x=cx;
        var y=cy;
        var step=Math.PI/spikes;
  
        this.gridContext.beginPath();
        this.gridContext.moveTo(cx,cy-outerRadius)
        for(let i=0;i<spikes;i++){
          x=cx+Math.cos(rot)*outerRadius;
          y=cy+Math.sin(rot)*outerRadius;
          this.gridContext.lineTo(x,y)
          rot+=step
  
          x=cx+Math.cos(rot)*innerRadius;
          y=cy+Math.sin(rot)*innerRadius;
         this.gridContext.lineTo(x,y)
          rot+=step
        }
        this.gridContext.lineTo(cx,cy-outerRadius);
        this.gridContext.closePath();
        this.gridContext.lineWidth=5;
        this.gridContext.strokeStyle='darkSlateGrey';
        this.gridContext.stroke();
        this.gridContext.fillStyle='darkSlateGrey';
        this.gridContext.fill();
      }

    writeColumnsIndex(ctx:CanvasRenderingContext2D, columnsNumber: number){
        for(let i=0; i<columnsNumber; i++){
            let index = i+1; 
            ctx.font = '18px system-ui'
            ctx.fillStyle = 'black';
            ctx.fillText(index.toString(), 5*this.caseWidth/4 + i*this.caseWidth, 3*this.caseWidth/4);
        }
    }

    writeLinesIndex(ctx:CanvasRenderingContext2D, linesNumber: number){
        for(let i=0; i<linesNumber; i++){
            let index = 'A'.charCodeAt(0);
            index = index+i; 
            ctx.font = '18px system-ui'
            ctx.fillStyle = 'black';
            ctx.fillText(String.fromCharCode(index), this.caseWidth/2,  7*this.caseWidth/4 + i*this.caseWidth);
        }
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
