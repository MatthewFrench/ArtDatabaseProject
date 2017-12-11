const Tile_Height = 10;
const Tile_Width = 10;
const Num_Per_Vert = 2; // Ex: x, y
const Verts_Per_Tile = 6;
const Num_Per_Color = 4; // r, g, b, a

const Chunk_Width = 25;
const Chunk_Height = 25;

export class TileLayerRenderer {
    constructor(className, layerWidth, layerHeight, isBackgroundNotForeground) {
        //************** Variables
        this.isBackgroundNotForeground = isBackgroundNotForeground;
        //This is the center of where the camera is looking
        this.focusTileX = 0;
        this.focusTileY = 0;
        this.chunkWidth = Chunk_Width;
        this.chunkHeight = Chunk_Height;
        //Number of tiles of each side
        this.tilesHorizontal = this.chunkWidth;
        this.tilesVertical = this.chunkHeight;
        //Total possible viewable tiles
        this.totalTiles = this.tilesHorizontal * this.tilesVertical;
        //Resolution of the screen
        this.layerWidth = 0;
        this.layerHeight = 0;
        //************** GL Variables
        //HTML5 Canvas
        this.canvas = null;
        //WebGL
        this.gl = null;
        //Shader attributes
        this.positionAttributeLocation = null;
        this.colorAttributeLocation = null;
        //Shader global uniform variable
        this.resolutionUniformLocation = null;
        //Shader global uniform variable
        this.positionUniformLocation = null;
        //Buffers that drawing information gets copied to
        this.positionBuffer = null;
        //this.colorBuffer = null;
        //************** Storing tile information
        //Holds tile vertex info as: Float32Array(this.totalTiles * Verts_Per_Tile * Num_Per_Vert)
        this.positions = null;

        this.setSize(layerWidth, layerHeight);
        this.firstTimeGLSetup(className);
    }

    firstTimeGLSetup = (className) => {
        //Vector Shader
        let VERT_SRC = require('./VertexShader.glsl');
        //Fragment shader
        let FRAG_SRC = require('./FragmentShader.glsl');
        //Create Canvas
        this.canvas = document.createElement('canvas');
        this.canvas.className = className;
        this.canvas.width = this.layerWidth;
        this.canvas.height = this.layerHeight;
        this.gl = this.canvas.getContext('webgl');
        //Create program
        let program = this.gl.createProgram();
        //Bind vertex shader
        this.gl.attachShader(program, this.compileShader(this.gl.FRAGMENT_SHADER, FRAG_SRC));
        //Bind fragment shader
        this.gl.attachShader(program, this.compileShader(this.gl.VERTEX_SHADER, VERT_SRC));
        //Attaches the program to our shaders so the program variables get used in the shaders
        this.gl.linkProgram(program);
        // look up where the vertex data needs to go.
        this.positionAttributeLocation = this.gl.getAttribLocation(program, "a_position");
        // look up where the color data needs to go.
        this.colorAttributeLocation = this.gl.getAttribLocation(program, "a_color");
        // look up uniform locations
        this.resolutionUniformLocation = this.gl.getUniformLocation(program, "u_resolution");
        this.positionUniformLocation = this.gl.getUniformLocation(program, "u_position");
        // Create a buffer to put three 2d clip space points in
        this.positionBuffer = this.gl.createBuffer();
        //this.colorBuffer = this.gl.createBuffer();
        // Set the canvas clear color to transparent
        this.gl.clearColor(0, 0, 0, 0);
        // Tell it to use our program (pair of shaders)
        this.gl.useProgram(program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        // Turn on the attribute
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        let size = 2;          // 2 components per iteration
        let type = this.gl.FLOAT;   // the data is 32bit floats
        let normalize = false; // don't normalize the data
        let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0;        // start at the beginning of the buffer
        this.gl.vertexAttribPointer(this.positionAttributeLocation, size, type, normalize, stride, offset);
        this.updateShaderResolutionVariable();
        //Fill position array
        //I can say anything and it won't affect the code
        //Tara is sexy
        this.positions = new Float32Array(this.totalTiles * Verts_Per_Tile * Num_Per_Vert);
        this.setPositionsArray();
        this.copyPositionsToPositionBuffer();
    };

    CreateBuffer = () => {
        return this.gl.createBuffer();
    };

    connectColorBufferToColorAttribute = (colorBuffer) => {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
        this.gl.enableVertexAttribArray(this.colorAttributeLocation);
        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        let size = 4;          //4 components per iteration
        let type = this.gl.FLOAT;   // the data is 32bit floats
        let normalize = false; // don't normalize the data
        let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0;        // start at the beginning of the buffer
        this.gl.vertexAttribPointer(this.colorAttributeLocation, size, type, normalize, stride, offset);
    };

    static GetRectangleNumberFromPosition = (x, y) => {
        return y * Chunk_Width + x;
    };

    setPositionsArray = () => {
        //Loop through all tiles and set positions
        for (let x = 0; x < this.chunkWidth; x++) {
            for (let y = 0; y < this.chunkHeight; y++) {
                this.setRectanglePositionInPositionArray(x, y, Tile_Width, Tile_Height);
            }
        }
    };

    copyPositionsToPositionBuffer = () => {
        // Bind the position buffer.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.positions, this.gl.STATIC_DRAW);
    };

    setRectanglePositionInPositionArray = (tileX, tileY, width, height) => {
        let rectNumber = TileLayerRenderer.GetRectangleNumberFromPosition(tileX, tileY);
        let x = tileX * Tile_Width;
        let y = tileY * Tile_Height;
        //Vertex 1
        let tileStart = rectNumber * Verts_Per_Tile * Num_Per_Vert;
        this.positions[tileStart] = x;
        this.positions[tileStart + 1] = y;
        //Vertex 2
        this.positions[tileStart + 2] = x + width;
        this.positions[tileStart + 3] = y;
        //Vertex 3
        this.positions[tileStart + 4] = x;
        this.positions[tileStart + 5] = y + height;
        //Vertex 4
        this.positions[tileStart + 6] = x;
        this.positions[tileStart + 7] = y + height;
        //Vertex 5
        this.positions[tileStart + 8] = x + width;
        this.positions[tileStart + 9] = y;
        //Vertex 6
        this.positions[tileStart + 10] = x + width;
        this.positions[tileStart + 11] = y + height;
    };

    static CreateColorArray = () => {
        return new Float32Array(Chunk_Width * Chunk_Height * Verts_Per_Tile * Num_Per_Color);
    };

    static SetRectangleColorInColorArray = (colorArray, x, y, r, g, b, a) => {
        let rectNumber = TileLayerRenderer.GetRectangleNumberFromPosition(x, y);
        let tileStart = rectNumber * Verts_Per_Tile * Num_Per_Color;
        for (let vertexNumber = 0; vertexNumber < Verts_Per_Tile; vertexNumber++) {
            let vertexStart = tileStart + vertexNumber * Num_Per_Color;
            colorArray[vertexStart] = r;
            colorArray[vertexStart + 1] = g;
            colorArray[vertexStart + 2] = b;
            colorArray[vertexStart + 3] = a;
        }
    };

    updateShaderResolutionVariable = () => {
        if (this.gl === null) {
            return;
        }

        this.canvas.width = this.layerWidth;
        this.canvas.height = this.layerHeight;
        //Set the global shader resolution
        this.gl.uniform2f(this.resolutionUniformLocation, this.layerWidth, this.layerHeight);
        //Set the opengl viewport size
        // Tell WebGL how to convert from clip space to pixels
        this.gl.viewport(0, 0, this.layerWidth, this.layerHeight);
    };

    setGlobalPosition = (x, y) => {
        this.gl.uniform2f(this.positionUniformLocation, x, y);
    };

    setSize = (width, height) => {
        this.layerWidth = width;
        this.layerHeight = height;
        this.updateShaderResolutionVariable();
    };

    setFocusTilePosition = (focusTileX, focusTileY) => {
        this.focusTileX = focusTileX;
        this.focusTileY = focusTileY;
    };

    copyColorsToColorBuffer = (colorArray, colorBuffer) => {
        // Bind the color buffer.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, colorArray, this.gl.DYNAMIC_DRAW);
    };

    draw = (board) => {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        //Try looping through tile chunks and drawing them to the screen
        //  Copy each individual tile chunk buffer data to GPU buffer and draw translated to the correct spot
        let tilesHorizontal = Math.ceil(this.canvas.width / Tile_Width);
        let tilesVertical = Math.ceil(this.canvas.height / Tile_Height);

        let halfHorizontalTiles = tilesHorizontal / 2;
        let halfVerticalTiles = tilesVertical / 2;
        //Calculate top and bottom tile location, top is going to be positive
        let topTile = Math.ceil(this.focusTileY + halfVerticalTiles) + 1;
        let bottomTile = Math.floor(this.focusTileY - halfVerticalTiles);
        //Calculate left and right tile location
        let leftTile = Math.floor(this.focusTileX - halfHorizontalTiles);
        let rightTile = Math.ceil(this.focusTileX + halfHorizontalTiles) + 1;

        let drawChunks = board.tileWorld.getChunksInTileRange(leftTile, bottomTile, rightTile, topTile);

        for (let chunk of drawChunks) {
            if (this.isBackgroundNotForeground === true) {
                this.connectColorBufferToColorAttribute(chunk.getBackgroundColorBuffer());
                if (chunk.isBackgroundColorBufferDirty()) {
                    this.copyColorsToColorBuffer(chunk.getBackgroundColorRenderArray(), chunk.getBackgroundColorBuffer());
                    chunk.cleanBackgroundColorBuffer();
                }
            } else {
                this.connectColorBufferToColorAttribute(chunk.getForegroundColorBuffer());
                if (chunk.isForegroundColorBufferDirty()) {
                    this.copyColorsToColorBuffer(chunk.getForegroundColorRenderArray(), chunk.getForegroundColorBuffer());
                    chunk.cleanForegroundColorBuffer();
                }
            }

            //Translation in pixels
            let chunkTileX = chunk.getChunkTileX();
            let chunkTileY = chunk.getChunkTileY();

            let x = this.convertTileXCoordinateToScreen(chunkTileX);
            let y = this.convertTileYCoordinateToScreen(chunkTileY);
            this.setGlobalPosition(x, y);

            // draw
            let primitiveType = this.gl.TRIANGLES;
            let offset = 0;
            let count = Verts_Per_Tile * this.totalTiles;
            this.gl.drawArrays(primitiveType, offset, count);
        }
    };

    convertTileXCoordinateToScreen = (x) => {
        x -= this.focusTileX;
        x -= 0.5;
        x *= Tile_Width;
        x += this.canvas.width/2;
        return x;
    };

    convertTileYCoordinateToScreen = (y) => {
        y -= this.focusTileY;
        y -= 0.5;
        y *= Tile_Height;
        //y *= -1;
        y += this.canvas.height/2;
        return y;
    };

    //Compile Shader Function
    compileShader = (type, src) => {
        let shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, src);
        this.gl.compileShader(shader);
        return shader;
    };

    getCanvas = () => {
        return this.canvas;
    };
}