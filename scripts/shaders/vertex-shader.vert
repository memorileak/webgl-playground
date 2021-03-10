attribute vec3 a_vertex;
uniform mat4 u_view_matrix;
uniform mat4 u_world_to_camera_matrix;

attribute vec3 a_normal;
uniform vec3 u_directional_light;

varying vec3 v_normal;

void main() {
  vec4 position_without_perspective = u_view_matrix * vec4(a_vertex, 1.0);
  gl_Position = vec4(position_without_perspective.xy * position_without_perspective.w, position_without_perspective.z, 1);
  v_normal = (u_world_to_camera_matrix * vec4(a_normal, 1)).xyz - (u_world_to_camera_matrix * vec4(0, 0, 0, 1)).xyz;
}
