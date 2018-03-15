[vertex]
attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;
attribute vec2 aLightmapCoord;

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewProjectionMatrix;

varying highp vec2 vTextureCoord;
varying highp vec2 vLightmapCoord;
varying highp vec3 vLighting;

void main(void) {
  gl_Position = uModelViewProjectionMatrix* aVertexPosition;
  vTextureCoord = aTextureCoord;
  vLightmapCoord = aLightmapCoord;
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
uniform sampler2D uLightmapSampler;

varying highp vec2 vTextureCoord;
varying highp vec2 vLightmapCoord;
varying highp vec3 vLighting;

void main(void) {
  gl_FragColor = vec4( texture2D(uLightmapSampler, vLightmapCoord * vec2(0.5361869,0.5361869) + vec2(-0.00209448,-0.00209448)).rgb,1);
  
//  highp vec4 texelColor = texture2D(uSampler, vTextureCoord.xy   );
//  texelColor.rgb = texelColor.rgb * texture2D(uLightmapSampler, vLightmapCoord).rgb;
//  gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}