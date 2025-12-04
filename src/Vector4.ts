import { type IMatrix4 } from './IMatrix4';

/**
 * Represents a 4D vector with x, y, z, and w components.
 * Provides various vector operations for 4D mathematics and transformations.
 * @public
 */
class Vector4 {
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
   * The w component of the vector
   */
  w: number;

  /**
   * Creates a new Vector4 instance
   * @param x - The x component of the vector. Defaults to 0
   * @param y - The y component of the vector. Defaults to 0
   * @param z - The z component of the vector. Defaults to 0
   * @param w - The w component of the vector. Defaults to 0
   */
  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  /**
   * Sets the components of this vector
   * @param x - The new x component
   * @param y - The new y component
   * @param z - The new z component
   * @param w - The new w component
   * @returns Returns this vector for method chaining
   */
  set(x: number, y: number, z: number, w: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
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
   * Sets the w component of this vector
   * @param w - The new w component
   * @returns Returns this vector for method chaining
   */
  setW(w: number): this {
    this.w = w;
    return this;
  }

  /**
   * Applies a 4x4 matrix transformation to this vector
   * @param matrix - The 4x4 matrix to apply
   * @returns Returns this vector for method chaining
   */
  applyMatrix4(matrix: IMatrix4): this {
    const e = matrix.toArray();
    const x = this.x, y = this.y, z = this.z, w = this.w;
    this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
    this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
    this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
    this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;
    return this;
  }

  /**
   * Adds another vector to this vector
   * @param vector - The vector to add
   * @returns Returns this vector for method chaining
   */
  add(vector: Vector4): this {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    this.w += vector.w;
    return this;
  }

  /**
   * Subtracts another vector from this vector
   * @param vector - The vector to subtract
   * @returns Returns this vector for method chaining
   */
  subtract(vector: Vector4): this {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
    this.w -= vector.w;
    return this;
  }

  /**
   * Multiplies this vector component-wise by another vector
   * @param vector - The vector to multiply by
   * @returns Returns this vector for method chaining
   */
  multiply(vector: Vector4): this {
    this.x *= vector.x;
    this.y *= vector.y;
    this.z *= vector.z;
    this.w *= vector.w;
    return this;
  }

  /**
   * Divides this vector component-wise by another vector
   * @param vector - The vector to divide by
   * @returns Returns this vector for method chaining
   */
  divide(vector: Vector4): this {
    this.x /= vector.x;
    this.y /= vector.y;
    this.z /= vector.z;
    this.w /= vector.w;
    return this;
  }

  /**
   * Multiplies this vector by a scalar
   * @param num - The scalar value to multiply by
   * @returns Returns this vector for method chaining
   */
  multiplyScaler(num: number): this {
    this.x *= num;
    this.y *= num;
    this.z *= num;
    this.w *= num;
    return this;
  }

  /**
   * Divides this vector by a scalar
   * @param num - The scalar value to divide by
   * @returns Returns this vector for method chaining
   */
  divideScaler(num: number): this {
    this.x /= num;
    this.y /= num;
    this.z /= num;
    this.w /= num;
    return this;
  }

  /**
   * Normalizes this vector to unit length (length = 1)
   * @returns Returns this vector for method chaining
   * @throws Will throw an error if the vector length is zero
   */
  unit(): this {
    const length = this.length();
    this.x /= length;
    this.y /= length;
    this.z /= length;
    this.w /= length;
    return this;
  }

  /**
   * Computes the length (magnitude) of this vector
   * @returns The length of the vector
   */
  length(): number {
    return Math.sqrt(this.lengthSquare());
  }

  /**
   * Computes the squared length of this vector (avoids sqrt for performance)
   * @returns The squared length of the vector
   */
  lengthSquare(): number {
    return this.x ** 2 + this.y ** 2 + this.z ** 2 + this.w ** 2;
  }

  /**
   * Compares this vector with another vector for equality
   * @param vector - The vector to compare with
   * @returns True if vectors are equal, false otherwise
   */
  equal(vector: Vector4): boolean {
    return this.x === vector.x && this.y === vector.y && this.z === vector.z && this.w === vector.w;
  }

  /**
   * Copies values from another vector into this vector
   * @param source - The vector to copy from
   * @returns Returns this vector for method chaining
   */
  copy(source: Vector4): this {
    return this.set(source.x, source.y, source.z, source.w);
  }

  /**
   * Creates a new vector with the same values as this vector
   * @returns A new Vector4 instance with copied values
   */
  clone(): Vector4 {
    return new Vector4(this.x, this.y, this.z, this.w);
  }

  /**
   * Converts this vector to an array of its components
   * @returns An array containing the vector's components [x, y, z, w]
   */
  toArray(): [number, number, number, number] {
    return [this.x, this.y, this.z, this.w];
  }
}

export { Vector4 };
