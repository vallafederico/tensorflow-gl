precision highp float;

varying vec3 v_normal;
varying vec2 v_uv;
varying vec4 v_color;

uniform float u_a_happy;


void main() {

    vec3 col = mix(
        vec3(v_uv, 0.) , 
        vec3(v_uv, 1.) ,
        u_a_happy
    );
    
    gl_FragColor.rgb = col;
    gl_FragColor.a = 1.0;
}
