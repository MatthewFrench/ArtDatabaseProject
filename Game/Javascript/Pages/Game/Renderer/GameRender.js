import {Interface} from "../../../Utility/Interface";
import {TileLayer} from "./TileLayer/TileLayer";

export class GameRender {
    constructor() {
        this.canvas = Interface.Create({type: 'canvas', className: 'GameArea', onMouseDown: this.onMouseDown});
        this.ctx = this.canvas.getContext('2d');
        window.addEventListener("resize", this.resize);
        this.visible = false;

        this.colorSquareOptions = [];
        this.colorSquareOptions.push(new SquareShape(6, 5, 15, 15, "#0000ff"));
        this.colorSquareOptions.push(new SquareShape(23, 5, 15, 15, "#b500ff"));
        this.colorSquareOptions.push(new SquareShape(40, 5, 15, 15, "#ff00ef"));
        this.colorSquareOptions.push(new SquareShape(57, 5, 15, 15, "#ff0000"));
        this.colorSquareOptions.push(new SquareShape(74, 5, 15, 15, "#ff7700"));
        this.colorSquareOptions.push(new SquareShape(91, 5, 15, 15, "#f8ff00"));
        this.colorSquareOptions.push(new SquareShape(108, 5, 15, 15, "#3fff00"));
        this.colorSquareOptions.push(new SquareShape(125, 5, 15, 15, "#00ff8f"));
        this.colorSquareOptions.push(new SquareShape(142, 5, 15, 15, "#00b8ff"));
        this.colorSquareOptions.push(new SquareShape(159, 5, 15, 15, "#000000"));
        this.colorSquareOptions.push(new SquareShape(176, 5, 15, 15, "#ffffff"));

        this.chosenColor = this.colorSquareOptions[0].getColor();

        this.tileLayer = new TileLayer(200, 200);

        this.drawLoop();
    }

    drawLoop = () => {
        window.requestAnimationFrame(this.drawLoop);
        if (this.visible) {
            this.draw();
        }
    };

    resize = () => {
        let canvasWidth = this.canvas.width;
        let canvasHeight = this.canvas.height;
        let cssWidth = this.canvas.clientWidth;
        let cssHeight = this.canvas.clientHeight;
        if (canvasWidth !== cssWidth || canvasHeight !== cssHeight) {
            this.canvas.width = cssWidth;
            this.canvas.height = cssHeight;
        }
    };

    setVisibility = (visible) => {
        this.visible = visible;
    };

    draw = () => {
        this.tileLayer.draw();

        this.resize();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //Draw background
        this.ctx.fillStyle = this.chosenColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = 'black';
        for (let square of this.colorSquareOptions) {
            this.ctx.fillStyle = square.getColor();
            this.ctx.strokeRect(square.getX(), square.getY(), square.getWidth(), square.getHeight());
            this.ctx.fillRect(square.getX(), square.getY(), square.getWidth(), square.getHeight());
            this.ctx.stroke();
        }

        this.ctx.drawImage(this.tileLayer.getCanvas(), 100, 100);
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(100, 100, 200, 200);
    };

    getMousePosition = (event) =>{
        let rect = this.canvas.getBoundingClientRect();
        return{
            x: (event.clientX - rect.left) / (rect.right - rect.left) * this.canvas.width,
            y: (event.clientY - rect.top) / (rect.bottom - rect.top) * this.canvas.height
        }
    };

    onMouseDown = (event) => {
        let mousePosition = this.getMousePosition(event);
        for(let colorSquare of this.colorSquareOptions){
            if(colorSquare.isPositionInSquare(mousePosition.x, mousePosition.y)){
                this.chosenColor = colorSquare.getColor();
            }
        }
    };

    getCanvas = () => {
        return this.canvas;
    };
}


class SquareShape {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
    }

    getX = () => {
        return this.x;
    };

    getY = () => {
        return this.y;
    };

    getWidth = () => {
        return this.w;
    };

    getHeight = () => {
        return this.h;
    };

    getColor = () => {
        return this.color;
    };

    isPositionInSquare = (x, y) =>{
        return (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h);
    }
}