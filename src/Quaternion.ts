import { type Euler, EulerOrder } from './Euler';

/**
 * Represents a quaternion, which is a mathematical construct used to represent rotations in 3D space.
 * Quaternions avoid gimbal lock and provide smooth interpolations between orientations.
 * A quaternion is defined by four components: x, y, z (vector part) and w (scalar part).
 * @public
 */
class Quaternion {
  /**
   * The x component of the quaternion (vector part).
   */
  x: number = 0;

  /**
   * The y component of the quaternion (vector part).
   */
  y: number = 0;

  /**
   * The z component of the quaternion (vector part).
   */
  z: number = 0;

  /**
   * The w component of the quaternion (scalar part).
   */
  w: number = 0;

  /**
   * Creates a new Quaternion instance with the specified components.
   * @param x - The x component of the quaternion. Default is 0.
   * @param y - The y component of the quaternion. Default is 0.
   * @param z - The z component of the quaternion. Default is 0.
   * @param w - The w component of the quaternion. Default is 1 (identity rotation).
   */
  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  /**
   * Sets the quaternion components based on Euler angles.
   * Converts Euler angles (rotation around x, y, z axes) to a quaternion representation.
   * @param euler - The Euler angles to convert from, including rotation order.
   * @returns This quaternion instance for method chaining.
   * @remarks The conversion uses the rotation order specified in the Euler object (XYZ, YXZ, ZXY, ZYX, YZX, or XZY).
   */
  setFromEuler(euler: Euler): this {
    const { x, y, z, order } = euler;

    const c1 = Math.cos(x / 2);
    const c2 = Math.cos(y / 2);
    const c3 = Math.cos(z / 2);
    const s1 = Math.sin(x / 2);
    const s2 = Math.sin(y / 2);
    const s3 = Math.sin(z / 2);

    switch (order) {
      case EulerOrder.XYZ: {
        this.x = s1 * c2 * c3 + c1 * s2 * s3;
        this.y = c1 * s2 * c3 - s1 * c2 * s3;
        this.z = c1 * c2 * s3 + s1 * s2 * c3;
        this.w = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      }
      case EulerOrder.YXZ: {
        this.x = s1 * c2 * c3 + c1 * s2 * s3;
        this.y = c1 * s2 * c3 - s1 * c2 * s3;
        this.z = c1 * c2 * s3 - s1 * s2 * c3;
        this.w = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      }
      case EulerOrder.ZXY: {
        this.x = s1 * c2 * c3 - c1 * s2 * s3;
        this.y = c1 * s2 * c3 + s1 * c2 * s3;
        this.z = c1 * c2 * s3 + s1 * s2 * c3;
        this.w = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      }
      case EulerOrder.ZYX: {
        this.x = s1 * c2 * c3 - c1 * s2 * s3;
        this.y = c1 * s2 * c3 + s1 * c2 * s3;
        this.z = c1 * c2 * s3 - s1 * s2 * c3;
        this.w = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      }
      case EulerOrder.YZX: {
        this.x = s1 * c2 * c3 + c1 * s2 * s3;
        this.y = c1 * s2 * c3 + s1 * c2 * s3;
        this.z = c1 * c2 * s3 - s1 * s2 * c3;
        this.w = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      }
      case EulerOrder.XZY: {
        this.x = s1 * c2 * c3 - c1 * s2 * s3;
        this.y = c1 * s2 * c3 - s1 * c2 * s3;
        this.z = c1 * c2 * s3 + s1 * s2 * c3;
        this.w = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      }
    }
    return this;
  }

  /**
   * Sets the components of this quaternion.
   * @param x - The new x component.
   * @param y - The new y component.
   * @param z - The new z component.
   * @param w - The new w component.
   * @returns This quaternion instance for method chaining.
   */
  set(x: number, y: number, z: number, w: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  /**
   * Determines if this quaternion is equal to another quaternion.
   * @param source - The quaternion to compare with.
   * @returns True if all components are equal, false otherwise.
   * @remarks This is a strict equality check using ===, so it may return false for quaternions that
   *          represent the same rotation but have different component values due to floating-point precision.
   */
  equal(source: Quaternion): boolean {
    return this.x === source.x && this.y === source.y && this.z === source.z && this.w === source.w;
  }

  /**
   * Copies the components from another quaternion to this one.
   * @param source - The quaternion to copy from.
   * @returns This quaternion instance for method chaining.
   */
  copy(source: Quaternion): this {
    return this.set(source.x, source.y, source.z, source.w);
  }

  /**
   * Creates a new quaternion with the same components as this one.
   * @returns A new quaternion instance with copied values.
   */
  clone(): Quaternion {
    return new Quaternion(this.x, this.y, this.z, this.w);
  }
}

export { Quaternion };
