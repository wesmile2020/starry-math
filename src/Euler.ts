import { Matrix4 } from './Matrix4';
import { clamp } from './MathUtils';

export const EulerOrder = {
  XYZ: 0,
  YZX: 1,
  ZXY: 2,
  XZY: 3,
  YXZ: 4,
  ZYX: 5,
} as const;
export type EulerOrder = typeof EulerOrder[keyof typeof EulerOrder];

class Euler {
  x: number = 0;
  y: number = 0;
  z: number = 0;
  order: EulerOrder = EulerOrder.XYZ;

  constructor(x: number = 0, y: number = 0, z: number = 0, order: EulerOrder = EulerOrder.XYZ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
  }

  set(x: number, y: number, z: number, order: EulerOrder = this.order): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
    return this;
  }

  setFromRotationMatrix(m: Matrix4): this {
    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

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

  equal(euler: Euler): boolean {
    return this.x === euler.x && this.y === euler.y && this.z === euler.z && this.order === euler.order;
  }

  copy(source: Euler): this {
    return this.set(source.x, source.y, source.z, source.order);
  }

  clone(): Euler {
    return new Euler(this.x, this.y, this.z, this.order);
  }

  toArray(): [number, number, number] {
    return [this.x, this.y, this.z];
  }
}

export { Euler };
