[vertex]
// Normal shader.
attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec4 aVertexTangent;
attribute vec2 aTextureCoord;

uniform mat4 uModelMatrix;
uniform mat4 uNormalMatrix;
uniform mat4 uModelViewProjectionMatrix;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;
varying highp mat3 mTBN;

void main(void) {
  gl_Position = uModelViewProjectionMatrix* aVertexPosition;
  vTextureCoord = aTextureCoord;
  // Apply lighting effect

  highp vec3 directionalLightColor = vec3(0.8, 0.8, 0.8);
  highp vec3 directionalVector = normalize(vec3(0.3, 1, -0.3));

	vec3 T = normalize(vec3(uModelMatrix * aVertexTangent));
	vec3 N = normalize(vec3(uModelMatrix * vec4(aVertexNormal, 0.0)));
	mTBN =  mat3(T, cross(N, T), N);

  highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
  vLighting = /*ambientLight +*/ (directionalLightColor * directional);
}

[face]
uniform sampler2D uSampler;
uniform sampler2D uNormalSampler;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;
varying highp mat3 mTBN;

void main(void) {
  highp vec3 ambientLight = vec3(0.15, 0.15, 0.15);
  highp vec4 texelColor = texture2D(uSampler, vTextureCoord.xy   );
  highp vec3 normal = mTBN *  normalize (texture2D(uNormalSampler,vTextureCoord.xy).xyz*2.0 - 1.0);
  highp vec3 directionalVector = normalize(vec3(0.3, 1, -0.3));
  highp float directional = max(dot(normal, directionalVector), 0.0);
  gl_FragColor = vec4(texelColor.rgb * (vLighting * directional + ambientLight), texelColor.a);
}