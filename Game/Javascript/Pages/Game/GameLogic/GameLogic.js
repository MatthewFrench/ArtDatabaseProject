import {Interface} from "../../../Utility/Interface";
import {Board} from "./Board";
import {Point} from "./Point";
import {TileLayerRenderer} from "./TileLayerRenderer/TileLayerRenderer";
import {PhysicsLogic} from "./PhysicsLogic";
const Tile_Height = 10;
const Tile_Width = 10;
const Player_Width_Tiles = 2;
const Player_Height_Tiles = 5;

export class GameLogic {
    constructor() {
        this.canvas = Interface.Create({type: 'canvas', className: 'GameArea',
            onMouseDown: this.onMouseDown, onKeyDown: this.onKeyDown, onKeyUp: this.onKeyUp});
        this.canvas.tabIndex = 1;
        this.ctx = this.canvas.getContext('2d');
        window.addEventListener("resize", this.resize);
        this.visible = false;
        this.leftPressed = false;
        this.rightPressed = false;
        this.upPressed = false;
        this.downPressed = false;

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

        this.board = new Board();
        this.physicsLogic = new PhysicsLogic();

        //Camera focus is on a player ID.
        this.cameraFocusPlayerID = 1;

        this.board.addPlayer(1, 'Test', 0, 0);
        this.board.addPlayer(2, 'Bob', 50, 0);

        //Set some basic tiles
        for (let x = -100; x < 100; x++) {
            this.board.setTileColor(x, 0, Math.random(), Math.random(), Math.random(), 1);
        }
        for (let y = -100; y < 100; y++) {
            for (let x = -100; x < 100; x++) {
                if (Math.random() >= 0.95) {
                    this.board.setTileColor(x, y, Math.random(), Math.random(), Math.random(), 1);
                }
            }
        }


        this.tileLayerRenderer = new TileLayerRenderer(1000, 800);

        this.logicLoop();
    }

    logicLoop = () => {
        window.requestAnimationFrame(this.logicLoop);
        if (this.visible) {
            this.logic();
            this.physicsLogic.logic();
            this.draw();
        }
    };

    logic = () => {
        let focusPlayer = this.board.getPlayer(this.cameraFocusPlayerID);
        if (this.leftPressed) {
            focusPlayer.setX(focusPlayer.getX() - 0.1);
        }
        if (this.rightPressed) {
            focusPlayer.setX(focusPlayer.getX() + 0.1);
        }
        if (this.upPressed) {
            focusPlayer.setY(focusPlayer.getY() + 0.1);
        }
        if (this.downPressed) {
            focusPlayer.setY(focusPlayer.getY() - 0.1);
        }
        this.tileLayerRenderer.setFocusTilePosition(
            focusPlayer.getX(), focusPlayer.getY()
        );
    };

    draw = () => {
        this.resize();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //Draw background
        this.ctx.fillStyle = this.chosenColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.tileLayerRenderer.draw(this.board);

        this.ctx.drawImage(this.tileLayerRenderer.getCanvas(), 0, 0);

        //Draw players
        let focusPlayer = this.board.getPlayer(this.cameraFocusPlayerID);
        let focusPlayerPixelX = (focusPlayer.getX() - Player_Width_Tiles/2) * Tile_Width;
        let focusPlayerPixelY = focusPlayer.getY() * Tile_Height;
        this.board.getPlayers().forEach((player)=>{
            this.ctx.fillStyle = 'blue';
            this.ctx.strokeStyle = 'black';
            let x = (player.getX() - Player_Width_Tiles/2) * Tile_Width - focusPlayerPixelX + this.canvas.width/2;
            let y = focusPlayerPixelY - player.getY() * Tile_Height
                - Player_Height_Tiles * Tile_Height + this.canvas.height/2;

            this.ctx.fillRect(x,
                y,
                Player_Width_Tiles * Tile_Width,
                Player_Height_Tiles * Tile_Height);

            this.ctx.strokeRect(x,
                y,
                Player_Width_Tiles * Tile_Width,
                Player_Height_Tiles * Tile_Height);

            this.ctx.fillStyle = 'red';
            this.ctx.fillText(player.getName(), x, y - 10);
        });

        //Draw color selector
        this.ctx.strokeStyle = 'black';
        for (let square of this.colorSquareOptions) {
            this.ctx.fillStyle = square.getColor();
            this.ctx.strokeRect(square.getX(), square.getY(), square.getWidth(), square.getHeight());
            this.ctx.fillRect(square.getX(), square.getY(), square.getWidth(), square.getHeight());
            this.ctx.stroke();
        }
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

    onKeyDown = (event) => {
        //Left
        if (event.keyCode === 37) {
            this.leftPressed = true;
        }
        //Right
        if (event.keyCode === 39) {
            this.rightPressed = true;
        }
        //Up
        if (event.keyCode === 38) {
            this.upPressed = true;
        }
        //Down
        if (event.keyCode === 40) {
            this.downPressed = true;
        }
    };

    onKeyUp = (event) => {
        //Left
        if (event.keyCode === 37) {
            this.leftPressed = false;
        }
        //Right
        if (event.keyCode === 39) {
            this.rightPressed = false;
        }
        //Up
        if (event.keyCode === 38) {
            this.upPressed = false;
        }
        //Down
        if (event.keyCode === 40) {
            this.downPressed = false;
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
            this.tileLayerRenderer.setSize(cssWidth, cssHeight);
        }
    };

    setVisibility = (visible) => {
        this.visible = visible;
        this.canvas.focus();
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