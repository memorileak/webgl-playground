window.m4 = (function() {
  function translate(tx, ty, tz) {
    return [
      1,  0,  0,  0,
      0,  1,  0,  0,
      0,  0,  1,  0,
      tx, ty, tz, 1,
    ];
  }

  function scale(sx, sy, sz) {
    return [
      sx, 0,  0,  0,
      0,  sy, 0,  0,
      0,  0,  sz, 0,
      0,  0,  0,  1,
    ];
  }

  function xRotate(rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    return [
      1, 0,  0, 0,
      0, c,  s, 0,
      0, -s, c, 0,
      0, 0,  0, 1,
    ];
  }

  function yRotate(rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    return [
      c, 0, -s, 0,
      0, 1, 0,  0,
      s, 0, c,  0,
      0,  0, 0, 1,
    ];
  }

  function zRotate(rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    return [
      c,  s, 0, 0,
      -s, c, 0, 0,
      0,  0, 1, 0,
      0,  0, 0, 1,
    ];
  }

  // convert pixel space to clip space 
  // -width/2 -> width/2 to -1 -> 1
  // -height/2 -> height/2 to -1 -> 1
  // -depth/2 -> depth/2 to -1 -> 1
  function project(width, height, depth, nearScale = 1.5, farScale = 0.5) {
    return [
      2/width, 0,        0,        0,
      0,       2/height, 0,        0,
      0,       0,        2/depth,  (nearScale - farScale)/depth,
      0,       0,        0,        (nearScale + farScale)/2,
    ];
  }

  function multiply(m1, m2) {
    return [
      m1[0] * m2[0] + m1[4] * m2[1] + m1[8]  * m2[2] + m1[12] * m2[3],
      m1[1] * m2[0] + m1[5] * m2[1] + m1[9]  * m2[2] + m1[13] * m2[3],
      m1[2] * m2[0] + m1[6] * m2[1] + m1[10] * m2[2] + m1[14] * m2[3],
      m1[3] * m2[0] + m1[7] * m2[1] + m1[11] * m2[2] + m1[15] * m2[3],

      m1[0] * m2[4] + m1[4] * m2[5] + m1[8]  * m2[6] + m1[12] * m2[7],
      m1[1] * m2[4] + m1[5] * m2[5] + m1[9]  * m2[6] + m1[13] * m2[7],
      m1[2] * m2[4] + m1[6] * m2[5] + m1[10] * m2[6] + m1[14] * m2[7],
      m1[3] * m2[4] + m1[7] * m2[5] + m1[11] * m2[6] + m1[15] * m2[7],

      m1[0] * m2[8] + m1[4] * m2[9] + m1[8]  * m2[10] + m1[12] * m2[11],
      m1[1] * m2[8] + m1[5] * m2[9] + m1[9]  * m2[10] + m1[13] * m2[11],
      m1[2] * m2[8] + m1[6] * m2[9] + m1[10] * m2[10] + m1[14] * m2[11],
      m1[3] * m2[8] + m1[7] * m2[9] + m1[11] * m2[10] + m1[15] * m2[11],

      m1[0] * m2[12] + m1[4] * m2[13] + m1[8]  * m2[14] + m1[12] * m2[15],
      m1[1] * m2[12] + m1[5] * m2[13] + m1[9]  * m2[14] + m1[13] * m2[15],
      m1[2] * m2[12] + m1[6] * m2[13] + m1[10] * m2[14] + m1[14] * m2[15],
      m1[3] * m2[12] + m1[7] * m2[13] + m1[11] * m2[14] + m1[15] * m2[15],
    ];
  }

  function inverse(m) {
    const m00 = m[0 * 4 + 0];
    const m01 = m[0 * 4 + 1];
    const m02 = m[0 * 4 + 2];
    const m03 = m[0 * 4 + 3];
    const m10 = m[1 * 4 + 0];
    const m11 = m[1 * 4 + 1];
    const m12 = m[1 * 4 + 2];
    const m13 = m[1 * 4 + 3];
    const m20 = m[2 * 4 + 0];
    const m21 = m[2 * 4 + 1];
    const m22 = m[2 * 4 + 2];
    const m23 = m[2 * 4 + 3];
    const m30 = m[3 * 4 + 0];
    const m31 = m[3 * 4 + 1];
    const m32 = m[3 * 4 + 2];
    const m33 = m[3 * 4 + 3];
    const tmp_0  = m22 * m33;
    const tmp_1  = m32 * m23;
    const tmp_2  = m12 * m33;
    const tmp_3  = m32 * m13;
    const tmp_4  = m12 * m23;
    const tmp_5  = m22 * m13;
    const tmp_6  = m02 * m33;
    const tmp_7  = m32 * m03;
    const tmp_8  = m02 * m23;
    const tmp_9  = m22 * m03;
    const tmp_10 = m02 * m13;
    const tmp_11 = m12 * m03;
    const tmp_12 = m20 * m31;
    const tmp_13 = m30 * m21;
    const tmp_14 = m10 * m31;
    const tmp_15 = m30 * m11;
    const tmp_16 = m10 * m21;
    const tmp_17 = m20 * m11;
    const tmp_18 = m00 * m31;
    const tmp_19 = m30 * m01;
    const tmp_20 = m00 * m21;
    const tmp_21 = m20 * m01;
    const tmp_22 = m00 * m11;
    const tmp_23 = m10 * m01;

    const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) - (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) - (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) - (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) - (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    return [
      d * t0,
      d * t1,
      d * t2,
      d * t3,
      d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) - (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
      d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) - (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
      d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) - (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
      d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) - (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
      d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) - (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
      d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) - (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
      d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) - (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
      d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) - (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
      d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) - (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
      d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) - (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
      d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) - (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
      d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) - (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02)),
    ];
  }

  function normalize(v) {
    const vLength = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return [v[0] / vLength, v[1] / vLength, v[2] / vLength];
  }

  function subtract(v1, v2) {
    return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
  }

  function dotProduct(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
  }

  function crossProduct(v1, v2) {
    return [
      v1[1] * v2[2] - v1[2] * v2[1],
      v1[2] * v2[0] - v1[0] * v2[2],
      v1[0] * v2[1] - v1[1] * v2[0],
    ];
  }

  function cameraLookat(position, target, up) {
    const cameraZAxisUnit = normalize(subtract(position, target));
    const cameraXAxisUnit = normalize(crossProduct(up, cameraZAxisUnit));
    const cameraYAxisUnit = normalize(crossProduct(cameraZAxisUnit, cameraXAxisUnit));
    return [
      cameraXAxisUnit[0], cameraXAxisUnit[1], cameraXAxisUnit[2], 0,
      cameraYAxisUnit[0], cameraYAxisUnit[1], cameraYAxisUnit[2], 0,
      cameraZAxisUnit[0], cameraZAxisUnit[1], cameraZAxisUnit[2], 0,
      position[0],        position[1],        position[2],        1,
    ];
  }

  function transformVectorByOneMatrix(v, m) {
    if (v[3] === undefined) {
      v[3] = 1;
    }
    return [
      m[0] * v[0] + m[4] * v[1] + m[8]  * v[2] + m[12] * v[3],
      m[1] * v[0] + m[5] * v[1] + m[9]  * v[2] + m[13] * v[3],
      m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14] * v[3],
      // m[3] * v[0] + m[7] * v[1] + m[11] * v[2] + m[15] * v[3],
    ];
  }

  function transformVector(vector, ...matrices) {
    let result = vector;
    for (let i = 0; i < matrices.length; i += 1) {
      result = transformVectorByOneMatrix(result, matrices[i]);
    }
    return result;
  }

  function calTransformMatrix(...matrices) {
    let result = matrices[0];
    for (let i = 1; i < matrices.length; i += 1) {
      result = multiply(result, matrices[i]);
    }
    return result;
  }

  return {
    translate: translate,
    scale: scale,
    xRotate: xRotate,
    yRotate: yRotate,
    zRotate: zRotate,
    project: project,
    multiply: multiply,
    inverse: inverse,
    calTransformMatrix: calTransformMatrix,
    normalize: normalize,
    subtract: subtract,
    dotProduct: dotProduct,
    crossProduct: crossProduct,
    cameraLookat: cameraLookat,
    transformVector: transformVector,
  };
})();
