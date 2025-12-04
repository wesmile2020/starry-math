import { clamp } from './MathUtils';
import { type IMatrix4 } from './IMatrix4';

/**
 * Enum representing the possible Euler angle rotation orders.
 * These define the sequence in which rotations are applied around the coordinate axes.
 */
export const EulerOrder = {
  /** Rotation order: X, then Y, then Z */
  XYZ: 0,
  /** Rotation order: Y, then Z, then X */
  YZX: 1,
  /** Rotation order: Z, then X, then Y */
  ZXY: 2,
  /** Rotation order: X, then Z, then Y */
  XZY: 3,
  /** Rotation order: Y, then X, then Z */
  YXZ: 4,
  /** Rotation order: Z, then Y, then X */
  ZYX: 5,
} as const;

/**
 * Type representing valid Euler rotation orders.
 * Union type of all possible values from the EulerOrder enum.
 */
export type EulerOrder = typeof EulerOrder[keyof typeof EulerOrder];

/**
 * Represents Euler angles for 3D rotations using a specified order of rotation axes.
 * Euler angles are three angles that describe the orientation of an object in 3D space.
 * Each angle represents a rotation around one of the coordinate axes (x, y, z).
 * @public
 */
class Euler {
  /**
   * Rotation angle around the x-axis in radians.
   */
  x: number = 0;

  /**
   * Rotation angle around the y-axis in radians.
   */
  y: number = 0;

  /**
   * Rotation angle around the z-axis in radians.
   */
  z: number = 0;

  /**
   * The order in which rotations are applied around the axes.
   * Default is EulerOrder.XYZ.
   */
  order: EulerOrder = EulerOrder.XYZ;

  /**
   * Creates a new Euler instance with the specified rotation angles and order.
   * @param x - Rotation angle around x-axis in radians. Default is 0.
   * @param y - Rotation angle around y-axis in radians. Default is 0.
   * @param z - Rotation angle around z-axis in radians. Default is 0.
   * @param order - The order in which rotations are applied. Default is EulerOrder.XYZ.
   */
  constructor(x: number = 0, y: number = 0, z: number = 0, order: EulerOrder = EulerOrder.XYZ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
  }

  /**
   * Sets the rotation angles and order for this Euler instance.
   * @param x - New rotation angle around x-axis in radians.
   * @param y - New rotation angle around y-axis in radians.
   * @param z - New rotation angle around z-axis in radians.
   * @param order - New rotation order. If not provided, the current order is preserved.
   * @returns This Euler instance for method chaining.
   */
  set(x: number, y: number, z: number, order: EulerOrder = this.order): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
    return this;
  }

  /**
   * Sets the Euler angles based on a rotation matrix.
   * Assumes the upper 3x3 of the matrix is a pure rotation matrix (unscaled).
   * @param m - The rotation matrix to decompose into Euler angles.
   * assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled).
   * @returns This Euler instance for method chaining.
   * @remarks The decomposition handles the gimbal lock case by setting the third angle to 0
   *          when the middle rotation approaches ±90 degrees.
   */
  setFromRotationMatrix(m: IMatrix4): this {
    const te = m.toArray();
    const m11 = te[0], m12 = te[4], m13 = te[8];
    const m21 = te[1], m22 = te[5], m23 = te[9];
    const m31 = te[2], m32 = te[6], m33 = te[10];

    switch (this.order) {
      case EulerOrder.XYZ: {
        this.y = Math.asin(clamp(m13, -1, 1));
        if (Math.abs(m13) < 0.9999999) {
          this.x = Math.atan2(-m23, m33);
          this.z = Math.atan2(-m12, m11);
        } else {
          this.x = Math.atan2(m32, m22);
          this.z = 0;
        }
        break;
      }
      case EulerOrder.YXZ: {
        this.x = Math.asin(-clamp(m23, -1, 1));
        if (Math.abs(m23) < 0.9999999) {
          this.y = Math.atan2(m13, m33);
          this.z = Math.atan2(m21, m22);
        } else {
          this.y = Math.atan2(-m31, m11);
          this.z = 0;
        }
        break;
      }
      case EulerOrder.ZXY: {
        this.x = Math.asin(clamp(m32, -1, 1));
        if (Math.abs(m32) < 0.9999999) {
          this.y = Math.atan2(-m31, m33);
          this.z = Math.atan2(-m12, m22);
        } else {
          this.y = 0;
          this.z = Math.atan2(m21, m11);
        }
        break;
      }
      case EulerOrder.ZYX: {
        this.y = Math.asin(-clamp(m31, -1, 1));
        if (Math.abs(m31) < 0.9999999) {
          this.x = Math.atan2(m32, m33);
          this.z = Math.atan2(m21, m11);
        } else {
          this.x = 0;
          this.z = Math.atan2(-m12, m22);
        }
        break;
      }
      case EulerOrder.YZX: {
        this.z = Math.asin(clamp(m21, -1, 1));
        if (Math.abs(m21) < 0.9999999) {
          this.x = Math.atan2(-m23, m22);
          this.y = Math.atan2(-m31, m11);
        } else {
          this.x = 0;
          this.y = Math.atan2(m13, m33);
        }
        break;
      }
      case EulerOrder.XZY: {
        this.z = Math.asin(-clamp(m12, -1, 1));
        if (Math.abs(m12) < 0.9999999) {
          this.x = Math.atan2(m32, m22);
          this.y = Math.atan2(m13, m11);
        } else {
          this.x = Math.atan2(-m23, m33);
          this.y = 0;
        }
        break;
      }
    }
    return this;
  }

  /**
   * Determines if this Euler angle set is equal to another.
   * @param euler - The Euler angle set to compare with.
   * @returns True if all angles and the rotation order are equal, false otherwise.
   */
  equal(euler: Euler): boolean {
    return this.x === euler.x && this.y === euler.y && this.z === euler.z && this.order === euler.order;
  }

  /**
   * Copies rotation angles and order from another Euler instance.
   * @param source - The Euler instance to copy from.
   * @returns This Euler instance for method chaining.
   */
  copy(source: Euler): this {
    return this.set(source.x, source.y, source.z, source.order);
  }

  /**
   * Creates a new Euler instance with the same rotation angles and order as this one.
   * @returns A new Euler instance with copied values.
   */
  clone(): Euler {
    return new Euler(this.x, this.y, this.z, this.order);
  }

  /**
   * Returns the Euler angles as a three-element array [x, y, z].
   * @returns An array containing the rotation angles in radians.
   */
  toArray(): [number, number, number] {
    return [this.x, this.y, this.z];
  }
}

export { Euler };
