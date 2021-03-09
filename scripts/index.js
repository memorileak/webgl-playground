function main() {
  const canvas = document.getElementById('c');
  const gl = canvas.getContext('webgl');
  if (!gl) {
    console.log('No WebGL for you!');
  } else {
    let vertexShaderSource = '';
    let fragmentShaderSource = '';

    axios.get('/scripts/vertex-shader')
      .then((vresponse) => {
        vertexShaderSource = vresponse.data;
        return axios.get('/scripts/fragment-shader');
      })
      .then((fresponse) => {
        fragmentShaderSource = fresponse.data;
        
        // Crate Shaders and link them to a program
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        const program = createProgram(gl, vertexShader, fragmentShader);

        // Currently use this program for GL
        gl.useProgram(program);

        function drawTriangle(gl) {
          // Create and bind buffer to gl global bind point
          const xyBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, xyBuffer);

          // Push X-Y coordinates to bound buffer
          const xyCoords = [
            randomInteger(0, 1280), randomInteger(0, 720),
            randomInteger(0, 1280), randomInteger(0, 720),
            randomInteger(0, 1280), randomInteger(0, 720),
          ];
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(xyCoords), gl.STATIC_DRAW);

          // Get locations of neccessary vars in program
          const aXyLocation = gl.getAttribLocation(program, 'a_xy');
          const uProjectionMatrixLocation = gl.getUniformLocation(program, 'u_projection_matrix');

          render(gl, aXyLocation, uProjectionMatrixLocation, xyBuffer);

          setTimeout(() => {window.requestAnimationFrame(() => {drawTriangle(gl)})}, 1000);
        }

        window.requestAnimationFrame(() => {drawTriangle(gl)});
      })
      .catch((err) => {
        console.error(err);
      });
    }
};

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

function render(gl, aXyLocation, uProjectionMatrixLocation, xyBuffer) {
  const projectionMatrix = new Float32Array([
    2 / gl.canvas.width, 0,                     0, 0,
    0,                   2 / gl.canvas.height,  0, 0,
    0,                   0,                     0, 0,
    -1,                  -1,                    0, 1,
  ]);

  // Set viewport width and height
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Set value for the projection matrix
  gl.uniformMatrix4fv(
    uProjectionMatrixLocation, // Projection matrix uniform location
    false,                     // Transpose must be false
    projectionMatrix,          // The projection matrix
  );

  // Next we need to tell WebGL how to take data from the buffer we setup above and supply it to the attribute in the shader. 
  // First off we need to turn the attribute on
  gl.enableVertexAttribArray(aXyLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, xyBuffer);

  // Tell the attribute how to get data out of the buffer currently bound to gl.ARRAY_BUFFER (xyBuffer)
  // After call gl.vertexAttribPointer, the gl.ARRAY_BUFFER is free to bind to another buffer, 
  // because a_xy attribute has been set to use data from xyBuffer
  const size = 2;          // 2 components per iteration
  const type = gl.FLOAT;   // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(aXyLocation, size, type, normalize, stride, offset);

  // draw
  const primitiveType = gl.TRIANGLES;
  const count = 3;
  gl.drawArrays(primitiveType, offset, count);
}

window.addEventListener('load', main);
