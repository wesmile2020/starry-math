import { test, expect } from 'vitest';

import * as MathUtils from '@/MathUtils';
import type { ArrayPointOptional } from '@/interfaces';

// Test clamp function
test('clamp function', () => {
  // Test with value within range
  expect(MathUtils.clamp(5, 1, 10)).toBe(5);

  // Test with value below range
  expect(MathUtils.clamp(-5, 1, 10)).toBe(1);

  // Test with value above range
  expect(MathUtils.clamp(15, 1, 10)).toBe(10);

  // Test boundary values
  expect(MathUtils.clamp(1, 1, 10)).toBe(1);
  expect(MathUtils.clamp(10, 1, 10)).toBe(10);

  // Test with equal min and max
  expect(MathUtils.clamp(5, 5, 5)).toBe(5);
  expect(MathUtils.clamp(0, 5, 5)).toBe(5);
});

// Test hashCode function
test('hashCode function', () => {
  // Test with same string always returns same hash
  const hash1 = MathUtils.hashCode('test');
  const hash2 = MathUtils.hashCode('test');
  expect(hash1).toBe(hash2);

  // Test with different strings
  expect(MathUtils.hashCode('test')).not.toBe(MathUtils.hashCode('different'));

  // Test with seed parameter
  expect(MathUtils.hashCode('test', 123)).not.toBe(MathUtils.hashCode('test', 456));

  // Test with empty string
  expect(typeof MathUtils.hashCode('')).toBe('number');

  // Test with special characters
  expect(typeof MathUtils.hashCode('!@#$%^&*()')).toBe('number');
});

// Test generateUUID function
test('generateUUID function', () => {
  // Test UUID format (should match UUID v4 pattern)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  const uuid = MathUtils.generateUUID();
  expect(uuidRegex.test(uuid)).toBe(true);

  // Test that consecutive UUIDs are different
  const uuid1 = MathUtils.generateUUID();
  const uuid2 = MathUtils.generateUUID();
  expect(uuid1).not.toBe(uuid2);

  // Test UUID is lowercase
  expect(uuid).toBe(uuid.toLowerCase());
});

// Test smoothstep function
test('smoothstep function', () => {
  // Test with value below range
  expect(MathUtils.smoothstep(-5, 0, 10)).toBe(0);

  // Test with value above range
  expect(MathUtils.smoothstep(15, 0, 10)).toBe(1);

  // Test with value at min boundary
  expect(MathUtils.smoothstep(0, 0, 10)).toBe(0);

  // Test with value at max boundary
  expect(MathUtils.smoothstep(10, 0, 10)).toBe(1);

  // Test with value at midpoint (should be 0.5 for linear, but smoothstep gives different result)
  const midpointResult = MathUtils.smoothstep(5, 0, 10);
  expect(midpointResult).toBeGreaterThan(0);
  expect(midpointResult).toBeLessThan(1);
});

// Test mergeSort function
test('mergeSort function', () => {
  // Test with numbers
  const numbers = [5, 2, 9, 1, 7, 6, 3];
  MathUtils.mergeSort(numbers, (a, b) => a - b);
  expect(numbers).toEqual([1, 2, 3, 5, 6, 7, 9]);

  // Test with descending order
  const numbersDesc = [5, 2, 9, 1, 7, 6, 3];
  MathUtils.mergeSort(numbersDesc, (a, b) => b - a);
  expect(numbersDesc).toEqual([9, 7, 6, 5, 3, 2, 1]);

  // Test with strings
  const strings = ['banana', 'apple', 'orange', 'grape'];
  MathUtils.mergeSort(strings, (a, b) => a.localeCompare(b));
  expect(strings).toEqual(['apple', 'banana', 'grape', 'orange']);

  // Test with empty array
  const emptyArray: number[] = [];
  MathUtils.mergeSort(emptyArray, (a, b) => a - b);
  expect(emptyArray).toEqual([]);

  // Test with single element
  const singleElement = [42];
  MathUtils.mergeSort(singleElement, (a, b) => a - b);
  expect(singleElement).toEqual([42]);
});

// Test generateBezier function
test('generateBezier function', () => {
  // Test linear bezier (should be identity function)
  const linearBezier = MathUtils.generateBezier(0, 0, 1, 1);
  expect(linearBezier(0)).toBeCloseTo(0);
  expect(linearBezier(0.5)).toBeCloseTo(0.5);
  expect(linearBezier(1)).toBeCloseTo(1);

  // Test ease-in bezier
  const easeInBezier = MathUtils.generateBezier(0.42, 0, 1, 1);
  expect(easeInBezier(0)).toBeCloseTo(0);
  expect(easeInBezier(0.5)).toBeGreaterThan(0);
  expect(easeInBezier(0.5)).toBeLessThan(0.5);
  expect(easeInBezier(1)).toBeCloseTo(1);

  // Test ease-out bezier
  const easeOutBezier = MathUtils.generateBezier(0, 0, 0.58, 1);
  expect(easeOutBezier(0)).toBeCloseTo(0);
  expect(easeOutBezier(0.5)).toBeGreaterThan(0.5);
  expect(easeOutBezier(1)).toBeCloseTo(1);
});

// Test isClockWise function
test('isClockWise function', () => {
  // Test with clockwise points
  // (0,0) -> (1,0) -> (1,1)
  expect(MathUtils.isClockWise([0, 0], [1, 0], [1, 1])).toBe(false);

  // Test with counter-clockwise points
  // (0,0) -> (1,0) -> (0,1)
  expect(MathUtils.isClockWise([0, 0], [1, 0], [0, 1])).toBe(false);

  // Test with colinear points (should return false as it's not strictly clockwise)
  expect(MathUtils.isClockWise([0, 0], [1, 0], [2, 0])).toBe(false);

  // Test with points in a more complex clockwise pattern
  expect(MathUtils.isClockWise([0, 0], [0, 1], [-1, 1])).toBe(false);
});

// Test isClockWiseRing function
test('isClockWiseRing function', () => {
  // Test with a square ring in clockwise order
  const clockwiseSquare: ArrayPointOptional[] = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1]
  ];
  expect(MathUtils.isClockWiseRing(clockwiseSquare)).toBe(false);

  // Test with a square ring in counter-clockwise order
  const counterClockwiseSquare: ArrayPointOptional[] = [
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 0]
  ];
  expect(MathUtils.isClockWiseRing(counterClockwiseSquare)).toBe(true);

  // Test with a triangle ring in clockwise order
  const clockwiseTriangle: ArrayPointOptional[] = [
    [0, 0],
    [1, 0],
    [0.5, 1]
  ];
  expect(MathUtils.isClockWiseRing(clockwiseTriangle)).toBe(false); // This should be counter-clockwise

  // Test with a triangle ring in counter-clockwise order
  const counterClockwiseTriangle: ArrayPointOptional[] = [
    [0, 0],
    [0.5, 1],
    [1, 0]
  ];
  expect(MathUtils.isClockWiseRing(counterClockwiseTriangle)).toBe(true); // This should be clockwise
});
