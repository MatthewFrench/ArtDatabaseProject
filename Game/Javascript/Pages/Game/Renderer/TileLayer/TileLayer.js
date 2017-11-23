
export class TileLayer {

    constructor(layerWidth, layerHeight) {
        this.construct2(layerWidth, layerHeight);
    }

    /*
    construct1 = (layerWidth, layerHeight) => {
        //Must be divisible by 6
        //this.RECTANGLE_COUNT = 6e4;

//Vector Shader
        let VERT_SRC = require('./VertexShader.glsl');

//Fragment shader
        let FRAG_SRC = require('./FragmentShader.glsl');

//Create Canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = layerWidth;
        this.canvas.height = layerHeight;

        this.gl = this.canvas.getContext('webgl');

        //let WEIGHT_ATTRIB_LOCATION = 0;
//Create program
        let program = this.gl.createProgram();
//Bind vertex shader
        this.gl.attachShader(program, this.compileShader(this.gl.FRAGMENT_SHADER, FRAG_SRC));
//Bind fragment shader
        this.gl.attachShader(program, this.compileShader(this.gl.VERTEX_SHADER, VERT_SRC));
//Binds a variable to the vertex buffer that can change for each vertex
        //this.gl.bindAttribLocation(program, WEIGHT_ATTRIB_LOCATION, 'weight');
//Bind 6 more variables to the vertex buffer that can change for each vertex
        //for(let i=0; i<6; ++i) {
        //    this.gl.bindAttribLocation(program, i+1, 'rect' + i);
        //}



//Attaches the program to our shaders so the program variables get used in the shaders
        this.gl.linkProgram(program);




        // look up where the vertex data needs to go.
        let positionAttributeLocation = this.gl.getAttribLocation(program, "a_position");

        // look up uniform locations
        let resolutionUniformLocation = this.gl.getUniformLocation(program, "u_resolution");
        // Create a buffer to put three 2d clip space points in
        let positionBuffer = this.gl.createBuffer();

        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

        let positions = [
            10, 20,
            80, 20,
            10, 30,
            10, 30,
            80, 20,
            80, 30,
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
        // Tell WebGL how to convert from clip space to pixels
        this.gl.viewport(0, 0, layerWidth, layerHeight);




//Sets the program into the current rendering state
        this.gl.useProgram(program);





        // Turn on the attribute
        this.gl.enableVertexAttribArray(positionAttributeLocation);

        // Bind the position buffer.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        let size = 2;          // 2 components per iteration
        let type = this.gl.FLOAT;   // the data is 32bit floats
        let normalize = false; // don't normalize the data
        let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0;        // start at the beginning of the buffer
        this.gl.vertexAttribPointer(
            positionAttributeLocation, size, type, normalize, stride, offset);

        // set the resolution
        this.gl.uniform2f(resolutionUniformLocation, layerWidth, layerHeight);






//Sets the this.global vertex variable shape with width and height - vec2
        //this.gl.uniform2f(
        //    this.gl.getUniformLocation(program, 'shape'),
        //    layerWidth, layerHeight);
//Get the location of the shift variable
        //this.shiftLoc = this.gl.getUniformLocation(program, 'shift');
//Creates an array of rectanthis.gle data
        //this.data = new Float32Array(4 * (this.RECTANGLE_COUNT + 12));
        //for(let i=0; i<=6+this.RECTANGLE_COUNT; i+=6) {
        //    for(let j=0; j<6; ++j) {
        //        let p = 2*(i + j);
        //        this.data[p]   = 5-j;
        //        this.data[p+1] = i;
        //    }
        //}
//Create weight buffer
        //let weightBuffer = this.gl.createBuffer();
//Bind weight buffer
        //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, weightBuffer);
//Creates the buffer with the data, dynamic means we'll update it often
        //this.gl.bufferData(this.gl.ARRAY_BUFFER, this.data, this.gl.DYNAMIC_DRAW);
//Enabled the weight attribute array
        //this.gl.enableVertexAttribArray(WEIGHT_ATTRIB_LOCATION);
//Tells the vertex how the buffer data is laid out and read.
        //this.gl.vertexAttribPointer(WEIGHT_ATTRIB_LOCATION, 2, this.gl.FLOAT, false, 2*4, 0);

//Create rect buffer
        //let rectBuffer = this.gl.createBuffer();
//Bind rect buffer
        //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, rectBuffer);
//Create the buffer with the data
        //this.gl.bufferData(this.gl.ARRAY_BUFFER, this.data, this.gl.DYNAMIC_DRAW);
//For every rectanthis.gle enable the vertex to point at a location in the buffer
        //for(let i=0; i<6; ++i) {
        //    this.gl.enableVertexAttribArray(i+1);
        //    this.gl.vertexAttribPointer(i+1, 4, this.gl.FLOAT, false, 4*4, 4*4*i);
        //}

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clearColor(0, 0, 0, 0);


        let primitiveType = this.gl.TRIANGLES;
        let offset = 0;
        let count = 6;
        this.gl.drawArrays(primitiveType, offset, count);

        //this.fillRects();
    };
*/
    construct2 = (layerWidth, layerHeight) => {

//Vector Shader
        let VERT_SRC = require('./VertexShader.glsl');

//Fragment shader
        let FRAG_SRC = require('./FragmentShader.glsl');

//Create Canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = layerWidth;
        this.canvas.height = layerHeight;

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
        let positionAttributeLocation = this.gl.getAttribLocation(program, "a_position");

        // look up uniform locations
        let resolutionUniformLocation = this.gl.getUniformLocation(program, "u_resolution");

        // Create a buffer to put three 2d clip space points in
        let positionBuffer = this.gl.createBuffer();

        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

        let x = 10;
        let y = 10;
        let width = 100;
        let height = 10;

        let positions = [
            x, y,
            x + width, y,
            x, y + height,

            x, y + height,
            x + width, y,
            x + width, y + height,


            x, y + 100,
            x + width, y + 100,
            x, y + 100 + height,

            x, y + 100 + height,
            x + width, y + 100,
            x + width, y + 100 + height,
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

        //webthis.glUtils.resizeCanvasToDisplaySize(this.gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        this.gl.viewport(0, 0, layerWidth,layerHeight);

        // Clear the canvas
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        this.gl.useProgram(program);

        // Turn on the attribute
        this.gl.enableVertexAttribArray(positionAttributeLocation);

        // Bind the position buffer.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        let size = 2;          // 2 components per iteration
        let type = this.gl.FLOAT;   // the data is 32bit floats
        let normalize = false; // don't normalize the data
        let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0;        // start at the beginning of the buffer
        this.gl.vertexAttribPointer(
            positionAttributeLocation, size, type, normalize, stride, offset);

        // set the resolution
        this.gl.uniform2f(resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);

        // draw
        let primitiveType = this.gl.TRIANGLES;
        offset = 0;
        let count = 6 * 2;
        this.gl.drawArrays(primitiveType, offset, count);
    };


    //This function initializes the rectanthis.gles with random this.data
    //It is currently the slowest part of this demo.
    fillRects = () => {
        //for (let i=0; i<this.data.length; i+=4) {
        //    this.data[i] = 0.5; // X position: 0 is left, 1 is right
        //    this.data[i+1] = 0.5; // Y position: 0 is bottom of screen, 1 is top
        //    this.data[i+2] = 0.1; //
        //    this.data[i+3] = 0.1;
        //}
    };


    draw = () => {
        //return;
        //this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        //Comment this line out to measure just rendering performance
        //this.fillRects();
//Set the rectanthis.gle buffer data
        //this.gl.bufferData(this.gl.ARRAY_BUFFER, this.data, this.gl.DYNAMIC_DRAW);
        //for(let i=0; i<6; ++i) {
            //this.gl.uniform1f(this.shiftLoc, i);
            //this.gl.drawArrays(this.gl.TRIANGLES, 0, this.RECTANGLE_COUNT);
        //}
        //rects += this.RECTANGLE_COUNT;

        // draw
        //let primitiveType = this.gl.TRIANGLES;
        //let offset = 0;
        //let count = 6;
        //this.gl.drawArrays(primitiveType, offset, count);
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