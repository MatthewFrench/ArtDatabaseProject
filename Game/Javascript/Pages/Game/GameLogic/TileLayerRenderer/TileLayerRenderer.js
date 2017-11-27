
const Tile_Height = 10;
const Tile_Width = 10;
const Num_Per_Vert = 2; // Ex: x, y
const Verts_Per_Tile = 6;
const Num_Per_Color = 4; // r, g, b, a

export class TileLayerRenderer {
    constructor(layerWidth, layerHeight, renderTileType) {
        //************** Variables
        this.renderTileType = renderTileType;
        //This is the center of where the camera is looking
        this.focusTileX = 0;
        this.focusTileY = 0;
        //Number of tiles of each side
        this.tilesHorizontal = 0;
        this.tilesVertical = 0;
        //Total possible viewable tiles
        this.totalTiles = 0;
        //Total number of tiles that are actually to be drawn
        this.actualDrawTileCount = 0;
        //This is the current tile size of the colors and positions arrays
        this.currentArrayTileSize = 0;
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
        //Buffers that drawing information gets copied to
        this.positionBuffer = null;
        this.colorBuffer = null;
        //************** Storing tile information
        //Holds tile vertex info as: Float32Array(this.totalTiles * Verts_Per_Tile * Num_Per_Vert)
        this.positions = null;
        //Holds tile vertex color info as: Float32Array(this.totalTiles * Verts_Per_Tile * Num_Per_Color);
        this.colors = null;


        this.setSize(layerWidth, layerHeight);
        this.firstTimeGLSetup();
    }

    firstTimeGLSetup = () => {
        //Vector Shader
        let VERT_SRC = require('./VertexShader.glsl');
        //Fragment shader
        let FRAG_SRC = require('./FragmentShader.glsl');
        //Create Canvas
        this.canvas = document.createElement('canvas');
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
        // Create a buffer to put three 2d clip space points in
        this.positionBuffer = this.gl.createBuffer();
        this.colorBuffer = this.gl.createBuffer();
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
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.enableVertexAttribArray(this.colorAttributeLocation);
        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        size = 4;          //4 components per iteration
        type = this.gl.FLOAT;   // the data is 32bit floats
        normalize = false; // don't normalize the data
        stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        offset = 0;        // start at the beginning of the buffer
        this.gl.vertexAttribPointer(this.colorAttributeLocation, size, type, normalize, stride, offset);
        this.updateShaderResolutionVariable();
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

    setSize = (width, height) => {
        this.layerWidth = width;
        this.layerHeight = height;
        this.updateShaderResolutionVariable();

        this.tilesHorizontal = Math.ceil(this.layerWidth / Tile_Width);
        this.tilesVertical = Math.ceil(this.layerHeight / Tile_Height);
        //Add padding
        let padding = 1;
        this.totalTiles = (this.tilesHorizontal + padding * 2) * (this.tilesVertical + padding * 2);
    };

    setFocusTilePosition = (focusTileX, focusTileY) => {
        this.focusTileX = focusTileX;
        this.focusTileY = focusTileY;
    };

    copyPositionsToPositionBuffer = () => {
        // Bind the position buffer.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.positions, this.gl.DYNAMIC_DRAW);
    };

    setRectanglePositionInPositionArray = (rectNumber, x, y, width, height) => {
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

    setRectangleColorInColorArray = (rectNumber, r, g, b, a) => {
        let tileStart = rectNumber * Verts_Per_Tile * Num_Per_Color;
        for (let vertexNumber = 0; vertexNumber < Verts_Per_Tile; vertexNumber++) {
            let vertexStart = tileStart + vertexNumber * Num_Per_Color;
            this.colors[vertexStart] = r;
            this.colors[vertexStart + 1] = g;
            this.colors[vertexStart + 2] = b;
            this.colors[vertexStart + 3] = a;
        }
    };

    copyColorsToColorBuffer = () => {
        // Bind the color buffer.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.DYNAMIC_DRAW);
    };

    resizeBuffersToFitScreen = () => {
        if (this.currentArrayTileSize < this.totalTiles) {
            this.positions = new Float32Array(this.totalTiles * Verts_Per_Tile * Num_Per_Vert);
            this.colors = new Float32Array(this.totalTiles * Verts_Per_Tile * Num_Per_Color);
            this.currentArrayTileSize = this.totalTiles;
        }
    };

    copyTileDataToArrays = (board) => {
        let halfHorizontalTiles = this.tilesHorizontal / 2;
        let halfVerticalTiles = this.tilesVertical / 2;
        //Calculate top and bottom tile location, top is going to be positive
        let topTile = Math.ceil(this.focusTileY + halfVerticalTiles) + 1;
        let bottomTile = Math.floor(this.focusTileY - halfVerticalTiles);
        //Calculate left and right tile location
        let leftTile = Math.floor(this.focusTileX - halfHorizontalTiles);
        let rightTile = Math.ceil(this.focusTileX + halfHorizontalTiles) + 1;

        let halfScreenHeight = this.layerHeight / 2;
        let halfScreenWidth = this.layerWidth / 2;

        //Subtract tile width and height so we're exactly in the center
        let offsetX = -Tile_Width/2;
        let offsetY = -Tile_Height/2;
        //Add position of self
        offsetX += -this.focusTileX * Tile_Width;
        offsetY += -this.focusTileY * Tile_Height;

        //Loop between locations
        this.actualDrawTileCount = 0;
        for (let tileY = bottomTile; tileY < topTile; tileY++) {
            for (let tileX = leftTile; tileX < rightTile; tileX++) {
                let tile = board.getTile(tileX, tileY);
                if (tile !== null && tile.getTypeID() === this.renderTileType) {
                    this.setRectanglePositionInPositionArray(this.actualDrawTileCount,
                        tile.getX() * Tile_Width + halfScreenWidth + offsetX,
                        tile.getY() * Tile_Height + halfScreenHeight + offsetY,
                        Tile_Width, Tile_Height);
                    this.setRectangleColorInColorArray(this.actualDrawTileCount, tile.getR(), tile.getG(), tile.getB(), tile.getA());
                    this.actualDrawTileCount++;
                }
            }
        }
    };

    draw = (board) => {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.resizeBuffersToFitScreen();
        this.copyTileDataToArrays(board);
        if (this.actualDrawTileCount === 0) {
            return;
        }
        this.copyPositionsToPositionBuffer();
        this.copyColorsToColorBuffer();

        // draw
        let primitiveType = this.gl.TRIANGLES;
        let offset = 0;
        let count = Verts_Per_Tile * this.actualDrawTileCount;
        this.gl.drawArrays(primitiveType, offset, count);
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