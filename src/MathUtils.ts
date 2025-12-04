import UnitBezier from '@mapbox/unitbezier';
import { Vector2 } from './Vector2';
import { type ArrayPointOptional } from './interfaces';

/**
 * Restricts a number to be within a specified range
 * @param num The number to clamp
 * @param min The minimum value
 * @param max The maximum value
 * @returns The clamped value, returns min if num is less than min, max if num is greater than max, otherwise returns num itself
 */
export function clamp(num: number, min: number, max: number): number {
  if (num < min) {
    return min;
  }
  if (num > max) {
    return max;
  }
  return num;
}

/**
 * Generates a hash code for a string
 * Reference: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript/52171480#52171480
 * @param str The string to hash
 * @param seed An optional seed value to initialize the hash calculation
 * @returns The hash code as a number
 */
export function hashCode(str: string, seed: number = 0): number {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i += 1) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

const LUT: string[] = [];
let id = Math.random();
/**
 * Generates a unique identifier (UUID)
 * Reference: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
 * @returns The generated UUID as a string
 */
export function generateUUID(): string {
  // generate LUT
  if (LUT.length === 0) {
    for (let i = 0; i < 256; i += 1) {
      LUT.push(i < 16 ? `0${i.toString(16)}` : i.toString(16));
    }
  }

  const d0 = Math.random() * 0xffffffff | 0;
  const d1 = Math.random() * 0xffffffff | 0;
  const d2 = Math.random() * 0xffffffff | 0;
  const d3 = id * 0xffffffff | 0;

  const uuid = LUT[d0 & 0xff] + LUT[d0 >> 8 & 0xff] + LUT[d0 >> 16 & 0xff] + LUT[d0 >> 24 & 0xff] + '-'
    + LUT[d1 & 0xff] + LUT[d1 >> 8 & 0xff] + '-'
    + LUT[d1 >> 16 & 0x0f | 0x40] + LUT[d1 >> 24 & 0xff] + '-'
    + LUT[d2 & 0x3f | 0x80] + LUT[d2 >> 8 & 0xff] + '-'
    + LUT[d2 >> 16 & 0xff] + LUT[d2 >> 24 & 0xff] + LUT[d3 & 0xff] + LUT[d3 >> 8 & 0xff] + LUT[d3 >> 16 & 0xff] + LUT[d3 >> 24 & 0xff];

  id += Math.random();

  // .toLowerCase() here flattens concatenated strings to save heap memory space.
  return uuid.toLowerCase();
}

/**
 * Applies a smoothstep interpolation function to a value within a specified range
 * @param x The value to interpolate
 * @param min The minimum value of the range
 * @param max The maximum value of the range
 * @returns The interpolated value between 0 and 1
 */
export function smoothstep(x: number, min: number, max: number): number {
  if (x <= min) {
    return 0;
  }
  if (x >= max) {
    return 1;
  }
  const num = (x - min) / (max - min);

  return num * num * (3 - 2 * num);
}

/** Merges two sorted subarrays into a single sorted array
 * @param arr The array containing the subarrays to merge
 * @param l The starting index of the first subarray
 * @param m The ending index of the first subarray
 * @param r The ending index of the second subarray
 * @param cb The comparison function used to determine the order of elements
 */
function mergeArray<T>(arr: T[], l: number, m: number, r: number, cb: (a: T, b: T) => number): void {
  const temp: T[] = [];
  let i = l, j = m + 1;
  while (i <= m && j <= r) {
    if (cb(arr[i], arr[j]) <= 0) {
      temp.push(arr[i]);
      i += 1;
    } else {
      temp.push(arr[j]);
      j += 1;
    }
  }
  while (i <= m) {
    temp.push(arr[i]);
    i += 1;
  }
  while (j <= r) {
    temp.push(arr[j]);
    j += 1;
  }
  for (let t = 0; t < temp.length; t += 1) {
    arr[l + t] = temp[t];
  }
}
/** Recursively sorts an array using the merge sort algorithm
 * @param arr The array to sort
 * @param l The starting index of the array segment to sort
 * @param r The ending index of the array segment to sort
 * @param cb The comparison function used to determine the order of elements
 */
function mSort<T>(arr: T[], l: number, r: number, cb: (a: T, b: T) => number): void {
  if (l < r) {
    const m = Math.floor((l + r) / 2);
    mSort(arr, l, m, cb);
    mSort(arr, m + 1, r, cb);
    mergeArray(arr, l, m, r, cb);
  }
}

/**
 * Sorts an array using the merge sort algorithm
 * @param arr The array to sort
 * @param cb The comparison function used to determine the order of elements
 */
export function mergeSort<T>(arr: T[], cb: (a: T, b: T) => number): void {
  mSort(arr, 0, arr.length - 1, cb);
}

/** Generates a cubic Bezier easing function based on control points
 * @param x0 The x-coordinate of the first control point
 * @param y0 The y-coordinate of the first control point
 * @param x1 The x-coordinate of the second control point
 * @param y1 The y-coordinate of the second control point
 * @returns The cubic Bezier easing function
 */
export function generateBezier(x0: number, y0: number, x1: number, y1: number): (t: number) => number {
  const bezier = new UnitBezier(x0, y0, x1, y1);
  return (t: number) => bezier.solve(t);
}


/**
 * Determines if three points are ordered in a clockwise direction
 * @param p1 The first point
 * @param p2 The second point
 * @param p3 The third point
 * @returns True if the points are ordered clockwise, false otherwise
 */
export function isClockWise(p1: ArrayPointOptional, p2: ArrayPointOptional, p3: ArrayPointOptional): boolean {
  const v1 = new Vector2(p2[0] - p1[0], p2[1] - p1[1]);
  const v2 = new Vector2(p3[0] - p2[0], p3[1] - p2[1]);
  return v1.cross(v2) < 0;
}


/**
 * Determines if a ring of points is ordered in a clockwise direction
 * @param ring The ring of points to check
 * @returns True if the ring is ordered clockwise, false otherwise
 */
export function isClockWiseRing(ring: ArrayPointOptional[]): boolean {
  let area = 0;
  for (let i = 0; i < ring.length; i += 1) {
    const p1 = ring[i];
    const p2 = ring[(i + 1) % ring.length];
    area += (p2[0] - p1[0]) * (p2[1] + p1[1]);
  }

  return area > 0;
}

