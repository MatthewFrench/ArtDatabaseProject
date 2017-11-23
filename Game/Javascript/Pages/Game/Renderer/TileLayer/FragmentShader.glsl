precision mediump float;
varying vec4 param;
void main() {
    float border = step(param.z, param.x) *
                   step(param.w, param.y) *
                   step(param.z, 1.0 - param.x) *
                   step(param.w, 1.0 - param.y);
    gl_FragColor = vec4(border * vec3(1,1,1), 1);
}