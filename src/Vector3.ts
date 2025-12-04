import { type IMatrix4 } from './IMatrix4';
import { type Coordinate3D } from './interfaces';

/**
 * Represents a 3D vector with x, y, and z components.
 * Provides various vector operations for 3D mathematics and transformations.
 * @public
 */
class Vector3 {
  /**
   * The x component of the vector
   */
  x: number;

  /**
   * The y component of the vector
   */
  y: number;

  /**
   * The z component of the vector
   */
  z: number;

  /**
   * Creates a new Vector3 instance
   * @param x - The x component of the vector. Defaults to 0
   * @param y - The y component of the vector. Defaults to 0
   * @param z - The z component of the vector. Defaults to 0
   */
  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Sets the components of this vector
   * @param x - The new x component
   * @param y - The new y component
   * @param z - The new z component
   * @returns Returns this vector for method chaining
   */
  set(x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  /**
   * Sets the x component of this vector
   * @param x - The new x component
   * @returns Returns this vector for method chaining
   */
  setX(x: number): this {
    this.x = x;
    return this;
  }

  /**
   * Sets the y component of this vector
   * @param y - The new y component
   * @returns Returns this vector for method chaining
   */
  setY(y: number): this {
    this.y = y;
    return this;
  }

  /**
   * Sets the z component of this vector
   * @param z - The new z component
   * @returns Returns this vector for method chaining
   */
  setZ(z: number): this {
    this.z = z;
    return this;
  }

  /**
   * Computes the length (magnitude) of this vector
   * @returns The length of the vector
   */
  length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  /**
   * Computes the squared length of this vector (avoids sqrt for performance)
   * @returns The squared length of the vector
   */
  lengthSquared(): number {
    return this.x ** 2 + this.y ** 2 + this.z ** 2;
  }

  /**
   * Computes the distance between this vector and another vector
   * @param vector - The other vector to measure distance to
   * @returns The distance between the vectors
   */
  distanceTo(vector: Vector3): number {
    return Math.sqrt(this.distanceToSquared(vector));
  }

  /**
   * Computes the squared distance between this vector and another vector
   * (avoids sqrt for performance)
   * @param vector - The other vector to measure distance to
   * @returns The squared distance between the vectors
   */
  distanceToSquared(vector: Vector3): number {
    return (vector.x - this.x) ** 2 + (vector.y - this.y) ** 2 + (vector.z - this.z) ** 2;
  }

  /**
   * Transforms the direction of this vector by a 4x4 matrix
   * @param matrix - The 4x4 matrix to apply
   * @returns Returns this vector for method chaining
   */
  transformDirection(matrix: IMatrix4): this {
    const { x, y, z } = this;
    const e = matrix.toArray();
    this.x = e[0] * x + e[4] * y + e[8] * z;
    this.y = e[1] * x + e[5] * y + e[9] * z;
    this.z = e[2] * x + e[6] * y + e[10] * z;
    return this.unit();
  }

  /**
   * Multiplies this vector by a 4x4 matrix
   * @param matrix - The 4x4 matrix to apply
   * @returns Returns this vector for method chaining
   */
  applyMatrix4(matrix: IMatrix4): this {
    const e = matrix.toArray();
    const x = this.x, y = this.y, z = this.z;
    const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
    this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
    this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
    this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
    return this;
  }

  /**
   * Multiplies this vector by a scalar
   * @param num - The scalar value to multiply by
   * @returns Returns this vector for method chaining
   */
  multiplyScalar(num: number): this {
    this.x *= num;
    this.y *= num;
    this.z *= num;
    return this;
  }

  /**
   * Divides this vector by a scalar
   * @param num - The scalar value to divide by
   * @returns Returns this vector for method chaining
   */
  divideScalar(num: number): this {
    this.x /= num;
    this.y /= num;
    this.z /= num;
    return this;
  }

  /**
   * Adds another vector to this vector
   * @param vector - The vector to add
   * @returns Returns this vector for method chaining
   */
  add(vector: Vector3): this {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    return this;
  }

  /**
   * Subtracts another vector from this vector
   * @param vector - The vector to subtract
   * @returns Returns this vector for method chaining
   */
  subtract(vector: Vector3): this {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
    return this;
  }

  /**
   * Multiplies this vector component-wise by another vector
   * @param vector - The vector to multiply by
   * @returns Returns this vector for method chaining
   */
  multiply(vector: Vector3): this {
    this.x *= vector.x;
    this.y *= vector.y;
    this.z *= vector.z;
    return this;
  }

  /**
   * Divides this vector component-wise by another vector
   * @param vector - The vector to divide by
   * @returns Returns this vector for method chaining
   */
  divide(vector: Vector3): this {
    this.x /= vector.x;
    this.y /= vector.y;
    this.z /= vector.z;
    return this;
  }

  /**
   * Normalizes this vector to unit length (length = 1)
   * @returns Returns this vector for method chaining
   */
  unit(): this {
    const length = this.length() || 1;
    this.x /= length;
    this.y /= length;
    this.z /= length;
    return this;
  }

  /**
   * Computes the dot product of this vector with another vector
   * @param vector - The other vector for the dot product
   * @returns The dot product result
   */
  dot(vector: Vector3): number {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }

  /**
   * Computes the cross product of this vector with another vector
   * @param vector - The other vector for the cross product
   * @returns Returns this vector with cross product result for method chaining
   */
  cross(vector: Vector3): this {
    return this.crossVectors(this, vector);
  }

  /**
   * Computes the cross product of two vectors and stores the result in this vector
   * @param a - The first vector
   * @param b - The second vector
   * @returns Returns this vector with cross product result for method chaining
   */
  crossVectors(a: Vector3, b: Vector3): this {
    const ax = a.x, ay = a.y, az = a.z;
    const bx = b.x, by = b.y, bz = b.z;

    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;
    return this;
  }

  /**
   * Rotates the vector around an axis by a given angle
   * Based on Rodrigues' rotation formula
   * @param angle - The rotation angle in radians
   * @param axis - The rotation axis
   * @returns Returns this vector for method chaining
   */
  rotate(angle: number, axis: Coordinate3D): this {
    const u = this.x;
    const v = this.y;
    const w = this.z;
    const { x, y, z } = axis;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const m = (x * u + y * v + z * w) * (1 - cos);

    this.x = u * cos + (y * w - z * v) * sin + x * m;
    this.y = v * cos + (z * u - x * w) * sin + y * m;
    this.z = w * cos + (x * v - y * u) * sin + z * m;
    return this;
  }

  /**
   * Compares this vector with another vector for equality
   * @param vector - The vector to compare with
   * @returns True if vectors are equal, false otherwise
   */
  equal(vector: Vector3): boolean {
    return this.x === vector.x && this.y === vector.y && this.z === vector.z;
  }

  /**
   * Copies values from another vector into this vector
   * @param source - The vector to copy from
   * @returns Returns this vector for method chaining
   */
  copy(source: Vector3): this {
    return this.set(source.x, source.y, source.z);
  }

  /**
   * Creates a new vector with the same values as this vector
   * @returns A new Vector3 instance with copied values
   */
  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  /**
   * Converts this vector to an array of its components
   * @returns An array containing the vector's components [x, y, z]
   */
  toArray(): [number, number, number] {
    return [this.x, this.y, this.z];
  }
}

export { Vector3 };
