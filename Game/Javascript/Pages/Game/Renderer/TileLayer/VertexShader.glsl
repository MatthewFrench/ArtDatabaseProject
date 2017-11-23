
precision mediump float;
attribute vec2 weight;
attribute vec4 rect0, rect1, rect2, rect3, rect4, rect5;
uniform vec2 shape;
uniform float shift, scale;
varying vec4 param;

float eq(float a, float b) {
    return 1.0 - step(1.0, abs(a - b));
}
void main() {
    float index = mod(weight.x + shift, 6.0);
    float e0 = eq(index, 0.0),
    e1 = eq(index, 1.0),
    e2 = eq(index, 2.0),
    e3 = eq(index, 3.0),
    e4 = eq(index, 4.0),
    e5 = eq(index, 5.0);
    vec4 rect = rect0 * e0 + rect1 * e1 +
                rect2 * e2 + rect3 * e3 +
                rect4 * e4 + rect5 * e5;
    vec2 corner = vec2(e1 + e3 + e5,
                       e2 + e4 + e5);
    rect.zw = max(2.0/shape, 0.25 * rect.zw);
    param = vec4(corner, 2.0/(shape * rect.zw));
    gl_Position = vec4( 2.0*(rect.xy + corner * rect.zw) - 1.0,
                    (weight.y - step(5.5 - shift, weight.x)) * scale + shift/6.0,
                    1.0);
}