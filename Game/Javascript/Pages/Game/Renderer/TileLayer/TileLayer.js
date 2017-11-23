
export class TileLayer {

    constructor(pixelWidth, pixelHeight) {
        //Must be divisible by 6
        this.RECTANGLE_COUNT = 6e4;

//Vector Shader
        let VERT_SRC = require('./VertexShader.glsl');

//Fragment shader
        let FRAG_SRC = require('./FragmentShader.glsl');

//Create Canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = pixelWidth;
        this.canvas.height = pixelHeight;

        this.gl = this.canvas.getContext('webgl');

//Create program
        let program = this.gl.createProgram();
        //Bind vertex shader
        this.gl.attachShader(program, this.compileShader(this.gl.FRAGMENT_SHADER, FRAG_SRC));
        //Bind fragment shader
        this.gl.attachShader(program, this.compileShader(this.gl.VERTEX_SHADER, VERT_SRC));
//TODO: Lookup
        this.gl.bindAttribLocation(program, 0, 'weight');
        for(let i=0; i<6; ++i) {
            this.gl.bindAttribLocation(program, i+1, 'rect' + i);
        }
        this.gl.linkProgram(program);
        this.gl.useProgram(program);
//TODO: Lookup
        this.gl.uniform1f(
            this.gl.getUniformLocation(program, 'scale'),
            1.0/(6.0 * this.RECTANGLE_COUNT));
        this.gl.uniform2f(
            this.gl.getUniformLocation(program, 'shape'),
            pixelWidth, pixelHeight);
        this.shiftLoc = this.gl.getUniformLocation(program, 'shift');
//Fill rectangle information
        this.data = new Float32Array(4 * (this.RECTANGLE_COUNT + 12));
        for(let i=0; i<=6+this.RECTANGLE_COUNT; i+=6) {
            for(let j=0; j<6; ++j) {
                let p = 2*(i + j);
                this.data[p]   = 5-j;
                this.data[p+1] = i;
            }
        }
        let weightBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, weightBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.data, this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(0);
        this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 2*4, 0);


        let rectBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, rectBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.data, this.gl.DYNAMIC_DRAW);
        for(let i=0; i<6; ++i) {
            this.gl.enableVertexAttribArray(i+1);
            this.gl.vertexAttribPointer(i+1, 4, this.gl.FLOAT, false, 4*4, 4*4*i);
        }

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clearColor(0, 0, 0, 1);

        this.fillRects();
    }


    //This function initializes the rectangles with random this.data
    //It is currently the slowest part of this demo.
    fillRects = () => {
        for (let i=0; i<this.data.length; i++) {
            this.data[i] = Math.random()
        }
    };


    draw = () => {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        //Comment this line out to measure just rendering performance
        this.fillRects();

        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.data, this.gl.DYNAMIC_DRAW);
        for(let i=0; i<6; ++i) {
            this.gl.uniform1f(this.shiftLoc, i);
            this.gl.drawArrays(this.gl.TRIANGLES, i, this.RECTANGLE_COUNT);
        }
        //rects += this.RECTANGLE_COUNT;
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