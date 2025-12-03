import { Vector3 } from './Vector3';
import { Euler } from './Euler';
import { Quaternion } from './Quaternion';
import { type Coordinate3D, type Tuple } from './interfaces';
import { Vector4 } from './Vector4';

/**
 * Type definition for a 4x4 matrix represented as a 16-element array in column-major order.
 */
export type Matrix4Tuple = Tuple<number, 16>;

/**
 * Interface representing a plane equation in the form ax + by + cz + d = 0.
 */
export interface PlaneEquation {
  /** The a coefficient of the plane equation. */
  a: number;
  /** The b coefficient of the plane equation. */
  b: number;
  /** The c coefficient of the plane equation. */
  c: number;
  /** The d coefficient of the plane equation. */
  d: number;
}

/**
 * Represents a 4x4 transformation matrix used for 3D transformations.
 * This class provides methods for matrix composition, decomposition, multiplication,
 * inversion, and various transformation operations like translation, rotation, and scaling.
 */
class Matrix4 {
  /**
   * Static quaternion instance used for internal calculations to avoid redundant object creation.
   */
  private static readonly _quat: Quaternion = new Quaternion();

  /**
   * The 16-element array representing the matrix values in column-major order.
   */
  private _value: Matrix4Tuple;

  /**
   * Constructs a new Matrix4 instance.
   * @param value Optional initial matrix values. If not provided, identity matrix is created.
   */
  constructor(value?: Matrix4Tuple) {
    this._value = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
    if (value) {
      for (let i = 0; i < value.length; i += 1) {
        this._value[i] = value[i];
      }
    }
  }

  /**
   * Composes this matrix from position, Euler rotation, and scale components.
   * @param position The translation component.
   * @param euler The rotation component as Euler angles.
   * @param scale The scaling component.
   * @returns This matrix for chaining.
   */
  compose(position: Vector3, euler: Euler, scale: Vector3): this {
    const { x, y, z, w } = Matrix4._quat.setFromEuler(euler);

    const te = this._value;
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;

    const sx = scale.x, sy = scale.y, sz = scale.z;

    te[0] = (1 - (yy + zz)) * sx;
    te[1] = (xy + wz) * sx;
    te[2] = (xz - wy) * sx;
    te[3] = 0;

    te[4] = (xy - wz) * sy;
    te[5] = (1 - (xx + zz)) * sy;
    te[6] = (yz + wx) * sy;
    te[7] = 0;

    te[8] = (xz + wy) * sz;
    te[9] = (yz - wx) * sz;
    te[10] = (1 - (xx + yy)) * sz;
    te[11] = 0;

    te[12] = position.x;
    te[13] = position.y;
    te[14] = position.z;
    te[15] = 1;

    return this;
  }

  /**
   * Decomposes this matrix into its position, Euler rotation, and scale components.
   * @param outPosition The vector to store the extracted position.
   * @param outEuler The Euler object to store the extracted rotation.
   * @param outScale The vector to store the extracted scale.
   * @returns This matrix for chaining.
   */
  decompose(outPosition: Vector3, outEuler: Euler, outScale: Vector3): this {
    const te = this._value;

    const v = new Vector3();

    let sx = v.set(te[0], te[1], te[2]).length();
    const sy = v.set(te[4], te[5], te[6]).length();
    const sz = v.set(te[8], te[9], te[10]).length();

    // If determinant is negative, we need to invert one scale
    const det = this.determinant();
    if (det < 0) {
      sx = -sx;
    }

    outPosition.set(te[12], te[13], te[14]);
    outScale.set(sx, sy, sz);

    // Scale the rotation part
    const m1 = this.clone();

    const invSX = 1 / sx;
    const invSY = 1 / sy;
    const invSZ = 1 / sz;

    const elements = this._value;

    elements[0] *= invSX;
    elements[1] *= invSX;
    elements[2] *= invSX;

    elements[4] *= invSY;
    elements[5] *= invSY;
    elements[6] *= invSY;

    elements[8] *= invSZ;
    elements[9] *= invSZ;
    elements[10] *= invSZ;

    outEuler.setFromRotationMatrix(m1);

    return this;
  }

  /**
   * Sets this matrix to the identity matrix.
   * @returns This matrix for chaining.
   */
  identity(): this {
    const e = this._value;
    e[0] = 1; e[4] = 0; e[8] = 0; e[12] = 0;
    e[1] = 0; e[5] = 1; e[9] = 0; e[13] = 0;
    e[2] = 0; e[6] = 0; e[10] = 1; e[14] = 0;
    e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
    return this;
  }

  /**
   * Multiplies two matrices (this = a * b) and stores the result in this matrix.
   * @param a The first matrix to multiply.
   * @param b The second matrix to multiply.
   * @returns This matrix for chaining.
   */
  multiplyMatrices(a: Matrix4, b: Matrix4): this {
    const ae = a._value;
    const be = b._value;
    const te = this._value;

    const a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
    const a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
    const a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
    const a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

    const b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
    const b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
    const b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
    const b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];

    te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

    te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

    te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

    te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return this;
  }

  /**
   * Multiplies this matrix by another matrix (this = this * other).
   * @param other The matrix to multiply with this matrix.
   * @returns This matrix for chaining.
   */
  multiply(other: Matrix4): this {
    return this.multiplyMatrices(this, other);
  }

  /**
   * Premultiplies this matrix by another matrix (this = other * this).
   * @param other The matrix to premultiply with this matrix.
   * @returns This matrix for chaining.
   */
  premultiply(other: Matrix4): this {
    return this.multiplyMatrices(other, this);
  }

  /**
   * Transposes this matrix in place.
   * @returns This matrix for chaining.
   */
  transpose(): this {
    let t = 0;

    const e = this._value;

    t = e[1]; e[1] = e[4]; e[4] = t;
    t = e[2]; e[2] = e[8]; e[8] = t;
    t = e[3]; e[3] = e[12]; e[12] = t;
    t = e[6]; e[6] = e[9]; e[9] = t;
    t = e[7]; e[7] = e[13]; e[13] = t;
    t = e[11]; e[11] = e[14]; e[14] = t;

    return this;
  }

  /**
   * Computes the inverse of this matrix and replaces this matrix with the result.
   * If the matrix is singular (not invertible), it remains unchanged.
   * @returns This matrix for chaining.
   */
  invert(): this {
    const s = this._value;
    const inv = [];

    inv[0] = s[5] * s[10] * s[15] - s[5] * s[11] * s[14] - s[9] * s[6] * s[15]
      + s[9] * s[7] * s[14] + s[13] * s[6] * s[11] - s[13] * s[7] * s[10];
    inv[4] = -s[4] * s[10] * s[15] + s[4] * s[11] * s[14] + s[8] * s[6] * s[15]
      - s[8] * s[7] * s[14] - s[12] * s[6] * s[11] + s[12] * s[7] * s[10];
    inv[8] = s[4] * s[9] * s[15] - s[4] * s[11] * s[13] - s[8] * s[5] * s[15]
      + s[8] * s[7] * s[13] + s[12] * s[5] * s[11] - s[12] * s[7] * s[9];
    inv[12] = -s[4] * s[9] * s[14] + s[4] * s[10] * s[13] + s[8] * s[5] * s[14]
      - s[8] * s[6] * s[13] - s[12] * s[5] * s[10] + s[12] * s[6] * s[9];

    inv[1] = -s[1] * s[10] * s[15] + s[1] * s[11] * s[14] + s[9] * s[2] * s[15]
      - s[9] * s[3] * s[14] - s[13] * s[2] * s[11] + s[13] * s[3] * s[10];
    inv[5] = s[0] * s[10] * s[15] - s[0] * s[11] * s[14] - s[8] * s[2] * s[15]
      + s[8] * s[3] * s[14] + s[12] * s[2] * s[11] - s[12] * s[3] * s[10];
    inv[9] = -s[0] * s[9] * s[15] + s[0] * s[11] * s[13] + s[8] * s[1] * s[15]
      - s[8] * s[3] * s[13] - s[12] * s[1] * s[11] + s[12] * s[3] * s[9];
    inv[13] = s[0] * s[9] * s[14] - s[0] * s[10] * s[13] - s[8] * s[1] * s[14]
      + s[8] * s[2] * s[13] + s[12] * s[1] * s[10] - s[12] * s[2] * s[9];

    inv[2] = s[1] * s[6] * s[15] - s[1] * s[7] * s[14] - s[5] * s[2] * s[15]
      + s[5] * s[3] * s[14] + s[13] * s[2] * s[7] - s[13] * s[3] * s[6];
    inv[6] = -s[0] * s[6] * s[15] + s[0] * s[7] * s[14] + s[4] * s[2] * s[15]
      - s[4] * s[3] * s[14] - s[12] * s[2] * s[7] + s[12] * s[3] * s[6];
    inv[10] = s[0] * s[5] * s[15] - s[0] * s[7] * s[13] - s[4] * s[1] * s[15]
      + s[4] * s[3] * s[13] + s[12] * s[1] * s[7] - s[12] * s[3] * s[5];
    inv[14] = -s[0] * s[5] * s[14] + s[0] * s[6] * s[13] + s[4] * s[1] * s[14]
      - s[4] * s[2] * s[13] - s[12] * s[1] * s[6] + s[12] * s[2] * s[5];

    inv[3] = -s[1] * s[6] * s[11] + s[1] * s[7] * s[10] + s[5] * s[2] * s[11]
      - s[5] * s[3] * s[10] - s[9] * s[2] * s[7] + s[9] * s[3] * s[6];
    inv[7] = s[0] * s[6] * s[11] - s[0] * s[7] * s[10] - s[4] * s[2] * s[11]
      + s[4] * s[3] * s[10] + s[8] * s[2] * s[7] - s[8] * s[3] * s[6];
    inv[11] = -s[0] * s[5] * s[11] + s[0] * s[7] * s[9] + s[4] * s[1] * s[11]
      - s[4] * s[3] * s[9] - s[8] * s[1] * s[7] + s[8] * s[3] * s[5];
    inv[15] = s[0] * s[5] * s[10] - s[0] * s[6] * s[9] - s[4] * s[1] * s[10]
      + s[4] * s[2] * s[9] + s[8] * s[1] * s[6] - s[8] * s[2] * s[5];

    let det = s[0] * inv[0] + s[1] * inv[4] + s[2] * inv[8] + s[3] * inv[12];
    if (det === 0) {
      return this;
    }

    det = 1 / det;
    for (let i = 0; i < 16; i += 1) {
      this._value[i] = inv[i] * det;
    }

    return this;
  }

  /**
   * Sets this matrix to an orthographic projection matrix.
   * @param left The coordinate for the left clipping plane.
   * @param right The coordinate for the right clipping plane.
   * @param bottom The coordinate for the bottom clipping plane.
   * @param top The coordinate for the top clipping plane.
   * @param near The distance to the near clipping plane.
   * @param far The distance to the far clipping plane.
   * @returns This matrix for chaining.
   */
  ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): this {
    if (left === right || bottom === top || near === far) {
      return this;
    }

    const rw = 1 / (right - left);
    const rh = 1 / (top - bottom);
    const rd = 1 / (far - near);

    const e = this._value;

    e[0] = 2 * rw;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;

    e[4] = 0;
    e[5] = 2 * rh;
    e[6] = 0;
    e[7] = 0;

    e[8] = 0;
    e[9] = 0;
    e[10] = -2 * rd;
    e[11] = 0;

    e[12] = -(right + left) * rw;
    e[13] = -(top + bottom) * rh;
    e[14] = -(far + near) * rd;
    e[15] = 1;

    return this;
  }

  /**
   * Sets this matrix to a frustum projection matrix.
   * @param left The coordinate for the left clipping plane.
   * @param right The coordinate for the right clipping plane.
   * @param bottom The coordinate for the bottom clipping plane.
   * @param top The coordinate for the top clipping plane.
   * @param near The distance to the near clipping plane.
   * @param far The distance to the far clipping plane.
   * @returns This matrix for chaining.
   */
  frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): this {
    if (left === right || top === bottom || near === far) {
      return this;
    }
    if (near <= 0) {
      return this;
    }
    if (far <= 0) {
      return this;
    }

    const rw = 1 / (right - left);
    const rh = 1 / (top - bottom);
    const rd = 1 / (far - near);

    const e = this._value;

    e[0] = 2 * near * rw;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;

    e[4] = 0;
    e[5] = 2 * near * rh;
    e[6] = 0;
    e[7] = 0;

    e[8] = (right + left) * rw;
    e[9] = (top + bottom) * rh;
    e[10] = -(far + near) * rd;
    e[11] = -1;

    e[12] = 0;
    e[13] = 0;
    e[14] = -2 * near * far * rd;
    e[15] = 0;

    return this;
  }

  /**
   * Sets this matrix to a perspective projection matrix.
   * @param fov Field of view in degrees.
   * @param aspect Aspect ratio (width / height).
   * @param near Distance to the near clipping plane.
   * @param far Distance to the far clipping plane.
   * @returns This matrix for chaining.
   */
  perspective(fov: number, aspect: number, near: number, far: number): this {
    if (near === far || aspect === 0) {
      return this;
    }
    if (near <= 0) {
      return this;
    }
    if (far <= 0) {
      return this;
    }

    const fovRad = Math.PI * fov / 180 / 2;
    const s = Math.sin(fovRad);
    if (s === 0) {
      return this;
    }

    const rd = 1 / (far - near);
    const ct = Math.cos(fovRad) / s;

    const e = this._value;

    e[0] = ct / aspect;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;

    e[4] = 0;
    e[5] = ct;
    e[6] = 0;
    e[7] = 0;

    e[8] = 0;
    e[9] = 0;
    e[10] = -(far + near) * rd;
    e[11] = -1;

    e[12] = 0;
    e[13] = 0;
    e[14] = -2 * near * far * rd;
    e[15] = 0;

    return this;
  }

  /**
   * Scales this matrix by the given factors.
   * @param x Scale factor along the X axis.
   * @param y Scale factor along the Y axis.
   * @param z Scale factor along the Z axis.
   * @returns This matrix for chaining.
   */
  scale(x: number, y: number, z: number): this {
    const e = this._value;
    e[0] *= x; e[4] *= y; e[8] *= z;
    e[1] *= x; e[5] *= y; e[9] *= z;
    e[2] *= x; e[6] *= y; e[10] *= z;
    e[3] *= x; e[7] *= y; e[11] *= z;
    return this;
  }

  /**
   * Translates this matrix by the given offset.
   * @param x Translation along the X axis.
   * @param y Translation along the Y axis.
   * @param z Translation along the Z axis.
   * @returns This matrix for chaining.
   */
  translate(x: number, y: number, z: number): this {
    const e = this._value;
    e[12] += e[0] * x + e[4] * y + e[8] * z;
    e[13] += e[1] * x + e[5] * y + e[9] * z;
    e[14] += e[2] * x + e[6] * y + e[10] * z;
    e[15] += e[3] * x + e[7] * y + e[11] * z;
    return this;
  }

  /**
   * Rotates this matrix around the specified axis by the given angle.
   * @param angle Rotation angle in radians (positive for counter-clockwise).
   * @param axis Rotation axis.
   * @returns This matrix for chaining.
   */
  rotate(angle: number, axis: Coordinate3D): this {
    const { x: xAxis, y: yAxis, z: zAxis } = axis;
    let len = Math.sqrt(xAxis ** 2 + yAxis ** 2 + zAxis ** 2);
    if (len === 0) {
      return this;
    }
    const a = this._value;

    len = 1 / len;
    const x = xAxis * len;
    const y = yAxis * len;
    const z = zAxis * len;

    const s = Math.sin(angle);
    const c = Math.cos(angle);
    const t = 1 - c;

    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];

    // Construct the elements of the rotation matrix
    const b00 = x * x * t + c, b01 = y * x * t + z * s, b02 = z * x * t - y * s;
    const b10 = x * y * t - z * s, b11 = y * y * t + c, b12 = z * y * t + x * s;
    const b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    a[0] = a00 * b00 + a10 * b01 + a20 * b02;
    a[1] = a01 * b00 + a11 * b01 + a21 * b02;
    a[2] = a02 * b00 + a12 * b01 + a22 * b02;
    a[3] = a03 * b00 + a13 * b01 + a23 * b02;
    a[4] = a00 * b10 + a10 * b11 + a20 * b12;
    a[5] = a01 * b10 + a11 * b11 + a21 * b12;
    a[6] = a02 * b10 + a12 * b11 + a22 * b12;
    a[7] = a03 * b10 + a13 * b11 + a23 * b12;
    a[8] = a00 * b20 + a10 * b21 + a20 * b22;
    a[9] = a01 * b20 + a11 * b21 + a21 * b22;
    a[10] = a02 * b20 + a12 * b21 + a22 * b22;
    a[11] = a03 * b20 + a13 * b21 + a23 * b22;

    return this;
  }

  /**
   * Sets this matrix to a rotation matrix derived from Euler angles.
   * @param euler Euler angles representing the rotation.
   * @returns This matrix for chaining.
   */
  rotateFromEuler(euler: Euler): this {
    return this.compose(new Vector3(0, 0, 0), euler, new Vector3(1, 1, 1));
  }

  /**
   * Creates a look-at view matrix.
   * @param eye Position of the eye/camera.
   * @param target Position of the target to look at.
   * @param up Up vector defining the camera orientation.
   * @returns This matrix for chaining.
   */
  lookAt(eye: Vector3, target: Vector3, up: Vector3): this {
    const { x: eyeX, y: eyeY, z: eyeZ } = eye;
    const { x: centerX, y: centerY, z: centerZ } = target;
    const { x: upX, y: upY, z: upZ } = up;

    let fx = centerX - eyeX;
    let fy = centerY - eyeY;
    let fz = centerZ - eyeZ;

    // Normalize f.
    const rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
    fx *= rlf;
    fy *= rlf;
    fz *= rlf;

    // Calculate cross product of f and up.
    let sx = fy * upZ - fz * upY;
    let sy = fz * upX - fx * upZ;
    let sz = fx * upY - fy * upX;

    // Normalize s.
    const rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz);
    sx *= rls;
    sy *= rls;
    sz *= rls;

    // Calculate cross product of s and f.
    const ux = sy * fz - sz * fy;
    const uy = sz * fx - sx * fz;
    const uz = sx * fy - sy * fx;

    // Set to this.
    const e = this._value;
    e[0] = sx;
    e[1] = ux;
    e[2] = -fx;
    e[3] = 0;

    e[4] = sy;
    e[5] = uy;
    e[6] = -fy;
    e[7] = 0;

    e[8] = sz;
    e[9] = uz;
    e[10] = -fz;
    e[11] = 0;

    e[12] = 0;
    e[13] = 0;
    e[14] = 0;
    e[15] = 1;

    // Translate.
    this.translate(-eyeX, -eyeY, -eyeZ);

    return this;
  }

  /**
   * Applies a drop shadow effect by multiplying with a shadow projection matrix.
   * @param plane The plane equation representing the surface where the shadow is cast.
   * @param light The light position/direction as a homogeneous vector.
   * @returns This matrix for chaining.
   */
  dropShadow(plane: PlaneEquation, light: Vector4): this {
    const mat = new Matrix4();
    const e = mat._value;
    const dot = plane.a * light.x + plane.b * light.y + plane.c * light.z + plane.d * light.w;

    e[0] = dot - light.x * plane.a;
    e[1] = -light.y * plane.a;
    e[2] = -light.z * plane.a;
    e[3] = -light.w * plane.a;

    e[4] = -light.x * plane.b;
    e[5] = dot - light.y * plane.b;
    e[6] = -light.z * plane.b;
    e[7] = -light.w * plane.b;

    e[8] = -light.x * plane.c;
    e[9] = -light.y * plane.c;
    e[10] = dot - light.z * plane.c;
    e[11] = -light.w * plane.c;

    e[12] = -light.x * plane.d;
    e[13] = -light.y * plane.d;
    e[14] = -light.z * plane.d;
    e[15] = dot - light.w * plane.d;

    return this.multiply(mat);
  }

  /**
   * Computes the determinant of this matrix.
   * Reference: http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
   * @returns The determinant of this matrix.
   */
  determinant(): number {
    const te = this._value;

    const n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12];
    const n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13];
    const n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14];
    const n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15];

    return (
      n41 * (
        +n14 * n23 * n32
        - n13 * n24 * n32
        - n14 * n22 * n33
        + n12 * n24 * n33
        + n13 * n22 * n34
        - n12 * n23 * n34
      )
      + n42 * (
        +n11 * n23 * n34
        - n11 * n24 * n33
        + n14 * n21 * n33
        - n13 * n21 * n34
        + n13 * n24 * n31
        - n14 * n23 * n31
      )
      + n43 * (
        +n11 * n24 * n32
        - n11 * n22 * n34
        - n14 * n21 * n32
        + n12 * n21 * n34
        + n14 * n22 * n31
        - n12 * n24 * n31
      )
      + n44 * (
        -n13 * n22 * n31
        - n11 * n23 * n32
        + n11 * n22 * n33
        + n13 * n21 * n32
        - n12 * n21 * n33
        + n12 * n23 * n31
      )

    );
  }

  /**
   * Checks if this matrix is equal to another matrix.
   * @param matrix The matrix to compare with this matrix.
   * @returns True if the matrices are equal, false otherwise.
   */
  equal(matrix: Matrix4): boolean {
    for (let i = 0; i < this._value.length; i += 1) {
      if (this._value[i] !== matrix._value[i]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Copies the values from another matrix into this matrix.
   * @param source The matrix to copy values from.
   * @returns This matrix for chaining.
   */
  copy(source: Matrix4): this {
    for (let i = 0; i < source._value.length; i += 1) {
      this._value[i] = source._value[i];
    }
    return this;
  }

  /**
   * Creates a new Matrix4 with the same values as this matrix.
   * @returns A new Matrix4 instance with the same values.
   */
  clone(): Matrix4 {
    return new Matrix4(this._value);
  }

  /**
   * Returns the matrix values as an array.
   * @returns The 16-element array representing this matrix.
   */
  toArray(): Matrix4Tuple {
    return this._value;
  }
}

export { Matrix4 };
