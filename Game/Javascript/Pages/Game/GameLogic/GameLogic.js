import {Interface} from "../../../Utility/Interface";
import {Board} from "./Board";
import {Point} from "./Point";
import {TileLayerRenderer} from "./TileLayerRenderer/TileLayerRenderer";
import {PhysicsLogic} from "./PhysicsLogic";
import {GameMessageCreator} from "../../../Networking/Game/GameMessageCreator";
import {Network} from "../../../Networking/Network";
import spriteSheet from "../../../../Images/walkcyclevarious.png";

const Tile_Height = 10;
const Tile_Width = 10;
const Player_Width_Tiles = 2;
const Player_Height_Tiles = 5;
const Sprite_Width = 26;
const Sprite_Horizontal_Distance = 64;
const Sprite_Total_Width = 768;
const Sprite_Total_Height = 474;
const Sprite_Vertical_Table = [0, 62, 58, 61, 61, 61, 61, 64];
const Sprite_X_Start = 18;
const Frame_Next_Max = 4;
const Frame_Total_Max = 2;
const Idiot_Frame_Table = [1, 0, 2];

const Background_Tile_Type = 3;
const Solid_Tile_Type = 4;
const Foreground_Tile_Type = 5;
const Deleted_Tile_Type = 6;

export class GameLogic {
    constructor() {
        this.redSlider = Interface.Create({type: 'input', className: 'RedSlider',  inputType: 'range', min: 0, max: 255, step: 1, value: 0, onChange: this.changePreviewColor});
        this.greenSlider = Interface.Create({type: 'input', className: 'GreenSlider',  inputType: 'range', min: 0, max: 255, step: 1, value: 0, onChange: this.changePreviewColor});
        this.blueSlider = Interface.Create({type: 'input', className: 'BlueSlider',  inputType: 'range', min: 0, max: 255, step: 1, value: 0, onChange: this.changePreviewColor});
        this.alphaSlider = Interface.Create({type: 'input', className: 'AlphaSlider',  inputType: 'range', min: 0, max: 255, step: 1, value: 255, onChange: this.changePreviewColor});
        this.eyeDropButton = Interface.Create({type: 'div', text: '\r\neye\r\n\r\ndrop', className: 'EyeDropButton', onClick: this.eyeDropButtonClicked});

        this.tileSelector = Interface.Create({type: 'div', className: 'TileSelector', elements: [
            this.rgbaLabel = Interface.Create({type: 'div', className: 'RGBALabel', elements: [
                {type: 'div', text: 'R', className: 'RedLabel'},
                {type: 'div', text: 'G', className: 'GreenLabel'},
                {type: 'div', text: 'B', className: 'BlueLabel'},
                {type: 'div', text: 'A', className: 'AlphaLabel'},
                {type: 'div', text: '255', className: 'RedValue'},
                {type: 'div', text: '255', className: 'GreenValue'},
                {type: 'div', text: '255', className: 'BlueValue'},
                {type: 'div', text: '255', className: 'AlphaValue'},
            ]}),
            {type: 'div', text: 'Tile Type', className: 'TileLabel'},
            this.deleteTypeButton = Interface.Create({type: 'div', text: 'Delete', className: 'DeleteButton', onClick: this.deleteTileTypeClicked}),
            this.backgroundTypeButton = Interface.Create({type: 'div', text: 'Background', className: 'BackgroundButton', onClick: this.backgroundTileTypeClicked}),
            this.solidTypeButton = Interface.Create({type: 'div', text: 'Solid', className: 'SolidButton Selected', onClick: this.solidTileTypeClicked}),
            this.foregroundTypeButton = Interface.Create({type: 'div', text: 'Foreground', className: 'ForegroundButton', onClick: this.foregroundTileTypeClicked})
        ]});
        //holds the value of the color to be used for a tile
        this.previewSquare = Interface.Create({type: 'div', className: 'PreviewSquare'});
        this.eyeDropperOn = false;
        this.playerSpriteSheet = new Image();
        this.playerSpriteSheet.src = spriteSheet;
        this.frameNumber = 0;
        this.frameNextNumber = 0;
        this.facingIndex = 4;

        this.canvas = Interface.Create({type: 'canvas', className: 'GameArea',
            onMouseDown: this.onMouseDown, onKeyDown: this.onKeyDown, onKeyUp: this.onKeyUp,
            onMouseMove: this.onMouseMove, onMouseUp: this.onMouseUp});
        this.canvas.tabIndex = 1;
        this.ctx = this.canvas.getContext('2d');
        window.addEventListener("resize", this.resize);
        this.visible = false;
        this.leftPressed = false;
        this.rightPressed = false;
        this.upPressed = false;
        this.downPressed = false;

        this.board = new Board(-1);
        this.physicsLogic = new PhysicsLogic();

        //Camera focus is on a player ID.
        this.cameraFocusPlayerID = 1;
        this.cameraFocusTileX = 0;
        this.cameraFocusTileY = 0;

        this.previouslyPlacedTileX = null;
        this.previouslyPlacedTileY = null;
        this.mouseDown = false;
        this.currentTileType = Solid_Tile_Type;

        this.backgroundTileLayerRenderer = new TileLayerRenderer(1000, 800, Background_Tile_Type);
        this.solidTileLayerRenderer = new TileLayerRenderer(1000, 800, Solid_Tile_Type);
        this.foregroundTileLayerRenderer = new TileLayerRenderer(1000, 800, Foreground_Tile_Type);

        this.redSlider.value = 0;
        this.greenSlider.value = 0;
        this.blueSlider.value = 0;
        this.alphaSlider.value = 255;
        this.changePreviewColor();
        this.updateSliderLabels();

        this.logicLoop();
    }

    backgroundTileTypeClicked = () => {
        this.deleteTypeButton.classList.remove('Selected');
        this.solidTypeButton.classList.remove('Selected');
        this.foregroundTypeButton.classList.remove('Selected');
        this.backgroundTypeButton.classList.add('Selected');
        this.currentTileType = Background_Tile_Type;
    };
    solidTileTypeClicked = () => {
        this.deleteTypeButton.classList.remove('Selected');
        this.solidTypeButton.classList.add('Selected');
        this.foregroundTypeButton.classList.remove('Selected');
        this.backgroundTypeButton.classList.remove('Selected');
        this.currentTileType = Solid_Tile_Type;
    };
    foregroundTileTypeClicked = () => {
        this.deleteTypeButton.classList.remove('Selected');
        this.solidTypeButton.classList.remove('Selected');
        this.foregroundTypeButton.classList.add('Selected');
        this.backgroundTypeButton.classList.remove('Selected');
        this.currentTileType = Foreground_Tile_Type;
    };
    deleteTileTypeClicked = () => {
        this.deleteTypeButton.classList.add('Selected');
        this.solidTypeButton.classList.remove('Selected');
        this.foregroundTypeButton.classList.remove('Selected');
        this.backgroundTypeButton.classList.remove('Selected');
        this.currentTileType = Deleted_Tile_Type;
    };

    resetBoardToNewBoard = (boardID) => {
        this.board = new Board(boardID);
    };

    updateTile = (x, y, typeID, r, g, b, a) => {
        this.board.setTile(x, y, typeID, r, g, b, a);
    };

    addPlayer = (playerID, name, x, y, speedX, speedY, movingLeft, movingRight, jumping) => {
        /*let player = */this.board.addPlayer(playerID, name, x, y, speedX, speedY, movingLeft, movingRight, jumping);
        //this.physicsLogic.addPlayerBody(player);
    };

    removePlayer = (playerID) => {
        this.board.removePlayer(playerID);
    };

    updatePlayer = (playerID, x, y, speedX, speedY, movingLeft, movingRight, jumping) => {
        this.board.updatePlayer(playerID, x, y, speedX, speedY, movingLeft, movingRight, jumping);
    };

    setPlayerFocusID = (cameraFocusPlayerID) => {
        this.cameraFocusPlayerID = cameraFocusPlayerID;
    };

    //Called by the mouse handler to set a tile change to the server
    placeTile = (x, y) => {
        Network.Send(GameMessageCreator.SetTile(x, y, this.currentTileType, parseInt(this.redSlider.value),
            parseInt(this.greenSlider.value), parseInt(this.blueSlider.value), parseInt(this.alphaSlider.value)));
    };

    //addOrUpdateTile = (x, y, r, g, b, a) => {
    //    this.board.setTileColor(x, y, r, g, b, a);
/*
        let tile = this.board.getTile(x, y);
        if (a === 0.0) {
            this.physicsLogic.removeTileBody(tile);
        } else {
            this.physicsLogic.updateTileBodyPosition(tile, x, y);
        }
        */
    //};

    logicLoop = () => {
        window.requestAnimationFrame(this.logicLoop);
        if (this.visible) {
            this.logic();
            this.draw();
        }
    };

    logic = () => {
        let focusPlayer = this.board.getPlayer(this.cameraFocusPlayerID);
        if (focusPlayer !== null) {
            if (this.leftPressed) {
                focusPlayer.movingLeft = true;
                this.frameNextNumber += 1;
                if(this.frameNextNumber > Frame_Next_Max){
                    this.frameNextNumber = 0;
                    this.frameNumber += 1;
                    if(this.frameNumber > Frame_Total_Max){
                        this.frameNumber = 0;
                    }
                    this.facingIndex = 9 + Idiot_Frame_Table[this.frameNumber];
                }
                //console.log(this.frameNumber, this.frameNextNumber);
                //this.physicsLogic.applyForceToPlayer(focusPlayer, -10, 0);
                //focusPlayer.setX(focusPlayer.getX() - 0.1);
            } else {
                focusPlayer.movingLeft = false;
            }
            if (this.rightPressed) {
                focusPlayer.movingRight = true;
                this.frameNextNumber += 1;
                if(this.frameNextNumber > Frame_Next_Max){
                    this.frameNextNumber = 0;
                    this.frameNumber += 1;
                    if(this.frameNumber > Frame_Total_Max){
                        this.frameNumber = 0;
                    }
                    this.facingIndex = 3 + Idiot_Frame_Table[this.frameNumber];
                }
                //console.log(this.frameNumber, this.frameNextNumber);
                //this.physicsLogic.applyForceToPlayer(focusPlayer, 10, 0);
                //focusPlayer.setX(focusPlayer.getX() + 0.1);
            } else {
                focusPlayer.movingRight = false;
            }
            if (this.upPressed) {
                focusPlayer.jumping = true;
                this.facingIndex = 8;
                //this.physicsLogic.applyForceToPlayer(focusPlayer, 0, 10);
                //focusPlayer.setY(focusPlayer.getY() + 0.1);
            } else {
                focusPlayer.jumping = false;
            }
            if (this.downPressed) {
                //this.physicsLogic.applyForceToPlayer(focusPlayer, 0, 1);
                //focusPlayer.setY(focusPlayer.getY() - 0.1);
            }
        }
        this.physicsLogic.logic(this.board);
        if (focusPlayer !== null) {
            this.cameraFocusTileX = focusPlayer.getX();
            this.cameraFocusTileY = focusPlayer.getY();
        }
        this.backgroundTileLayerRenderer.setFocusTilePosition(this.cameraFocusTileX, this.cameraFocusTileY);
        this.solidTileLayerRenderer.setFocusTilePosition(this.cameraFocusTileX, this.cameraFocusTileY);
        this.foregroundTileLayerRenderer.setFocusTilePosition(this.cameraFocusTileX, this.cameraFocusTileY);
    };

    draw = () => {
        this.resize();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //Draw background
        this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.backgroundTileLayerRenderer.draw(this.board);

        this.solidTileLayerRenderer.draw(this.board);

        this.ctx.drawImage(this.backgroundTileLayerRenderer.getCanvas(), 0, 0);
        this.ctx.drawImage(this.solidTileLayerRenderer.getCanvas(), 0, 0);

        //Test drawing in tile transformation
        this.ctx.save();

        //Draw players
        let focusPlayer = this.board.getPlayer(this.cameraFocusPlayerID);
        if (focusPlayer !== null) {
            let leftX = focusPlayer.getX() + 0.5 - Player_Width_Tiles/2;
            let rightX = focusPlayer.getX() + 0.5 + Player_Width_Tiles/2;
            let bottomY = focusPlayer.getY();
            let topY = focusPlayer.getY() + Player_Height_Tiles;
            this.ctx.drawImage(this.playerSpriteSheet, Sprite_X_Start + Sprite_Horizontal_Distance * this.facingIndex, 0, Sprite_Width, 44,  this.convertTileXCoordinateToScreen(leftX), this.convertTileYCoordinateToScreen(topY) + 6, Sprite_Width, 44);

            this.ctx.fillStyle = 'red';
            this.ctx.font = '20px Helvetica';
            this.ctx.textAlign="center";
            this.ctx.fillText(focusPlayer.getName(), this.convertTileXCoordinateToScreen(focusPlayer.getX() + 0.5), this.convertTileYCoordinateToScreen(topY + 0.5));
        }

        this.board.getPlayers().forEach((player)=>{
            if(player.playerID === this.cameraFocusPlayerID){
                return;
            }
            this.ctx.fillStyle = 'blue';
            this.ctx.strokeStyle = 'black';
            //this.ctx.beginPath();

            //Player X and Y is in the bottom center of the player rectangle
            let leftX = player.getX() + 0.5 - Player_Width_Tiles/2;
            let rightX = player.getX() + 0.5 + Player_Width_Tiles/2;
            let bottomY = player.getY();
            let topY = player.getY() + Player_Height_Tiles;

            let facing = 0;
            if(player.movingLeft){
                facing = 9;
            }
            else if(player.movingRight){
                facing = 5;
            }
            else if(player.jumping){
                facing = 8;
            }
            else{
                facing = 7;
            }

            this.ctx.drawImage(this.playerSpriteSheet, Sprite_X_Start + Sprite_Horizontal_Distance * facing, 0, Sprite_Width, 44,  this.convertTileXCoordinateToScreen(leftX), this.convertTileYCoordinateToScreen(topY) + 6, Sprite_Width, 44);


            /*this.ctx.moveTo(this.convertTileXCoordinateToScreen(leftX), this.convertTileYCoordinateToScreen(bottomY));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(rightX), this.convertTileYCoordinateToScreen(bottomY));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(rightX), this.convertTileYCoordinateToScreen(topY));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(leftX), this.convertTileYCoordinateToScreen(topY));

            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();*/

            this.ctx.fillStyle = 'red';
            this.ctx.font = '20px Helvetica';
            this.ctx.textAlign="center";
            this.ctx.fillText(player.getName(), this.convertTileXCoordinateToScreen(player.getX() + 0.5), this.convertTileYCoordinateToScreen(topY + 0.5));
        });

        this.ctx.restore();

        this.foregroundTileLayerRenderer.draw(this.board);
        this.ctx.drawImage(this.foregroundTileLayerRenderer.getCanvas(), 0, 0);


        //Draw color selector
        /*this.ctx.strokeStyle = 'black';
        for (let square of this.colorSquareOptions) {
            this.ctx.fillStyle = square.getColor();
            this.ctx.strokeRect(square.getX(), square.getY(), square.getWidth(), square.getHeight());
            this.ctx.fillRect(square.getX(), square.getY(), square.getWidth(), square.getHeight());
            this.ctx.stroke();
        }*/

        //Draw preview square for color selection using slider/picker system
        /*this.ctx.fillStyle = this.previewSquare.getColor();
        this.ctx.strokeRect(this.previewSquare.getX(), this.previewSquare.getY(), this.previewSquare.getWidth(), this.previewSquare.getHeight());
        this.ctx.fillRect(this.previewSquare.getX(), this.previewSquare.getY(), this.previewSquare.getWidth(), this.previewSquare.getHeight());
        this.ctx.stroke();*/
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

    convertScreenCoordinateToTile = (oldPoint) => {
        let point = new Point(oldPoint.x, oldPoint.y);

        point.y -= this.canvas.height * 0.5;
        point.x -= this.canvas.width/2;
        point.y /= -1;
        point.y /= Tile_Height;
        point.x /= Tile_Width;
        point.y += 0.5;
        point.x += 0.5;
        point.y += this.cameraFocusTileY;
        point.x += this.cameraFocusTileX;
        point.x = Math.floor(point.x);
        point.y = Math.floor(point.y);

        return point;
    };

    convertScreenXCoordinateToTile = (x) => {
        x -= this.canvas.width/2;
        x /= Tile_Width;
        x += 0.5;
        x += this.cameraFocusTileX;
        x = Math.floor(x);
        return x;
    };
    convertScreenYCoordinateToTile = (y) => {
        y -= this.canvas.height * 0.5;
        y /= -1;
        y /= Tile_Height;
        y += 0.5;
        y += this.cameraFocusTileY;
        y = Math.floor(y);
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
        //check if eyedropper enabled
        if(!this.eyeDropperOn){
            //Handle tile placement
            this.previouslyPlacedTileX = null;
            this.previouslyPlacedTileY = null;
            this.mouseDown = true;
            //Get tile position
            let mousePosition = this.getMousePosition(event);
            this.previouslyPlacedTileX = this.convertScreenXCoordinateToTile(mousePosition.x);
            this.previouslyPlacedTileY = this.convertScreenYCoordinateToTile(mousePosition.y);
            this.placeTile(this.previouslyPlacedTileX, this.previouslyPlacedTileY);

        } else {
            //get mouse coordinates
            let mousePosition = this.getMousePosition(event);
            //get information about pixel at mouse coordinates from canvas
            let pixelInfo = this.ctx.getImageData(mousePosition.x, mousePosition.y, 1, 1);

            //pull red data
            let pixelRed = pixelInfo.data[0];
            //pull green data
            let pixelGreen = pixelInfo.data[1];
            //pull blue data
            let pixelBlue = pixelInfo.data[2];
            //pull alpha data
            let pixelAlpha = pixelInfo.data[3];

            //set background color to a hex representation of the value pulled from canvas
            //this.previewColor = '#' + this.rgbToHex(pixelRed) + this.rgbToHex(pixelGreen) + this.rgbToHex(pixelBlue);
            //set background color to a rgba representation of the value pulled from canvas
            this.previewColor = 'rgba(' + pixelRed + ", " + pixelGreen + ", " + pixelBlue + ", " + pixelAlpha/255 + ")";

            //set slider values to color selected
            this.redSlider.value = pixelRed;
            this.greenSlider.value = pixelGreen;
            this.blueSlider.value = pixelBlue;
            this.alphaSlider.value = pixelAlpha;
            //switch cursor in canvas back to standard pointer
            this.canvas.style.cursor = "";

            //turn off the eyedropper
            this.eyeDropperOn = false;
        }
    };

    onMouseMove = (event) => {
        //possible preview window for eyedropper color picking goes here
        if(!this.eyeDropperOn){
            //Handle tile placement
            if (this.mouseDown) {
                //Get tile position
                let mousePosition = this.getMousePosition(event);
                let tileX = this.convertScreenXCoordinateToTile(mousePosition.x);
                let tileY = this.convertScreenYCoordinateToTile(mousePosition.y);
                if (this.previouslyPlacedTileX !== tileX || this.previouslyPlacedTileY !== tileY) {
                    this.previouslyPlacedTileX = tileX;
                    this.previouslyPlacedTileY = tileY;

                    this.placeTile(this.previouslyPlacedTileX, this.previouslyPlacedTileY);
                }
            }

        } else {
            //get mouse coordinates
            let mousePosition = this.getMousePosition(event);
            //get information about pixel at mouse coordinates from canvas
            let pixelInfo = this.ctx.getImageData(mousePosition.x, mousePosition.y, 1, 1);

            //pull red data
            let pixelRed = pixelInfo.data[0];
            //pull green data
            let pixelGreen = pixelInfo.data[1];
            //pull blue data
            let pixelBlue = pixelInfo.data[2];
            //pull alpha data
            let pixelAlpha = pixelInfo.data[3];

            //set background color to a hex representation of the value pulled from canvas
            //this.previewColor = '#' + this.rgbToHex(pixelRed) + this.rgbToHex(pixelGreen) + this.rgbToHex(pixelBlue);
            //set background color to a rgba representation of the value pulled from canvas
            //this.previewColor = 'rgba(' + pixelRed + ", " + pixelGreen + ", " + pixelBlue + ", " + pixelAlpha + ")";

            this.previewSquare.style.backgroundColor = 'rgba(' + pixelRed + ", " + pixelGreen + ", " + pixelBlue + ", " + pixelAlpha/255 + ")";

            //set slider values to color selected
            this.redSlider.value = pixelRed;
            this.greenSlider.value = pixelGreen;
            this.blueSlider.value = pixelBlue;
            this.alphaSlider.value = pixelAlpha;

            //turn off the eyedropper
            //this.eyeDropperOn = false;

            this.updateSliderLabels();
        }
    };

    onMouseUp = (event) => {
        this.previouslyPlacedTileX = null;
        this.previouslyPlacedTileY = null;
        this.mouseDown = false;
    };

    onKeyDown = (event) => {
        //Left
        if (event.keyCode === 37 && this.leftPressed === false) {
            this.leftPressed = true;
            Network.Send(GameMessageCreator.MovingLeft(this.leftPressed));
        }
        //Right
        if (event.keyCode === 39 && this.rightPressed === false) {
            this.rightPressed = true;
            Network.Send(GameMessageCreator.MovingRight(this.rightPressed));
        }
        //Up
        if (event.keyCode === 38 && this.upPressed === false) {
            this.upPressed = true;
            Network.Send(GameMessageCreator.Jumping(this.upPressed));
        }
        //Down
        if (event.keyCode === 40 && this.downPressed === false) {
            this.downPressed = true;
        }
    };

    onKeyUp = (event) => {
        //Left
        if (event.keyCode === 37 && this.leftPressed === true) {
            this.leftPressed = false;
            this.facingIndex = 10;
            this.frameNextNumber = 0;
            this.frameNumber = 0;
            Network.Send(GameMessageCreator.MovingLeft(this.leftPressed));
        }
        //Right
        if (event.keyCode === 39 && this.rightPressed === true) {
            this.rightPressed = false;
            this.facingIndex = 4;
            this.frameNextNumber = 0;
            this.frameNumber = 0;
            Network.Send(GameMessageCreator.MovingRight(this.rightPressed));
        }
        //Up
        if (event.keyCode === 38 && this.upPressed === true) {
            this.upPressed = false;
            this.facingIndex = 4;
            Network.Send(GameMessageCreator.Jumping(this.upPressed));
        }
        //Down
        if (event.keyCode === 40 && this.downPressed === true) {
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
            this.backgroundTileLayerRenderer.setSize(cssWidth, cssHeight);
            this.solidTileLayerRenderer.setSize(cssWidth, cssHeight);
            this.foregroundTileLayerRenderer.setSize(cssWidth, cssHeight);
        }
    };

    setVisibility = (visible) => {
        this.visible = visible;
        this.canvas.focus();
    };

    getCanvas = () => {
        return this.canvas;
    };

    getGreenSlider = () => {
        return this.greenSlider;
    };

    getRedSlider = () => {
        return this.redSlider;
    };

    getBlueSlider = () => {
        return this.blueSlider;
    };

    getAlphaSlider = () => {
        return this.alphaSlider;
    };

    getEyeDropButton = () => {
        return this.eyeDropButton;
    };

    getTileSelector = () => {
        return this.tileSelector;
    };

    getPreviewSquare = () => {
        return this.previewSquare;
    };

    changePreviewColor = () => {
        let rh = parseInt(this.redSlider.value, 10);
        let gh = parseInt(this.greenSlider.value, 10);
        let bh = parseInt(this.blueSlider.value, 10);
        let ah = parseFloat(this.alphaSlider.value, 10);

        this.previewSquare.style.backgroundColor = 'rgba(' + rh + ", " + gh + ", " + bh + ", " + ah/255 + ")";
        this.updateSliderLabels();

    };

    eyeDropButtonClicked = () => {
        this.canvas.style.cursor = "crosshair";
        this.eyeDropperOn = true;
    };

    updateSliderLabels = () => {
        this.rgbaLabel.childNodes[4].innerText = this.redSlider.value;
        this.rgbaLabel.childNodes[5].innerText = this.greenSlider.value;
        this.rgbaLabel.childNodes[6].innerText = this.blueSlider.value;
        this.rgbaLabel.childNodes[7].innerText = this.alphaSlider.value;
    }
}