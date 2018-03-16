[vertex]
attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec2 aLightmapCoord;

uniform mat4 uModelViewProjectionMatrix;
uniform vec4 uLightmapScaleOffset;

varying highp vec2 vTextureCoord;
varying highp vec2 vLightmapCoord;
varying highp vec3 vLighting;

void main(void) {
  gl_Position = uModelViewProjectionMatrix* aVertexPosition;
  vTextureCoord = aTextureCoord;
  vLightmapCoord = aLightmapCoord * uLightmapScaleOffset.xy + uLightmapScaleOffset.zw;  
  vLighting = vec3(0.1, 0.1, 0.1);
}

[face]
uniform sampler2D uSampler;
uniform sampler2D uLightmapSampler;

varying highp vec2 vTextureCoord;
varying highp vec2 vLightmapCoord;
varying highp vec3 vLighting;

void main(void) {
  highp vec4 texelColor = texture2D(uSampler, vTextureCoord.xy   );
  texelColor.rgb = texelColor.rgb * texture2D(uLightmapSampler, vLightmapCoord).rgb;
  gl_FragColor = vec4(texelColor.rgb, texelColor.a);
}