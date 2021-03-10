function main() {
  const canvas = document.getElementById('c');
  const gl = canvas.getContext('webgl');
  if (!gl) {
    console.log('No WebGL for you!');
  } else {
    let vertexShaderSource = '';
    let fragmentShaderSource = '';

    axios.get('/scripts/shaders/vertex-shader.vert')
      .then((vresponse) => {
        vertexShaderSource = vresponse.data;
        return axios.get('/scripts/shaders/fragment-shader.frag');
      })
      .then((fresponse) => {
        fragmentShaderSource = fresponse.data;
        runWebGl(gl, vertexShaderSource, fragmentShaderSource);
      })
      .catch((err) => {
        console.error(err);
      });
    }
};

function degToRad(d) {
  return d * Math.PI / 180;
}

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function runWebGl(gl, vertexShaderSource, fragmentShaderSource) {
  // Crate Shaders and link them to a program
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = createProgram(gl, vertexShader, fragmentShader);

  // Currently use this program for GL
  gl.useProgram(program);

  // Create and bind buffer to gl global bind point
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  const cube = [
    // front
    0, 0, 300,
    300, 0, 300,
    300, 300, 300,
    300, 300, 300,
    0, 300, 300,
    0, 0, 300,
    
    // back
    0, 0, 0,
    0, 300, 0,
    300, 300, 0,
    300, 300, 0,
    300, 0, 0,
    0, 0, 0,

    // right
    300, 300, 300,
    300, 0, 300,
    300, 0, 0,
    300, 0, 0,
    300, 300, 0,
    300, 300, 300,

    // left
    0, 0, 0,
    0, 0, 300, 
    0, 300, 300,
    0, 300, 300,
    0, 300, 0,
    0, 0, 0,

    // top
    0, 300, 0,
    0, 300, 300,
    300, 300, 300,
    300, 300, 300,
    300, 300, 0,
    0, 300, 0,

    // bottom
    0, 0, 0,
    300, 0, 0,
    300, 0, 300,
    300, 0, 300,
    0, 0, 300,
    0, 0, 0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube), gl.STATIC_DRAW);

  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  const normals = [
    // front
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    
    // back
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,

    // right
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    // left
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,

    // top
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    // bottom
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

  // Get locations of neccessary vars in program
  const aVertexLocation = gl.getAttribLocation(program, 'a_vertex');
  const uViewMatrixLocation = gl.getUniformLocation(program, 'u_view_matrix');
  const uWorldToCameraMatrixLocation = gl.getUniformLocation(program, 'u_world_to_camera_matrix');
  const aNormalLocation = gl.getAttribLocation(program, 'a_normal');
  const uDirectionalLightLocation = gl.getUniformLocation(program, 'u_directional_light');

  let cameraPosition = m4.transformVector(
    [0, 0, 400], 
    m4.xRotate(degToRad(-20)),
    m4.yRotate(degToRad(20)),
  );

  function draw() {
    const worldToCameraMatrix = m4.inverse(m4.cameraLookat(cameraPosition, [0, 0, 0], [0, 1, 0]));

    const viewMatrix = m4.calTransformMatrix(
      m4.project(1280, 720, 1280),
      worldToCameraMatrix,
      m4.translate(-150, -150, -150),
    );

    // RENDER
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(uViewMatrixLocation, false, viewMatrix);
    gl.uniformMatrix4fv(uWorldToCameraMatrixLocation, false, worldToCameraMatrix);
    gl.uniform3fv(uDirectionalLightLocation, [0, 0, -1]);

    gl.enableVertexAttribArray(aVertexLocation);
    gl.enableVertexAttribArray(aNormalLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(aNormalLocation, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    const size = 3;          // 2 components per iteration
    const type = gl.FLOAT;   // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(aVertexLocation, size, type, normalize, stride, offset);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

    const primitiveType = gl.TRIANGLES;
    const count = 36;
    gl.drawArrays(primitiveType, offset, count);

    window.requestAnimationFrame(() => {
      cameraPosition = m4.transformVector(
        cameraPosition, 
        m4.yRotate(degToRad(1)), 
        // m4.xRotate(degToRad(1)), 
      );
      draw();
    });
  }
  
  window.requestAnimationFrame(() => {draw()});
}

window.addEventListener('load', main);
