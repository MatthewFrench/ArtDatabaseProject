
precision mediump float;
attribute vec2 a_position;
attribute vec4 a_color;
uniform vec2 u_resolution;
uniform vec2 u_position;

varying vec4 fragment_Color;

void main() {
    vec2 position = a_position + u_position;
    // convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = position / u_resolution;

    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // convert from 0->2 to -1->+1 (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace, 0, 1);
    //Set color
    fragment_Color = a_color / 255.0;
}