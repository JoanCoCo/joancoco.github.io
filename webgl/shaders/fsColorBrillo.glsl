 /*
  Fragment Shader con color uniform
  @uniform color : vec3 color del fragmento
  rvivo@upv.es 2014
 */

// Uniform
uniform highp vec2 canvas_size;

void main(void) {
    highp float middleX = canvas_size.x / 2.0;
    highp float middleY = canvas_size.y / 2.0;
    
    highp float dist = sqrt((gl_FragCoord.x - middleX) * (gl_FragCoord.x - middleX) + (gl_FragCoord.y - middleY) * (gl_FragCoord.y - middleY));
    
    highp float maxDist = sqrt(middleX * middleX + middleY * middleY);
    
    highp float value = 1.0 - dist / maxDist;
    
    highp vec3 brillo = vec3(value, value, value);
    
    gl_FragColor = vec4( brillo, 1.0 );
}
