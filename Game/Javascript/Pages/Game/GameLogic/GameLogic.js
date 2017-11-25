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
        this.cameraFocusTileX = 0;
        this.cameraFocusTileY = 0;

        this.addPlayer(1, 'Test', 0, 10);
        this.addPlayer(2, 'Bob', 50, 5);
        //Set some basic tiles
        for (let x = -100; x < 100; x++) {
            this.addOrUpdateTile(x, 0, Math.random(), Math.random(), Math.random(), 1);
        }

        for (let y = -100; y < 100; y++) {
            for (let x = -100; x < 100; x++) {
                if (Math.random() >= 0.99) {
                    this.addOrUpdateTile(x, y, Math.random(), Math.random(), Math.random(), 1);
                }
            }
        }



        this.addOrUpdateTile(0, 0, Math.random(), Math.random(), Math.random(), 1);

        this.addOrUpdateTile(-1, 0, Math.random(), Math.random(), Math.random(), 1);
        this.addOrUpdateTile(1, 0, Math.random(), Math.random(), Math.random(), 1);
        this.addOrUpdateTile(-2, 0, Math.random(), Math.random(), Math.random(), 1);
        this.addOrUpdateTile(2, 0, Math.random(), Math.random(), Math.random(), 1);
        this.addOrUpdateTile(-3, 0, Math.random(), Math.random(), Math.random(), 1);
        this.addOrUpdateTile(3, 0, Math.random(), Math.random(), Math.random(), 1);
        this.addOrUpdateTile(-4, 0, Math.random(), Math.random(), Math.random(), 1);
        this.addOrUpdateTile(4, 0, Math.random(), Math.random(), Math.random(), 1);

        this.addOrUpdateTile(-4, 1, Math.random(), Math.random(), Math.random(), 1);
        this.addOrUpdateTile(4, 1, Math.random(), Math.random(), Math.random(), 1);
        this.addOrUpdateTile(-4, 2, Math.random(), Math.random(), Math.random(), 1);
        this.addOrUpdateTile(4, 2, Math.random(), Math.random(), Math.random(), 1);
        this.addOrUpdateTile(-4, 3, Math.random(), Math.random(), Math.random(), 1);
        this.addOrUpdateTile(4, 3, Math.random(), Math.random(), Math.random(), 1);
        this.addOrUpdateTile(-4, 4, Math.random(), Math.random(), Math.random(), 1);
        this.addOrUpdateTile(4, 4, Math.random(), Math.random(), Math.random(), 1);
        this.addOrUpdateTile(-5, 4, Math.random(), Math.random(), Math.random(), 1);
        this.addOrUpdateTile(5, 4, Math.random(), Math.random(), Math.random(), 1);
        this.addOrUpdateTile(-6, 4, Math.random(), Math.random(), Math.random(), 1);
        this.addOrUpdateTile(6, 4, Math.random(), Math.random(), Math.random(), 1);
        this.addOrUpdateTile(-7, 4, Math.random(), Math.random(), Math.random(), 1);
        this.addOrUpdateTile(7, 4, Math.random(), Math.random(), Math.random(), 1);


        this.tileLayerRenderer = new TileLayerRenderer(1000, 800);

        this.logicLoop();
    }

    addPlayer = (playerID, name, x, y) => {
        /*let player = */this.board.addPlayer(playerID, name, x, y);
        //this.physicsLogic.addPlayerBody(player);
    };
    addOrUpdateTile = (x, y, r, g, b, a) => {
        this.board.setTileColor(x, y, r, g, b, a);
/*
        let tile = this.board.getTile(x, y);
        if (a === 0.0) {
            this.physicsLogic.removeTileBody(tile);
        } else {
            this.physicsLogic.updateTileBodyPosition(tile, x, y);
        }
        */
    };

    logicLoop = () => {
        window.requestAnimationFrame(this.logicLoop);
        if (this.visible) {
            this.logic();
            this.draw();
        }
    };

    logic = () => {
        let focusPlayer = this.board.getPlayer(this.cameraFocusPlayerID);
        if (this.leftPressed) {
            focusPlayer.movingLeft = true;
            //this.physicsLogic.applyForceToPlayer(focusPlayer, -10, 0);
            //focusPlayer.setX(focusPlayer.getX() - 0.1);
        } else {
            focusPlayer.movingLeft = false;
        }
        if (this.rightPressed) {
            focusPlayer.movingRight = true;
            //this.physicsLogic.applyForceToPlayer(focusPlayer, 10, 0);
            //focusPlayer.setX(focusPlayer.getX() + 0.1);
        } else {
            focusPlayer.movingRight = false;
        }
        if (this.upPressed) {
            focusPlayer.jumping = true;
            //this.physicsLogic.applyForceToPlayer(focusPlayer, 0, 10);
            //focusPlayer.setY(focusPlayer.getY() + 0.1);
        } else {
            focusPlayer.jumping = false;
        }
        if (this.downPressed) {
            //this.physicsLogic.applyForceToPlayer(focusPlayer, 0, 1);
            //focusPlayer.setY(focusPlayer.getY() - 0.1);
        }
        this.physicsLogic.logic(this.board);
        this.cameraFocusTileX = focusPlayer.getX();
        this.cameraFocusTileY = focusPlayer.getY();
        this.tileLayerRenderer.setFocusTilePosition(
            this.cameraFocusTileX, this.cameraFocusTileY
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

        //Test drawing in tile transformation
        this.ctx.save();
        //this.enterTileDrawingCoordinateSystem();

        //Draw
        let tile = this.board.getTile(0, 0);
        if (tile !== null) {
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 1;//0.1;
            this.ctx.beginPath();
            this.ctx.moveTo(this.convertTileXCoordinateToScreen(tile.getX()), this.convertTileYCoordinateToScreen(tile.getY()));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(tile.getX()), this.convertTileYCoordinateToScreen(tile.getY() + 1));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(tile.getX() + 1), this.convertTileYCoordinateToScreen(tile.getY() + 1));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(tile.getX() + 1), this.convertTileYCoordinateToScreen(tile.getY()));
            this.ctx.closePath();
            this.ctx.stroke();
        }

        //Draw players
        this.board.getPlayers().forEach((player)=>{
            this.ctx.fillStyle = 'blue';
            this.ctx.strokeStyle = 'black';

            this.ctx.beginPath();

            //Player X and Y is in the bottom center of the player rectangle
            let leftX = player.getX() + 0.5 - Player_Width_Tiles/2;
            let rightX = player.getX() + 0.5 + Player_Width_Tiles/2;
            let bottomY = player.getY();
            let topY = player.getY() + Player_Height_Tiles;

            this.ctx.moveTo(this.convertTileXCoordinateToScreen(leftX), this.convertTileYCoordinateToScreen(bottomY));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(rightX), this.convertTileYCoordinateToScreen(bottomY));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(rightX), this.convertTileYCoordinateToScreen(topY));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(leftX), this.convertTileYCoordinateToScreen(topY));

            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();

            this.ctx.fillStyle = 'red';
            this.ctx.font = '20px Helvetica';
            this.ctx.textAlign="center";
            this.ctx.fillText(player.getName(), this.convertTileXCoordinateToScreen(player.getX() + 0.5), this.convertTileYCoordinateToScreen(topY + 0.5));
        });

        this.ctx.restore();

        //Draw color selector
        this.ctx.strokeStyle = 'black';
        for (let square of this.colorSquareOptions) {
            this.ctx.fillStyle = square.getColor();
            this.ctx.strokeRect(square.getX(), square.getY(), square.getWidth(), square.getHeight());
            this.ctx.fillRect(square.getX(), square.getY(), square.getWidth(), square.getHeight());
            this.ctx.stroke();
        }
    };

    enterTileDrawingCoordinateSystem = () => {
        //Place 0,0 at the center of the screen
        this.ctx.translate(this.canvas.width/2, this.canvas.height * 0.5);
        //Flip the coordinate system
        this.ctx.scale(1, -1);
        //Set the scale so 1 = 1 tile instead of 1 pixel
        this.ctx.scale(Tile_Width, Tile_Height);
        //Move to the center of the tile, instead of the camera being on the bottom left corner,
        //let the camera be on the center of the tile
        this.ctx.translate(-0.5, -0.5);
        //Pan the camera to focus on the player
        let focusPlayer = this.board.getPlayer(this.cameraFocusPlayerID);
        let focusPlayerTileX = 0;
        let focusPlayerTileY = 0;
        if (focusPlayer !== null) {
            focusPlayerTileX = focusPlayer.getX();
            focusPlayerTileY = focusPlayer.getY();
        }
        this.ctx.translate(-focusPlayerTileX, -focusPlayerTileY);
    };

    convertTileCoordinateToScreen = (oldPoint) => {
        let point = new Point(oldPoint.x, oldPoint.y);
        point.x -= this.cameraFocusTileX;
        point.y -= this.cameraFocusTileY;
        point.x -= 0.5;
        point.y -= 0.5;
        point.x *= Tile_Width;
        point.y *= Tile_Height;
        point.y *= -1;
        point.x += this.canvas.width/2;
        point.y += this.canvas.height * 0.5;
        return point;
    };
    convertTileXCoordinateToScreen = (x) => {
        x -= this.cameraFocusTileX;
        x -= 0.5;
        x *= Tile_Width;
        x += this.canvas.width/2;
        return x;
    };
    convertTileYCoordinateToScreen = (y) => {
        y -= this.cameraFocusTileY;
        y -= 0.5;
        y *= Tile_Height;
        y *= -1;
        y += this.canvas.height * 0.5;
        return y;
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