precision highp float;

varying vec3 v_normal;
varying vec2 v_uv;




uniform float u_a_happy;
    
void main() {

  vec3 col = mix(
        vec3(v_uv, 0.) , 
        vec3(v_uv, 1.) ,
        u_a_happy
    );
    
    gl_FragColor.rgb = 1. - col;

  // gl_FragColor.rgb = vec3(v_uv, 2.);
  gl_FragColor.a = 1.0;
}
