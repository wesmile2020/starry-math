import { clamp } from './MathUtils';

/**
 * Represents a 2D vector with x and y components.
 * Provides various vector operations for 2D mathematics and transformations.
 * @public
 */
class Vector2 {
  /**
   * The x component of the vector
   */
  x: number;

  /**
   * The y component of the vector
   */
  y: number;

  /**
   * Creates a new Vector2 instance
   * @param x - The x component of the vector. Defaults to 0
   * @param y - The y component of the vector. Defaults to 0
   */
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Sets the components of this vector
   * @param x - The new x component
   * @param y - The new y component
   * @returns Returns this vector for method chaining
   */
  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
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
    return this.x ** 2 + this.y ** 2;
  }

  /**
   * Computes the distance between this vector and another vector
   * @param vector - The other vector to measure distance to
   * @returns The distance between the vectors
   */
  distanceTo(vector: Vector2): number {
    return Math.sqrt(this.distanceToSquared(vector));
  }

  /**
   * Computes the squared distance between this vector and another vector
   * (avoids sqrt for performance)
   * @param vector - The other vector to measure distance to
   * @returns The squared distance between the vectors
   */
  distanceToSquared(vector: Vector2): number {
    return (vector.x - this.x) ** 2 + (vector.y - this.y) ** 2;
  }

  /**
   * Multiplies this vector by a scalar
   * @param num - The scalar value to multiply by
   * @returns Returns this vector for method chaining
   */
  multiplyScalar(num: number): this {
    this.x *= num;
    this.y *= num;
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
    return this;
  }

  /**
   * Adds another vector to this vector
   * @param vector - The vector to add
   * @returns Returns this vector for method chaining
   */
  add(vector: Vector2): this {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  /**
   * Subtracts another vector from this vector
   * @param vector - The vector to subtract
   * @returns Returns this vector for method chaining
   */
  subtract(vector: Vector2): this {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  /**
   * Multiplies this vector component-wise by another vector
   * @param vector - The vector to multiply by
   * @returns Returns this vector for method chaining
   */
  multiply(vector: Vector2): this {
    this.x *= vector.x;
    this.y *= vector.y;
    return this;
  }

  /**
   * Divides this vector component-wise by another vector
   * @param vector - The vector to divide by
   * @returns Returns this vector for method chaining
   */
  divide(vector: Vector2): this {
    this.x /= vector.x;
    this.y /= vector.y;
    return this;
  }

  /**
   * Returns the angle between two vectors
   * @param vector - The vector to measure angle against
   * @returns The angle between the vectors in radians
   */
  angleTo(vector: Vector2): number {
    const m1 = this.length();
    const m2 = vector.length();
    const m = m1 * m2;
    if (m === 0) {
      return 0;
    }
    let num = (this.x * vector.x + this.y * vector.y) / m;
    num = clamp(num, -1, 1);
    const angle = Math.acos(num);
    const side = this.cross(vector) < 0 ? -1 : 1;
    return side * angle;
  }

  /**
   * Converts to normal vector (y, -x)
   * @returns This vector as a normal vector for method chaining
   */
  normal(): this {
    const oldX = this.x;
    this.x = this.y;
    this.y = -oldX;
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
    return this;
  }

  /**
   * Computes the dot product of this vector with another vector
   * @param vector - The other vector for the dot product
   * @returns The dot product result
   */
  dot(vector: Vector2): number {
    return this.x * vector.x + this.y * vector.y;
  }

  /**
   * Computes the cross product of this vector with another vector
   * @param vector - The other vector for the cross product
   * @returns The cross product result (scalar in 2D)
   */
  cross(vector: Vector2): number {
    return this.x * vector.y - vector.x * this.y;
  }

  /**
   * Compares this vector with another vector for equality
   * @param vector - The vector to compare with
   * @returns True if vectors are equal, false otherwise
   */
  equal(vector: Vector2): boolean {
    return this.x === vector.x && this.y === vector.y;
  }

  /**
   * Copies values from another vector into this vector
   * @param source - The vector to copy from
   * @returns Returns this vector for method chaining
   */
  copy(source: Vector2): this {
    return this.set(source.x, source.y);
  }

  /**
   * Rotates the vector by a given angle
   * @param angle - The rotation angle in radians
   * @returns Returns this vector for method chaining
   */
  rotate(angle: number): this {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    const x = cos * this.x - sin * this.y;
    const y = sin * this.x + cos * this.y;
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Creates a new vector with the same values as this vector
   * @returns A new Vector2 instance with copied values
   */
  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /**
   * Converts this vector to an array of its components
   * @returns An array containing the vector's components [x, y]
   */
  toArray(): [number, number] {
    return [this.x, this.y];
  }
}

export { Vector2 };
