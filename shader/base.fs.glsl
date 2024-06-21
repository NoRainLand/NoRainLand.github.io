#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D texture;
uniform vec2 size;



void main() {
    vec2 uv = gl_FragCoord.xy / size.xy;
    uv.y = 1.0 - uv.y; // 翻转 y 坐标
    vec4 texColor = texture2D(texture, uv);
    gl_FragColor = texColor;
}