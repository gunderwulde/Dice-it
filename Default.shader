[vertex]
attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewProjectionMatrix;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

void main(void) {
  gl_Position = uModelViewProjectionMatrix* aVertexPosition;
  vTextureCoord = aTextureCoord;
  // Apply lighting effect
  highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
  highp vec3 directionalLightColor = vec3(0.8, 0.8, 0.8);
  highp vec3 directionalVector = normalize(vec3(0.8, 0.8, -0.8));
  highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
  vLighting = ambientLight + (directionalLightColor * directional);
}

[face]
uniform sampler2D uSampler;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

void main(void) {
  highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
  gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}
