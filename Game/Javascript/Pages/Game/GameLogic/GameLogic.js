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
import {Stopwatch} from "../../../Utility/Stopwatch";

const Tile_Height = 10;
const Tile_Width = 10;
const Player_Width_Tiles = 2;
const Player_Height_Tiles = 5;
const Sprite_Width = 26;
const Sprite_Horizontal_Distance = 64;
const Sprite_Vertical_Table = [0, -10, 52, 112, 172, 233, 294, 355, 418];
const Sprite_X_Start = 22;

const Background_Tile_Type = 3;
const Solid_Tile_Type = 4;
const Foreground_Tile_Type = 5;
const Deleted_Tile_Type = 6;

const Target_FPS = 60.0;

//Static variables for providing access to the renderer in TileChunk
let BackgroundTileLayerRenderer;
let ForegroundTileLayerRenderer;

export class GameLogic {
    constructor() {
        this.rgbaSelector = Interface.Create({
            type: 'div', className: 'rgbaSelector', elements: [
                this.redSlider = Interface.Create({
                    type: 'input',
                    className: 'RedSlider',
                    inputType: 'range',
                    min: 0,
                    max: 255,
                    step: 1,
                    value: 0,
                    onChange: this.changePreviewColor
                }),
                this.greenSlider = Interface.Create({
                    type: 'input',
                    className: 'GreenSlider',
                    inputType: 'range',
                    min: 0,
                    max: 255,
                    step: 1,
                    value: 0,
                    onChange: this.changePreviewColor
                }),
                this.blueSlider = Interface.Create({
                    type: 'input',
                    className: 'BlueSlider',
                    inputType: 'range',
                    min: 0,
                    max: 255,
                    step: 1,
                    value: 0,
                    onChange: this.changePreviewColor
                }),
                this.alphaSlider = Interface.Create({
                    type: 'input',
                    className: 'AlphaSlider',
                    inputType: 'range',
                    min: 0,
                    max: 255,
                    step: 1,
                    value: 255,
                    onChange: this.changePreviewColor
                }),
                this.rgbaLabel = Interface.Create({
                    type: 'div', className: 'RGBALabel', elements: [
                        {type: 'div', text: 'R', className: 'RedLabel'},
                        {type: 'div', text: 'G', className: 'GreenLabel'},
                        {type: 'div', text: 'B', className: 'BlueLabel'},
                        {type: 'div', text: 'A', className: 'AlphaLabel'},
                        {type: 'div', text: '255', className: 'RedValue'},
                        {type: 'div', text: '255', className: 'GreenValue'},
                        {type: 'div', text: '255', className: 'BlueValue'},
                        {type: 'div', text: '255', className: 'AlphaValue'},
                    ]
                })
            ]
        });


        this.volumeSlider = Interface.Create({
            type: 'input',
            className: 'VolumeSlider',
            inputType: 'range',
            min: 0,
            max: 100,
            step: 1,
            value: 15,
            onChange: this.updateVolume
        });

        this.bgAudio = new Audio(bgAudio);
        this.bgAudio.volume = 0.15;
        this.bgAudio.loop = true;

        this.tileSelector = Interface.Create({
            type: 'div', className: 'TileSelector', elements: [
                {type: 'div', text: 'Tile Type', className: 'TileLabel'},
                this.deleteTypeButton = Interface.Create({
                    type: 'div',
                    text: 'Delete (1)',
                    className: 'DeleteButton',
                    onClick: this.deleteTileTypeClicked
                }),
                this.backgroundTypeButton = Interface.Create({
                    type: 'div',
                    text: 'Background (2)',
                    className: 'BackgroundButton',
                    onClick: this.backgroundTileTypeClicked
                }),
                this.solidTypeButton = Interface.Create({
                    type: 'div',
                    text: 'Solid (3)',
                    className: 'SolidButton Selected',
                    onClick: this.solidTileTypeClicked
                }),
                this.foregroundTypeButton = Interface.Create({
                    type: 'div',
                    text: 'Foreground (4)',
                    className: 'ForegroundButton',
                    onClick: this.foregroundTileTypeClicked
                }),
                this.toolSelector = Interface.Create({
                    type: 'div', className: 'toolSelector', elements: [
                        {type: 'span', text: 'Tools', className: 'toolLabel'},
                        this.drawToolButton = Interface.Create({
                            type: 'div',
                            text: 'Draw (Q)',
                            className: 'drawTool Selected',
                            onClick: this.drawToolClicked
                        }),
                        this.layerToolButton = Interface.Create({
                            type: 'div',
                            text: 'Set Layer (L)',
                            className: 'layerTool',
                            onClick: this.layerToolClicked
                        }),
                        this.fillToolButton = Interface.Create({
                            type: 'div',
                            text: 'Fill (F)',
                            className: 'fillTool',
                            onClick: this.fillToolClicked
                        }),
                        this.eyeDropButton = Interface.Create({
                            type: 'div',
                            text: 'Eye Drop (E)',
                            className: 'EyeDropButton',
                            onClick: this.eyeDropButtonClicked
                        }),
                        this.addObjectButton = Interface.Create({
                            type: 'div',
                            text: 'Add Object',
                            className: 'AddObjectButton',
                            onClick: this.addObjectButtonClicked
                        }),
                        this.objectSelector = Interface.Create({
                            type: 'select', className: 'objectSelector', elements: [
                                {type: 'option', text: 'Coin'},
                                {type: 'option', text: 'Spawn'}
                            ]
                        }),
                        this.deleteObjectButton = Interface.Create({
                            type: 'div',
                            text: 'Delete Object',
                            className: 'DeleteObjectButton',
                            onClick: this.deleteObjectButtonClicked
                        })
                    ]
                })
            ]
        });
        //holds the value of the color to be used for a tile
        this.previewSquare = Interface.Create({type: 'div', className: 'PreviewSquare'});
        this.eyeDropperOn = false;
        this.layerOn = false;
        this.drawOn = true;
        this.fillOn = false;
        this.playerSpriteSheet = new Image();
        this.playerSpriteSheet.src = spriteSheet;

        this.canvas = Interface.Create({
            type: 'canvas', className: 'Canvas2D',
            onMouseDown: this.onMouseDown, onKeyDown: this.onKeyDown, onKeyUp: this.onKeyUp,
            onMouseMove: this.onMouseMove, onMouseUp: this.onMouseUp
        });
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

        //this.backgroundTileLayerRenderer = new TileLayerRenderer(1000, 800, Background_Tile_Type);
        this.backgroundTileLayerRenderer = new TileLayerRenderer('CanvasWebGLBackground', 1000, 800, true);
        BackgroundTileLayerRenderer = this.backgroundTileLayerRenderer;
        this.foregroundTileLayerRenderer = new TileLayerRenderer('CanvasWebGLForeground', 1000, 800, false);
        ForegroundTileLayerRenderer = this.foregroundTileLayerRenderer;
        //this.foregroundTileLayerRenderer = new TileLayerRenderer(1000, 800, Foreground_Tile_Type);

        //this.tileChunkRenderer = new TileChunkRenderer();


        this.mainDiv = Interface.Create({
            type: 'div', className: 'GameArea', elements: [
                this.backgroundTileLayerRenderer.getCanvas(),
                this.canvas,
                this.foregroundTileLayerRenderer.getCanvas()
            ]
        });

        this.redSlider.value = 0;
        this.greenSlider.value = 0;
        this.blueSlider.value = 0;
        this.alphaSlider.value = 255;
        this.changePreviewColor();
        //this.updateSliderLabels();

        this.logicTimer = new NanoTimer(this.logicLoop, 1000.0 / Target_FPS);
        this.logicTimer.start();

        this.drawStopwatch = new Stopwatch();
        //Format [time, fps]
        this.fpsTimesArray = [];

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
        this.eyeDropButton.classList.remove('Selected');
        this.addObjectButton.classList.remove('Selected');
        this.deleteObjectButton.classList.remove('Selected');
        this.layerOn = false;
        this.drawOn = true;
        this.fillOn = false;
        this.eyeDropperOn = false;
        this.canvas.style.cursor = "";
        this.focusOnGameCanvas();
    };

    layerToolClicked = () => {
        this.layerToolButton.classList.add('Selected');
        this.drawToolButton.classList.remove('Selected');
        this.fillToolButton.classList.remove('Selected');
        this.eyeDropButton.classList.remove('Selected');
        this.addObjectButton.classList.remove('Selected');
        this.deleteObjectButton.classList.remove('Selected');
        this.layerOn = true;
        this.drawOn = false;
        this.fillOn = false;
        this.eyeDropperOn = false;
        this.canvas.style.cursor = "";
        this.focusOnGameCanvas();
    };

    fillToolClicked = () => {
        this.fillToolButton.classList.add('Selected');
        this.drawToolButton.classList.remove('Selected');
        this.layerToolButton.classList.remove('Selected');
        this.eyeDropButton.classList.remove('Selected');
        this.addObjectButton.classList.remove('Selected');
        this.deleteObjectButton.classList.remove('Selected');
        this.layerOn = false;
        this.drawOn = false;
        this.fillOn = true;
        this.eyeDropperOn = false;
        this.canvas.style.cursor = "";
        this.focusOnGameCanvas();
    };

    addObjectButtonClicked = () => {
        this.addObjectButton.classList.add('Selected');
        this.drawToolButton.classList.remove('Selected');
        this.layerToolButton.classList.remove('Selected');
        this.fillToolButton.classList.remove('Selected');
        this.eyeDropButton.classList.remove('Selected');
        this.deleteObjectButton.classList.remove('Selected');
        this.eyeDropperOn = false;
        this.canvas.style.cursor = "";
        this.focusOnGameCanvas();
    };

    deleteObjectButtonClicked = () => {
        this.deleteObjectButton.classList.add('Selected');
        this.addObjectButton.classList.remove('Selected');
        this.drawToolButton.classList.remove('Selected');
        this.layerToolButton.classList.remove('Selected');
        this.fillToolButton.classList.remove('Selected');
        this.eyeDropButton.classList.remove('Selected');
        this.eyeDropperOn = false;
        this.canvas.style.cursor = "";
        this.focusOnGameCanvas();
    };

    resetBoardToNewBoard = (boardID) => {
        this.board = new Board(boardID);
    };

    updateTile = (x, y, typeID, r, g, b, a) => {
        this.board.setTile(x, y, typeID, r, g, b, a);
    };

    updateChunk = (chunkX, chunkY, tileData) => {
        this.board.updateChunk(chunkX, chunkY, tileData);
    };

    addPlayer = (playerID, spriteID, name, x, y, speedX, speedY, movingLeft, movingRight, jumping) => {
        this.board.addPlayer(playerID, spriteID, name, x, y, speedX, speedY, movingLeft, movingRight, jumping);
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
        console.log('x: ' + x + ', y: ' + y);
        //Network.Send(GameMessageCreator.SetTile(x, y, this.currentTileType, parseInt(this.redSlider.value),
        //    parseInt(this.greenSlider.value), parseInt(this.blueSlider.value), parseInt(this.alphaSlider.value)));
    };

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
        this.board.getPlayers().forEach((player) => {
            player.updateSpriteFrame(delta);
        });
    };

    draw = () => {
        let focusPlayer = this.board.getPlayer(this.cameraFocusPlayerID);
        if (focusPlayer !== null) {
            this.cameraFocusTileX = focusPlayer.getClientMovementInfo().getX();
            this.cameraFocusTileY = focusPlayer.getClientMovementInfo().getY();
        }

        this.backgroundTileLayerRenderer.setFocusTilePosition(this.cameraFocusTileX, this.cameraFocusTileY);
        this.foregroundTileLayerRenderer.setFocusTilePosition(this.cameraFocusTileX, this.cameraFocusTileY);

        //Draw tile layers
        this.backgroundTileLayerRenderer.draw(this.board);
        this.foregroundTileLayerRenderer.draw(this.board);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //Test drawing in tile transformation
        this.ctx.save();

        //Draw players
        this.board.getPlayers().forEach((player) => {
            //Player X and Y is in the bottom center of the player rectangle
            let leftX = player.getClientMovementInfo().getX() + 0.5 - Player_Width_Tiles / 2;
            let rightX = player.getClientMovementInfo().getX() + 0.5 + Player_Width_Tiles / 2;
            let bottomY = player.getClientMovementInfo().getY();
            let topY = player.getClientMovementInfo().getY() + Player_Height_Tiles;

            this.ctx.drawImage(this.playerSpriteSheet,
                Sprite_X_Start + Sprite_Horizontal_Distance * player.getSpriteFrame(), Sprite_Vertical_Table[player.getSpriteID()],
                Sprite_Width, 54,
                this.convertTileXCoordinateToScreen(leftX), this.convertTileYCoordinateToScreen(topY) - 4,
                Sprite_Width, 54);

            /*
            //Draw the physics box around the player for debugging
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
            this.ctx.moveTo(this.convertTileXCoordinateToScreen(player.getClientMovementInfo().getX()), this.convertTileYCoordinateToScreen(player.getClientMovementInfo().getY()));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(player.getClientMovementInfo().getX() + 1.0), this.convertTileYCoordinateToScreen(player.getClientMovementInfo().getY()));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(player.getClientMovementInfo().getX() + 1.0), this.convertTileYCoordinateToScreen(player.getClientMovementInfo().getY() + 1.0));
            this.ctx.lineTo(this.convertTileXCoordinateToScreen(player.getClientMovementInfo().getX()), this.convertTileYCoordinateToScreen(player.getClientMovementInfo().getY() + 1.0));

            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
*/

            this.ctx.fillStyle = 'red';
            this.ctx.font = '20px Helvetica';
            this.ctx.textAlign = "center";
            this.ctx.fillText(player.getName(), Math.floor(this.convertTileXCoordinateToScreen(player.getClientMovementInfo().getX() + 0.5)), Math.floor(this.convertTileYCoordinateToScreen(topY + 0.5)));
        });

        this.ctx.restore();

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, this.canvas.height - 20, 55, 30);
        this.ctx.fillStyle = 'rgb(0, 255, 0)';
        this.ctx.font = '15px Helvetica';
        this.ctx.textAlign = "center";
        this.ctx.fillText(`${Math.round(Network.GetPing())} ms`, 25, this.canvas.height - 4);

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, this.canvas.height - 20 - 30, 55, 30);
        this.ctx.fillStyle = 'rgb(0, 255, 0)';
        this.ctx.font = '15px Helvetica';
        this.ctx.textAlign = "center";
        this.ctx.fillText(`${Math.round(this.getMinimumFPS())} fps`, 25, this.canvas.height - 4 - 30);

        //Trim old time from the fps array
        let currentTime = window.performance.now();
        this.fpsTimesArray = this.fpsTimesArray.filter((timeData) => currentTime - timeData[0] <= 1500.0);
        //Add new time to the fps array
        let latestFPS = 1000.0 / this.drawStopwatch.getMilliseconds();
        this.drawStopwatch.reset();
        this.fpsTimesArray.push([currentTime, latestFPS]);
    };

    /**
     * Returns the minimum FPS of the tracked FPS.
     */
    getMinimumFPS = () => {
        if (this.fpsTimesArray.length === 0) {
            return 0;
        }
        let minimum = this.fpsTimesArray[0][1];
        for (let fpsTimeData of this.fpsTimesArray) {
            minimum = Math.min(minimum, fpsTimeData[1]);
        }
        return minimum;
    };

    enterTileDrawingCoordinateSystem = () => {
        //Place 0,0 at the center of the screen
        this.ctx.translate(this.canvas.width / 2, this.canvas.height * 0.5);
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
            focusPlayerTileX = focusPlayer.getClientMovementInfo().getX();
            focusPlayerTileY = focusPlayer.getClientMovementInfo().getY();
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
        point.x += this.canvas.width / 2;
        point.y += this.canvas.height * 0.5;
        return point;
    };
    convertTileXCoordinateToScreen = (x) => {
        x -= this.cameraFocusTileX;
        x -= 0.5;
        x *= Tile_Width;
        x += this.canvas.width / 2;
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
        point.x -= this.canvas.width / 2;
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
        x -= this.canvas.width / 2;
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

    getMousePosition = (event) => {
        let rect = this.canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) / (rect.right - rect.left) * this.canvas.width,
            y: (event.clientY - rect.top) / (rect.bottom - rect.top) * this.canvas.height
        }
    };

    onMouseDown = (event) => {
        //check if eyedropper enabled
        if (!this.eyeDropperOn && !this.layerOn) {
            if (this.drawOn) {
                //Handle tile placement
                this.previouslyPlacedTileX = null;
                this.previouslyPlacedTileY = null;
                this.mouseDown = true;
                //Get tile position
                let mousePosition = this.getMousePosition(event);
                this.previouslyPlacedTileX = this.convertScreenXCoordinateToTile(mousePosition.x);
                this.previouslyPlacedTileY = this.convertScreenYCoordinateToTile(mousePosition.y);
                this.placeTile(this.previouslyPlacedTileX, this.previouslyPlacedTileY);
            } else if (this.fillOn) {
                //Fill tool
                //get mouse coordinates
                let mousePosition = this.getMousePosition(event);
                //get information about pixel at mouse coordinates from canvas
                let tileX = this.convertScreenXCoordinateToTile(mousePosition.x);
                let tileY = this.convertScreenYCoordinateToTile(mousePosition.y);
                let tile = this.board.getTile(tileX, tileY);
                let isNullTile = false;
                let targetLayer = -1;
                let targetR = 0;
                let targetB = 0;
                let targetG = 0;
                let targetA = 0;
                let maxRadius = 5;
                if (tile === null || tile.getTypeID() === Deleted_Tile_Type) {
                    isNullTile = true;
                } else {
                    targetLayer = tile.getTypeID();
                    targetR = tile.getR();
                    targetG = tile.getG();
                    targetB = tile.getB();
                    targetA = tile.getA();
                }

                let pastSearched = [];
                let fillArray = [];
                let searchArray = [];
                let searchArrayContains = (tilePos) => {
                    return pastSearched.filter(pos => pos.x === tilePos.x && pos.y === tilePos.y).length > 0;
                };
                let addTileToSearchArray = (lookAtPos, lookAtTile) => {
                    let addTile = false;
                    if (!searchArrayContains(lookAtPos)) {
                        if (isNullTile) {
                            if (lookAtTile === null || lookAtTile.getTypeID() === Deleted_Tile_Type) {
                                addTile = true;
                            }
                        } else {
                            if (lookAtTile !== null && lookAtTile.getTypeID() === targetLayer &&
                                lookAtTile.getR() === targetR && lookAtTile.getG() === targetG &&
                                lookAtTile.getB() === targetB && lookAtTile.getA() === targetA) {
                                addTile = true;
                            }
                        }
                    }
                    if (addTile) {
                        searchArray.push(lookAtPos);
                        pastSearched.push(lookAtPos);
                    }
                };
                searchArray.push({x: tileX, y: tileY});
                pastSearched.push({x: tileX, y: tileY});
                while (searchArray.length > 0) {
                    let position = searchArray.shift();
                    fillArray.push(position);
                    //Now search neighbors
                    let topPos = {x: position.x, y: position.y - 1};
                    let bottomPos = {x: position.x, y: position.y + 1};
                    let leftPos = {x: position.x - 1, y: position.y};
                    let rightPos = {x: position.x + 1, y: position.y};
                    let topTile = this.board.getTile(topPos.x, topPos.y);
                    let bottomTile = this.board.getTile(bottomPos.x, bottomPos.y);
                    let leftTile = this.board.getTile(leftPos.x, leftPos.y);
                    let rightTile = this.board.getTile(rightPos.x, rightPos.y);
                    if (Math.hypot(topPos.x - tileX, topPos.y - tileY) <= maxRadius) {
                        //If top tile is equal to target
                        addTileToSearchArray(topPos, topTile);
                    }
                    if (Math.hypot(bottomPos.x - tileX, bottomPos.y - tileY) <= maxRadius) {
                        //Bottom tile is equal to target
                        addTileToSearchArray(bottomPos, bottomTile);
                    }
                    if (Math.hypot(leftPos.x - tileX, leftPos.y - tileY) <= maxRadius) {
                        //Left tile is equal to target
                        addTileToSearchArray(leftPos, leftTile);
                    }
                    if (Math.hypot(rightPos.x - tileX, rightPos.y - tileY) <= maxRadius) {
                        //Right tile is equal to target
                        addTileToSearchArray(rightPos, rightTile);
                    }
                }

                for (let tilePos of fillArray) {
                    this.placeTile(tilePos.x, tilePos.y);
                }
            }
        }
        else if (this.eyeDropperOn) {
            //switch cursor in canvas back to standard pointer
            this.canvas.style.cursor = "";

            //turn off the eyedropper
            this.eyeDropperOn = false;
            this.fillOn =false;
            this.layerOn = false;
            this.drawOn = true;
            this.drawToolButton.classList.add('Selected');
            this.eyeDropButton.classList.remove('Selected');

        }
        else if (this.layerOn) {
            //get mouse coordinates
            let mousePosition = this.getMousePosition(event);
            //get information about pixel at mouse coordinates from canvas
            //let pixelInfo = this.ctx.getImageData(mousePosition.x, mousePosition.y, 1, 1);
            let tileX = this.convertScreenXCoordinateToTile(mousePosition.x);
            let tileY = this.convertScreenYCoordinateToTile(mousePosition.y);

            let tile = this.board.getTile(tileX, tileY);
            if (tile === null) {
                return;
            }
            let pixelRed = tile.getR();
            let pixelGreen = tile.getG();
            let pixelBlue = tile.getB();
            let pixelAlpha = tile.getA();

            //set background color to a hex representation of the value pulled from canvas
            //this.previewColor = '#' + this.rgbToHex(pixelRed) + this.rgbToHex(pixelGreen) + this.rgbToHex(pixelBlue);
            //set background color to a rgba representation of the value pulled from canvas
            //this.previewColor = 'rgba(' + pixelRed + ", " + pixelGreen + ", " + pixelBlue + ", " + pixelAlpha + ")";

            this.previewSquare.style.backgroundColor = 'rgba(' + pixelRed + ", " + pixelGreen + ", " + pixelBlue + ", " + pixelAlpha / 255 + ")";

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

            this.placeTile(tileX, tileY);

            //this.placeLayer(tileX, tileY, this.currentTileType, this.redSlider.value, this.greenSlider.value, this.blueSlider.value, this.alphaSlider.value );
            //this.layerOn = false;
            this.canvas.cursor = '';
        }
    };

    onMouseMove = (event) => {
        //possible preview window for eyedropper color picking goes here
        if (!this.eyeDropperOn && !this.layerOn) {
            if (this.drawOn) {
                //Handle tile placement
                if (this.mouseDown) {
                    //Get tile position
                    let mousePosition = this.getMousePosition(event);
                    let tileX = this.convertScreenXCoordinateToTile(mousePosition.x);
                    let tileY = this.convertScreenYCoordinateToTile(mousePosition.y);
                    let positionsBetween = this.getPointsOnLine(this.previouslyPlacedTileX, this.previouslyPlacedTileY, tileX, tileY);
                    positionsBetween.forEach(coordinate => {
                        this.placeTile(coordinate.x, coordinate.y);
                    });
                    this.previouslyPlacedTileX = tileX;
                    this.previouslyPlacedTileY = tileY;
                }
            }
        } else {

            //get mouse coordinates
            let mousePosition = this.getMousePosition(event);
            //get information about pixel at mouse coordinates from canvas
            //let pixelInfo = this.ctx.getImageData(mousePosition.x, mousePosition.y, 1, 1);
            let tileX = this.convertScreenXCoordinateToTile(mousePosition.x);
            let tileY = this.convertScreenYCoordinateToTile(mousePosition.y);

            if (this.eyeDropperOn) {
                //Set current tile type to eyedrop
                let tile = this.board.getTile(tileX, tileY);
                if (tile !== null) {
                    switch (tile.getTypeID()) {
                        case 3:
                            this.backgroundTileTypeClicked();
                            break;
                        case 4:
                            this.solidTileTypeClicked();
                            break;
                        case 5:
                            this.foregroundTileTypeClicked();
                            break;
                        case 6:
                            this.deleteTileTypeClicked();
                            break;
                    }
                }
            }

            let tile = this.board.getTile(tileX, tileY);
            if (tile === null) {
                return;
            }
            let pixelRed = tile.getR();
            let pixelGreen = tile.getG();
            let pixelBlue = tile.getB();
            let pixelAlpha = tile.getA();

            this.previewSquare.style.backgroundColor = 'rgba(' + pixelRed + ", " + pixelGreen + ", " + pixelBlue + ", " + pixelAlpha / 255 + ")";

            //set slider values to color selected
            this.redSlider.value = pixelRed;
            this.greenSlider.value = pixelGreen;
            this.blueSlider.value = pixelBlue;
            this.alphaSlider.value = pixelAlpha;

            //turn off the eyedropper
            if (this.mouseDown && this.layerOn) {

                let positionsBetween = this.getPointsOnLine(this.previouslyPlacedTileX, this.previouslyPlacedTileY, tileX, tileY);
                positionsBetween.forEach(coordinate => {
                    this.placeTile(coordinate.x, coordinate.y);
                });
                //this.placeLayer(tileX, tileY, this.currentTileType, this.redSlider.value, this.greenSlider.value, this.blueSlider.value, this.alphaSlider.value );

            }

            this.updateSliderLabels();

            this.previouslyPlacedTileX = tileX;
            this.previouslyPlacedTileY = tileY;
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
        //1
        if(event.keyCode === 49 ){
            this.deleteTileTypeClicked();
        }
        //2
        if(event.keyCode === 50){
            this.backgroundTileTypeClicked();
        }
        //3
        if(event.keyCode === 51){
            this.solidTileTypeClicked();
        }
        //4
        if(event.keyCode === 52){
            this.foregroundTileTypeClicked();
        }
        //Q
        if(event.keyCode === 81){
            this.drawToolClicked();
        }
        //E
        if(event.keyCode === 69){
            this.eyeDropButtonClicked();
        }
        //F
        if(event.keyCode === 70){
            this.fillToolClicked();
        }
        //L
        if(event.keyCode === 76){
            this.layerToolClicked();
        }
    };

    onKeyUp = (event) => {
        //Left
        if ((event.keyCode === 37 || event.keyCode === 65) && this.leftPressed === true) {
            this.leftPressed = false;
            Network.Send(GameMessageCreator.MovingLeft(this.leftPressed));
        }
        //Right
        if ((event.keyCode === 39 || event.keyCode === 68) && this.rightPressed === true) {
            this.rightPressed = false;
            Network.Send(GameMessageCreator.MovingRight(this.rightPressed));
        }
        //Up
        if ((event.keyCode === 38 || event.keyCode === 87) && this.upPressed === true) {
            this.upPressed = false;
            Network.Send(GameMessageCreator.Jumping(this.upPressed));
        }
        //Down
        if ((event.keyCode === 40 || event.keyCode === 83) && this.downPressed === true) {
            this.downPressed = false;
        }
    };

    resize = () => {
        if (!this.visible) {
            return;
        }
        let canvasWidth = this.canvas.width;
        let canvasHeight = this.canvas.height;
        let cssWidth = this.canvas.clientWidth;
        let cssHeight = this.canvas.clientHeight;
        if (canvasWidth !== cssWidth || canvasHeight !== cssHeight) {
            this.canvas.width = cssWidth;
            this.canvas.height = cssHeight;

            this.backgroundTileLayerRenderer.setSize(cssWidth, cssHeight);
            this.foregroundTileLayerRenderer.setSize(cssWidth, cssHeight);
        }
    };

    setVisibility = (visible) => {
        this.visible = visible;
        this.canvas.focus();
        if (visible) {
            this.resize();
            this.startMusic();
        }
        else {
            this.stopMusic();
        }
    };

    getRgbaSelector = () => {
        return this.rgbaSelector;
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

        this.previewSquare.style.backgroundColor = 'rgba(' + rh + ", " + gh + ", " + bh + ", " + ah / 255 + ")";
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
        this.eyeDropButton.classList.add('Selected');
        this.drawToolButton.classList.remove('Selected');
        this.layerToolButton.classList.remove('Selected');
        this.fillToolButton.classList.remove('Selected');
        this.addObjectButton.classList.remove('Selected');
        this.deleteObjectButton.classList.remove('Selected');
        this.canvas.style.cursor = "crosshair";
        this.eyeDropperOn = true;
        this.focusOnGameCanvas();
    };

    updateSliderLabels = () => {
        this.rgbaLabel.childNodes[4].innerText = this.redSlider.value;
        this.rgbaLabel.childNodes[5].innerText = this.greenSlider.value;
        this.rgbaLabel.childNodes[6].innerText = this.blueSlider.value;
        this.rgbaLabel.childNodes[7].innerText = this.alphaSlider.value;
    };

    getPointsOnLine = (x0, y0, x1, y1) => {
        let dx = Math.abs(x1 - x0);
        let dy = Math.abs(y1 - y0);
        let sx = (x0 < x1) ? 1 : -1;
        let sy = (y0 < y1) ? 1 : -1;
        let err = dx - dy;

        let predictedPoints = [];

        while (true) {
            predictedPoints.push({x: x0, y: y0});  // Do what you need to for this
            if ((x0 === x1) && (y0 === y1)) break;
            let e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
        return predictedPoints;
    };

    static GetBackgroundTileLayerRenderer = () => {
        return BackgroundTileLayerRenderer;
    };
    static GetForegroundTileLayerRenderer = () => {
        return ForegroundTileLayerRenderer;
    };

    getDiv = () => {
        return this.mainDiv;
    };
}