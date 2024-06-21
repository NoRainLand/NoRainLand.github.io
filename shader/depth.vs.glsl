attribute vec4 posuv;
uniform vec4 clipMatDir;
uniform vec2 clipMatPos;
uniform vec2 size;

varying vec2 cliped;
varying vec4 v_texcoordAlpha;
void main() {
	vec4 pos = vec4(posuv.xy, 0., 1.);
	vec4 pos1 = vec4((pos.x / size.x - 0.5) * 2.0, (0.5 - pos.y / size.y) * 2.0, 0., 1.0);
	gl_Position = pos1;
	v_texcoordAlpha.xy = posuv.zw;

	float clipw = length(clipMatDir.xy);
	float cliph = length(clipMatDir.zw);

	vec2 clpos = clipMatPos.xy;
	vec2 clippos = pos.xy - clpos;
	if(clipw > 20000. && cliph > 20000.) {
		cliped = vec2(0.5, 0.5);
	} else {
		cliped = vec2(dot(clippos, clipMatDir.xy) / clipw / clipw, dot(clippos, clipMatDir.zw) / cliph / cliph);
	}
}