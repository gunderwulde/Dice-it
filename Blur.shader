[vertex]
attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
varying highp vec4 vVertexColor;

void main(void) {
  vVertexColor = aVertexColor;
  gl_Position = vec4(aVertexPosition, 1.0);
}

[face]
varying highp vec4 vVertexColor;
uniform highp float Alpha;
void main(void) {
  gl_FragColor = vec4( vVertexColor.rgb, vVertexColor.a * Alpha);
}