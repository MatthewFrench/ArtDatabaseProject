import {Interface} from "../../Utility/Interface";

export class GameRender {
    constructor() {
        this.canvas = Interface.Create({type: 'canvas', className: 'gameArea', onMouseDown: this.onMouseDown});
        this.ctx = this.canvas.getContext('2d');
        window.addEventListener("resize", this.resize);
        this.drawLoop();
    }

    getCanvas = () => {
        return this.canvas;
    }

    drawLoop = () => {
        window.requestAnimationFrame(this.drawLoop);
        this.draw();
    }

    resize = () => {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    draw = () => {
        this.resize();
        this.colorOptions = [];
        this.colorOptions.push(new SquareShape(6, 5, 15, 15, "#0000ff"));
        this.colorOptions.push(new SquareShape(23, 5, 15, 15, "#b500ff"));
        this.colorOptions.push(new SquareShape(40, 5, 15, 15, "#ff00ef"));
        this.colorOptions.push(new SquareShape(57, 5, 15, 15, "#ff0000"));
        this.colorOptions.push(new SquareShape(74, 5, 15, 15, "#ff7700"));
        this.colorOptions.push(new SquareShape(91, 5, 15, 15, "#f8ff00"));
        this.colorOptions.push(new SquareShape(108, 5, 15, 15, "#3fff00"));
        this.colorOptions.push(new SquareShape(125, 5, 15, 15, "#00ff8f"));
        this.colorOptions.push(new SquareShape(142, 5, 15, 15, "#00b8ff"));
        this.colorOptions.push(new SquareShape(159, 5, 15, 15, "#000000"));
        this.colorOptions.push(new SquareShape(176, 5, 15, 15, "#ffffff"));
        for (var i in this.colorOptions) {
            var colors = this.colorOptions[i];
            this.ctx.fillStyle = colors.fill;
            this.ctx.strokeStyle = 'black';
            this.ctx.strokeRect(colors.x, colors.y, colors.w, colors.h);
            this.ctx.fillRect(colors.x, colors.y, colors.w, colors.h);
            this.ctx.stroke();
        }
    }

    getMousePosition = (event) =>{
        this.rect = this.canvas.getBoundingClientRect();
        return{
            x: (window.event.clientX - this.rect.left) / (this.rect.right - this.rect.left) * this.canvas.width,
            y: (window.event.clientY - this.rect.top) / (this.rect.bottom - this.rect.top) * this.canvas.height
        }
    }

    onMouseDown = (event) => {
        this.position = this.getMousePosition(this.canvas, event);
        this.posX = this.position.x;
        this.posY = this.position.y;
        for(let color of this.colorOptions){
            if(color.isPositionInSquare(this.posX, this.posY)){
                this.ctx.fillStyle = color.fill;
                console.log(color.fill);
            }
        }


    }
}


class SquareShape {
    constructor(x, y, w, h, fill) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.fill = fill;
    }

    isPositionInSquare = (x, y) =>{
        if(x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h){
            return true;
        }
        return false;
    }
}
