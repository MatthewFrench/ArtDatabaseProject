import {Interface} from "../../../Utility/Interface";
import {Board} from "./Board";
import {Point} from "./Point";
import {TileLayerRenderer} from "./TileLayerRenderer/TileLayerRenderer";
import {PhysicsLogic} from "./PhysicsLogic";
import {GameMessageCreator} from "../../../Networking/Game/GameMessageCreator";
import {Network} from "../../../Networking/Network";
import spriteSheet from "../../../../Images/walkcyclevarious.png";
import bgAudio from "../../../../Audio/PatakasWorld.wav";
import {NanoTimer} from "../../../Utility/Nanotimer";

const Tile_Height = 10;
const Tile_Width = 10;
const Player_Width_Tiles = 2;
const Player_Height_Tiles = 5;
const Sprite_Width = 26;
const Sprite_Horizontal_Distance = 64;
const Sprite_Vertical_Table = [0, 0, 59, 123, 185, 246, 307, 368, 432];
const Sprite_X_Start = 22;

const Background_Tile_Type = 3;
const Solid_Tile_Type = 4;
const Foreground_Tile_Type = 5;
const Deleted_Tile_Type = 6;

const Target_FPS = 60.0;

export class GameLogic {
    constructor() {
        this.redSlider = Interface.Create({type: 'input', className: 'RedSlider',  inputType: 'range', min: 0, max: 255, step: 1, value: 0, onChange: this.changePreviewColor});
        this.greenSlider = Interface.Create({type: 'input', className: 'GreenSlider',  inputType: 'range', min: 0, max: 255, step: 1, value: 0, onChange: this.changePreviewColor});
        this.blueSlider = Interface.Create({type: 'input', className: 'BlueSlider',  inputType: 'range', min: 0, max: 255, step: 1, value: 0, onChange: this.changePreviewColor});
        this.alphaSlider = Interface.Create({type: 'input', className: 'AlphaSlider',  inputType: 'range', min: 0, max: 255, step: 1, value: 255, onChange: this.changePreviewColor});
        
        this.volumeSlider = Interface.Create({type: 'input', className:'VolumeSlider', inputType: 'range', min: 0, max: 100, step: 1, value: 15, onChange: this.updateVolume});

        this.bgAudio = new Audio(bgAudio);
        this.bgAudio.volume = 0.15;
        this.bgAudio.loop = true;

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
            this.foregroundTypeButton = Interface.Create({type: 'div', text: 'Foreground', className: 'ForegroundButton', onClick: this.foregroundTileTypeClicked}),
            this.toolSelector = Interface.Create({type: 'div', className: 'toolSelector', elements: [
                {type: 'span', text: 'Tools', className: 'toolLabel'},
                this.drawToolButton = Interface.Create({type: 'div', text: 'Draw', className: 'drawTool Selected', onClick: this.drawToolClicked}),
                this.layerToolButton = Interface.Create({type: 'div', text: 'Set Layer', className: 'layerTool', onClick: this.layerToolClicked}),
                this.fillToolButton = Interface.Create({type: 'div', text: 'Fill', className: 'fillTool', onClick: this.fillToolClicked}),
                this.eyeDropButton = Interface.Create({type: 'div', text: 'Eye Drop', className: 'EyeDropButton', onClick: this.eyeDropButtonClicked})
            ]})
        ]});
        //holds the value of the color to be used for a tile
        this.previewSquare = Interface.Create({type: 'div', className: 'PreviewSquare'});
        this.eyeDropperOn = false;
        this.layerOn = false;
        this.drawOn = true;
        this.fillOn = false;
        this.playerSpriteSheet = new Image();
        this.playerSpriteSheet.src = spriteSheet;
        //this.frameNumber = 0;
        //this.frameNextNumber = 0;
        //this.facingIndex = 4;

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
        //this.updateSliderLabels();

        this.logicTimer = new NanoTimer(this.logicLoop, 1000.0/Target_FPS);
        this.logicTimer.start();
        this.drawLoop();
    }

    focusOnGameCanvas = () => {
        this.canvas.focus();
    };

    backgroundTileTypeClicked = () => {
        this.deleteTypeButton.classList.remove('Selected');
        this.solidTypeButton.classList.remove('Selected');
        this.foregroundTypeButton.classList.remove('Selected');
        this.backgroundTypeButton.classList.add('Selected');
        this.currentTileType = Background_Tile_Type;
        this.focusOnGameCanvas();
    };
    solidTileTypeClicked = () => {
        this.deleteTypeButton.classList.remove('Selected');
        this.solidTypeButton.classList.add('Selected');
        this.foregroundTypeButton.classList.remove('Selected');
        this.backgroundTypeButton.classList.remove('Selected');
        this.currentTileType = Solid_Tile_Type;
        this.focusOnGameCanvas();
    };
    foregroundTileTypeClicked = () => {
        this.deleteTypeButton.classList.remove('Selected');
        this.solidTypeButton.classList.remove('Selected');
        this.foregroundTypeButton.classList.add('Selected');
        this.backgroundTypeButton.classList.remove('Selected');
        this.currentTileType = Foreground_Tile_Type;
        this.focusOnGameCanvas();
    };
    deleteTileTypeClicked = () => {
        this.deleteTypeButton.classList.add('Selected');
        this.solidTypeButton.classList.remove('Selected');
        this.foregroundTypeButton.classList.remove('Selected');
        this.backgroundTypeButton.classList.remove('Selected');
        this.currentTileType = Deleted_Tile_Type;
        this.focusOnGameCanvas();
    };

    drawToolClicked = () => {
        this.drawToolButton.classList.add('Selected');
        this.layerToolButton.classList.remove('Selected');
        this.fillToolButton.classList.remove('Selected');
        this.layerOn = false;
        this.drawOn = true;
        this.canvas.style.cursor = "";
        //add tool type
        this.focusOnGameCanvas();
    };

    layerToolClicked = () => {
        this.layerToolButton.classList.add('Selected');
        this.drawToolButton.classList.remove('Selected');
        this.fillToolButton.classList.remove('Selected');
        this.layerOn = true;
        this.drawOn = false;
        this.fillOn = false;
        this.canvas.style.cursor = "alias";
        //add tool type
        this.focusOnGameCanvas();
    };

    fillToolClicked = () => {
        this.fillToolButton.classList.add('Selected');
        this.layerToolButton.classList.remove('Selected');
        this.layerToolButton.classList.remove('Selected');
        this.layerOn = false;
        this.drawOn = false;
        this.fillOn = true;
        this.canvas.style.cursor = "";
        //add tool type
        this.focusOnGameCanvas();
    };

    resetBoardToNewBoard = (boardID) => {
        this.board = new Board(boardID);
    };

    updateTile = (x, y, typeID, r, g, b, a) => {
        this.board.setTile(x, y, typeID, r, g, b, a);
    };

    addPlayer = (playerID, spriteID, name, x, y, speedX, speedY, movingLeft, movingRight, jumping) => {
        /*let player = */this.board.addPlayer(playerID, spriteID, name, x, y, speedX, speedY, movingLeft, movingRight, jumping);
        //this.physicsLogic.addPlayerBody(player);
    };

    removePlayer = (playerID) => {
        this.board.removePlayer(playerID);
    };

    updatePlayer = (playerID, spriteID, x, y, speedX, speedY, movingLeft, movingRight, jumping) => {
        this.board.updatePlayer(playerID, spriteID, x, y, speedX, speedY, movingLeft, movingRight, jumping);
        //Fast forward the player by the ping
        let fastForwardDelta = (Network.GetPing() / 2.0) / (1000.0 / Target_FPS);
        while (fastForwardDelta > 1.0) {
            this.physicsLogic.runPlayerPhysicsLogic(this.board.getPlayer(playerID), 1.0);
            fastForwardDelta -= 1.0;
        }
        this.physicsLogic.runPlayerPhysicsLogic(this.board.getPlayer(playerID), fastForwardDelta);
    };

    setPlayerFocusID = (cameraFocusPlayerID) => {
        this.cameraFocusPlayerID = cameraFocusPlayerID;
    };

    //Called by the mouse handler to set a tile change to the server
    placeTile = (x, y) => {
        Network.Send(GameMessageCreator.SetTile(x, y, this.currentTileType, parseInt(this.redSlider.value),
            parseInt(this.greenSlider.value), parseInt(this.blueSlider.value), parseInt(this.alphaSlider.value)));
    };
    placeLayer = (x, y, tileType, r, g, b, a) => {
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

    logicLoop = (delta) => {
        if (this.visible) {
            this.logic(delta);
        }
    };

    drawLoop = () => {
        window.requestAnimationFrame(this.drawLoop);
        if (this.visible) {
            this.draw();
        }
    };

    logic = (delta) => {
        this.physicsLogic.logic(this.board, delta);
    };

    draw = () => {
        let focusPlayer = this.board.getPlayer(this.cameraFocusPlayerID);
        if (focusPlayer !== null) {
            this.cameraFocusTileX = focusPlayer.getX();
            this.cameraFocusTileY = focusPlayer.getY();
        }
        this.backgroundTileLayerRenderer.setFocusTilePosition(this.cameraFocusTileX, this.cameraFocusTileY);
        this.solidTileLayerRenderer.setFocusTilePosition(this.cameraFocusTileX, this.cameraFocusTileY);
        this.foregroundTileLayerRenderer.setFocusTilePosition(this.cameraFocusTileX, this.cameraFocusTileY);

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
        /*
        if (focusPlayer !== null) {
            focusPlayer.updateSpriteFrame();
            let leftX = focusPlayer.getX() + 0.5 - Player_Width_Tiles/2;
            let rightX = focusPlayer.getX() + 0.5 + Player_Width_Tiles/2;
            let bottomY = focusPlayer.getY();
            let topY = focusPlayer.getY() + Player_Height_Tiles;
            let spriteID = focusPlayer.getSpriteID();
            this.ctx.drawImage(this.playerSpriteSheet, Sprite_X_Start + Sprite_Horizontal_Distance * focusPlayer.getSpriteFrame(),
                Sprite_Vertical_Table[spriteID], Sprite_Width, 44,
                this.convertTileXCoordinateToScreen(leftX), this.convertTileYCoordinateToScreen(topY) + 6, Sprite_Width, 44);
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            this.ctx.font = '20px Helvetica';
            this.ctx.textAlign="center";
            this.ctx.fillText(focusPlayer.getName(), this.convertTileXCoordinateToScreen(focusPlayer.getX() + 0.5), this.convertTileYCoordinateToScreen(topY + 0.5));

            this.ctx.beginPath();
            this.ctx.moveTo(this.convertTileXCoordinateToScreen(leftX), this.convertTileYCoordinateToScreen(bottomY));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(rightX), this.convertTileYCoordinateToScreen(bottomY));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(rightX), this.convertTileYCoordinateToScreen(topY));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(leftX), this.convertTileYCoordinateToScreen(topY));

            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();

            //Draw center tile of the player
            this.ctx.strokeColor = 'black';
            this.ctx.fillColor = 'blue';
            this.ctx.beginPath();
            this.ctx.moveTo(this.convertTileXCoordinateToScreen(focusPlayer.getX()), this.convertTileYCoordinateToScreen(focusPlayer.getY()));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(focusPlayer.getX() + 1.0), this.convertTileYCoordinateToScreen(focusPlayer.getY()));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(focusPlayer.getX() + 1.0), this.convertTileYCoordinateToScreen(focusPlayer.getY() + 1.0));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(focusPlayer.getX()), this.convertTileYCoordinateToScreen(focusPlayer.getY() + 1.0));

            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }*/

        this.board.getPlayers().forEach((player)=>{
            //if(player.playerID === this.cameraFocusPlayerID){
            //    return;
            //}
            player.updateSpriteFrame();

            //Player X and Y is in the bottom center of the player rectangle
            let leftX = player.getX() + 0.5 - Player_Width_Tiles/2;
            let rightX = player.getX() + 0.5 + Player_Width_Tiles/2;
            let bottomY = player.getY();
            let topY = player.getY() + Player_Height_Tiles;

            this.ctx.drawImage(this.playerSpriteSheet, Sprite_X_Start + Sprite_Horizontal_Distance * player.getSpriteFrame(),
                Sprite_Vertical_Table[player.getSpriteID()], Sprite_Width, 44,  this.convertTileXCoordinateToScreen(leftX), this.convertTileYCoordinateToScreen(topY) + 6, Sprite_Width, 44);

            this.ctx.fillStyle = 'blue';
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            this.ctx.beginPath();
            this.ctx.moveTo(this.convertTileXCoordinateToScreen(leftX), this.convertTileYCoordinateToScreen(bottomY));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(rightX), this.convertTileYCoordinateToScreen(bottomY));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(rightX), this.convertTileYCoordinateToScreen(topY));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(leftX), this.convertTileYCoordinateToScreen(topY));

            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
            
            //Draw center tile of the player
            this.ctx.strokeColor = 'black';
            this.ctx.fillColor = 'blue';
            this.ctx.beginPath();
            this.ctx.moveTo(this.convertTileXCoordinateToScreen(player.getX()), this.convertTileYCoordinateToScreen(player.getY()));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(player.getX() + 1.0), this.convertTileYCoordinateToScreen(player.getY()));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(player.getX() + 1.0), this.convertTileYCoordinateToScreen(player.getY() + 1.0));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(player.getX()), this.convertTileYCoordinateToScreen(player.getY() + 1.0));

            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();

            this.ctx.fillStyle = 'red';
            this.ctx.font = '20px Helvetica';
            this.ctx.textAlign="center";
            this.ctx.fillText(player.getName(), Math.round(this.convertTileXCoordinateToScreen(player.getX() + 0.5)), Math.round(this.convertTileYCoordinateToScreen(topY + 0.5)));
        });

        this.ctx.restore();

        this.foregroundTileLayerRenderer.draw(this.board);
        this.ctx.drawImage(this.foregroundTileLayerRenderer.getCanvas(), 0, 0);

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, this.canvas.height - 20, 55, 30);
        this.ctx.fillStyle = 'rgb(0, 255, 0)';
        this.ctx.font = '15px Helvetica';
        this.ctx.textAlign="center";
        this.ctx.fillText(`${Math.floor(Network.GetPing())} ms`, 25, this.canvas.height - 4);
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
        if(!this.eyeDropperOn && !this.layerOn){
            //Handle tile placement
            this.previouslyPlacedTileX = null;
            this.previouslyPlacedTileY = null;
            this.mouseDown = true;
            //Get tile position
            let mousePosition = this.getMousePosition(event);
            this.previouslyPlacedTileX = this.convertScreenXCoordinateToTile(mousePosition.x);
            this.previouslyPlacedTileY = this.convertScreenYCoordinateToTile(mousePosition.y);
            this.placeTile(this.previouslyPlacedTileX, this.previouslyPlacedTileY);

        }
        else if (this.eyeDropperOn) {
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

        else if(this.layerOn){
                //get mouse coordinates
                let mousePosition = this.getMousePosition(event);
                //get information about pixel at mouse coordinates from canvas
                let pixelInfo = this.ctx.getImageData(mousePosition.x, mousePosition.y, 1, 1);
                let tileX = this.convertScreenXCoordinateToTile(mousePosition.x);
                let tileY = this.convertScreenYCoordinateToTile(mousePosition.y);

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
                //Handle tile placement
                this.previouslyPlacedTileX = null;
                this.previouslyPlacedTileY = null;
                this.mouseDown = true;
                //Get tile position
                this.previouslyPlacedTileX = this.convertScreenXCoordinateToTile(mousePosition.x);
                this.previouslyPlacedTileY = this.convertScreenYCoordinateToTile(mousePosition.y);
                this.placeLayer(tileX, tileY, this.currentTileType, this.redSlider.value, this.greenSlider.value, this.blueSlider.value, this.alphaSlider.value );
                //this.layerOn = false;
                this.canvas.cursor = '';
            }
    };

    onMouseMove = (event) => {
        //possible preview window for eyedropper color picking goes here
        if(!this.eyeDropperOn && !this.layerOn){
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
            let tileX = this.convertScreenXCoordinateToTile(mousePosition.x);
            let tileY = this.convertScreenYCoordinateToTile(mousePosition.y);

            if(this.eyeDropperOn){
                //Set current tile type to eyedrop
                let tile = this.board.getTile(tileX, tileY);
                if(tile != null){
                    switch (tile.getTypeID()){
                        case 3: this.backgroundTileTypeClicked();
                            break;
                        case 4: this.solidTileTypeClicked();
                            break;
                        case 5: this.foregroundTileTypeClicked();
                            break;
                        case 6: this.deleteTileTypeClicked();
                            break;
                    }
                }
            }





            //pull red data
            let pixelRed = pixelInfo.data[0];
            //pull green data
            let pixelGreen = pixelInfo.data[1];
            //pull blue data
            let pixelBlue = pixelInfo.data[2];
            //pull alpha data
            let pixelAlpha = pixelInfo.data[3];

            this.previewSquare.style.backgroundColor = 'rgba(' + pixelRed + ", " + pixelGreen + ", " + pixelBlue + ", " + pixelAlpha/255 + ")";

            //set slider values to color selected
            this.redSlider.value = pixelRed;
            this.greenSlider.value = pixelGreen;
            this.blueSlider.value = pixelBlue;
            this.alphaSlider.value = pixelAlpha;

            //turn off the eyedropper
            //this.eyeDropperOn = false;
            if(this.mouseDown){
                this.placeLayer(tileX, tileY, this.currentTileType, this.redSlider.value, this.greenSlider.value, this.blueSlider.value, this.alphaSlider.value );

            }

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
        if ((event.keyCode === 37 || event.keyCode === 65) && this.leftPressed === false) {
            this.leftPressed = true;
            Network.Send(GameMessageCreator.MovingLeft(this.leftPressed));
        }
        //Right
        if ((event.keyCode === 39 || event.keyCode === 68) && this.rightPressed === false) {
            this.rightPressed = true;
            Network.Send(GameMessageCreator.MovingRight(this.rightPressed));
        }
        //Up
        if ((event.keyCode === 38 || event.keyCode === 87) && this.upPressed === false) {
            this.upPressed = true;
            Network.Send(GameMessageCreator.Jumping(this.upPressed));
        }
        //Down
        if ((event.keyCode === 40 || event.keyCode === 83) && this.downPressed === false) {
            this.downPressed = true;
        }
    };

    onKeyUp = (event) => {
        //Left
        if ((event.keyCode === 37 || event.keyCode === 65) && this.leftPressed === true) {
            this.leftPressed = false;
            //this.facingIndex = 10;
            //this.frameNextNumber = 0;
            //this.frameNumber = 0;
            Network.Send(GameMessageCreator.MovingLeft(this.leftPressed));
        }
        //Right
        if ((event.keyCode === 39 || event.keyCode === 68) && this.rightPressed === true) {
            this.rightPressed = false;
            //this.facingIndex = 4;
            //this.frameNextNumber = 0;
            //this.frameNumber = 0;
            Network.Send(GameMessageCreator.MovingRight(this.rightPressed));
        }
        //Up
        if ((event.keyCode === 38 || event.keyCode === 87) && this.upPressed === true) {
            this.upPressed = false;
            //this.facingIndex = 4;
            Network.Send(GameMessageCreator.Jumping(this.upPressed));
        }
        //Down
        if ((event.keyCode === 40 || event.keyCode === 83) && this.downPressed === true) {
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
        if(visible){
            this.startMusic();
        }
        else{
            this.stopMusic();
        }
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

    getToolSelector = () => {
        return this.toolSelector;
    };

    getTileSelector = () => {
        return this.tileSelector;
    };

    getPreviewSquare = () => {
        return this.previewSquare;
    };

    getVolumeSlider = () => {
        return this.volumeSlider;
    };

    changePreviewColor = () => {
        let rh = parseInt(this.redSlider.value, 10);
        let gh = parseInt(this.greenSlider.value, 10);
        let bh = parseInt(this.blueSlider.value, 10);
        let ah = parseFloat(this.alphaSlider.value, 10);

        this.previewSquare.style.backgroundColor = 'rgba(' + rh + ", " + gh + ", " + bh + ", " + ah/255 + ")";
        this.updateSliderLabels();

        this.focusOnGameCanvas();
    };

    updateVolume = () => {
        let volume = parseInt(this.volumeSlider.value, 10);
        this.bgAudio.volume = volume / 100;
    };

    startMusic = () => {
        this.bgAudio.play();
    };

    stopMusic = () => {
        this.bgAudio.pause();
    };

    eyeDropButtonClicked = () => {
        this.canvas.style.cursor = "crosshair";
        this.eyeDropperOn = true;
        this.focusOnGameCanvas();
    };

    updateSliderLabels = () => {
        this.rgbaLabel.childNodes[4].innerText = this.redSlider.value;
        this.rgbaLabel.childNodes[5].innerText = this.greenSlider.value;
        this.rgbaLabel.childNodes[6].innerText = this.blueSlider.value;
        this.rgbaLabel.childNodes[7].innerText = this.alphaSlider.value;
    }
}