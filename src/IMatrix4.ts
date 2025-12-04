import { type Tuple } from './interfaces';

/**
 * Type definition for a 4x4 matrix represented as a 16-element array in column-major order.
 */
export type Matrix4Tuple = Tuple<number, 16>;

export interface IMatrix4 {
  toArray(): Matrix4Tuple;
}

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
