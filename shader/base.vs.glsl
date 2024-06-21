attribute vec2 posuv;

void main() {
    gl_Position = vec4(posuv, 0.0, 1.0);
}