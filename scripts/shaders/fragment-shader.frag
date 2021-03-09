precision mediump float;

uniform vec3 u_directional_light;

varying vec3 v_normal;

void main() {
  float cosphi = dot(v_normal, u_directional_light) / (length(v_normal) * length(u_directional_light));
  gl_FragColor = vec4(0.160, 0.594, 1.00, 1.00);
  gl_FragColor.rgb *= -cosphi;
}
