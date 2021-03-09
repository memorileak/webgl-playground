attribute vec3 a_vertex;
uniform mat4 u_view_matrix;
uniform mat4 u_world_to_camera_matrix;

attribute vec3 a_normal;
uniform vec3 u_directional_light;

varying vec3 v_normal;

void main() {
  gl_Position = u_view_matrix * vec4(a_vertex, 1.0);
  v_normal = (u_world_to_camera_matrix * vec4(a_normal, 1)).xyz - (u_world_to_camera_matrix * vec4(0, 0, 0, 1)).xyz;
}
