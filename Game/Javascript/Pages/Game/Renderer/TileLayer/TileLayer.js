
const Tile_Height = 10;
const Tile_Width = 10;
const Num_Per_Vert = 2; // Ex: x, y
const Verts_Per_Tile = 6;
const Num_Per_Color = 4; // r, g, b, a

export class TileLayer {

    constructor(layerWidth, layerHeight) {
        this.layerWidth = layerWidth;
        this.layerHeight = layerHeight;
        this.tilesHorizontal = Math.ceil(this.layerWidth / Tile_Width);
        this.tilesVertical = Math.ceil(this.layerHeight / Tile_Height);
        this.totalTiles = this.tilesHorizontal * this.tilesVertical;

//Vector Shader
        let VERT_SRC = require('./VertexShader.glsl');

//Fragment shader
        let FRAG_SRC = require('./FragmentShader.glsl');

//Create Canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.layerWidth;
        this.canvas.height = this.layerHeight;

        this.gl = this.canvas.getContext('webgl2');

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
        let resolutionUniformLocation = this.gl.getUniformLocation(program, "u_resolution");

        // Create a buffer to put three 2d clip space points in
        this.positionBuffer = this.gl.createBuffer();

        this.positions = new Float32Array(this.totalTiles * Verts_Per_Tile * Num_Per_Vert);
        this.fillWithTiles();
        this.updatePositionsBuffer();

        // Create a buffer to put three 2d clip space points in
        this.colorBuffer = this.gl.createBuffer();
        this.colors = new Float32Array(this.totalTiles * Verts_Per_Tile * Num_Per_Color);
        this.fillWithColors();
        this.setColor(this.getTileNumber(0, 0), 0.0, 1.0, 0.0, 1.0);
        this.updateColorsBuffer();

        // Tell WebGL how to convert from clip space to pixels
        this.gl.viewport(0, 0, layerWidth,layerHeight);

        // Clear the canvas
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

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

        // set the resolution
        this.gl.uniform2f(resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);

    }

    getTileNumber = (tileX, tileY) => {
        return tileY * this.tilesHorizontal + tileX;
    };

    fillWithTiles = () => {
        for (let x = 0; x < this.tilesHorizontal; x++) {
            for (let y = 0; y < this.tilesVertical; y++) {
                this.setRectangle(this.getTileNumber(x, y), x * Tile_Width + x, y * Tile_Height + y, Tile_Width, Tile_Height);
            }
        }
    };

    setRectangle = (rectNumber, x, y, width, height) => {
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

    updatePositionsBuffer = () => {
        // Bind the position buffer.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.positions, this.gl.DYNAMIC_DRAW);
    };

    setColor = (rectNumber, r, g, b, a) => {
        let tileStart = rectNumber * Verts_Per_Tile * Num_Per_Color;
        for (let vertexNumber = 0; vertexNumber < Verts_Per_Tile; vertexNumber++) {
            let vertexStart = tileStart + vertexNumber * Num_Per_Color;
            this.colors[vertexStart] = r;
            this.colors[vertexStart + 1] = g;
            this.colors[vertexStart + 2] = b;
            this.colors[vertexStart + 3] = a;
        }
    };


    fillWithColors = () => {
        for (let x = 0; x < this.tilesHorizontal; x++) {
            for (let y = 0; y < this.tilesVertical; y++) {
                this.setColor(this.getTileNumber(x, y), Math.random(), Math.random(), Math.random(), 1.0);
            }
        }
    };

    updateColorsBuffer = () => {
        // Bind the position buffer.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.DYNAMIC_DRAW);
    };


    draw = () => {
        // draw
        let primitiveType = this.gl.TRIANGLES;
        let offset = 0;
        let count = Verts_Per_Tile * this.totalTiles;
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