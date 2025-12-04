export interface Coordinate2D {
  x: number;
  y: number;
}

export interface Coordinate3D extends Coordinate2D {
  z: number;
}

export type Tuple<T, N extends number, R extends T[] = []> = R['length'] extends N ? R : Tuple<T, N, [T, ...R]>;

export type ArrayPoint = Tuple<number, 3>;

export type ArrayPointOptional = [number, number, number?];
