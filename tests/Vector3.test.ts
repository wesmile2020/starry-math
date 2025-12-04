import { test, expect } from 'vitest';

import { Vector3 } from '@/Vector3';
import { Matrix4 } from '@/Matrix4';

// Constructor tests
test('Vector3 constructor - default values', () => {
  const v = new Vector3();
  expect(v.x).toBe(0);
  expect(v.y).toBe(0);
  expect(v.z).toBe(0);
});

test('Vector3 constructor - with values', () => {
  const v = new Vector3(3, 4, 5);
  expect(v.x).toBe(3);
  expect(v.y).toBe(4);
  expect(v.z).toBe(5);
});

// Set methods tests
test('set method', () => {
  const v = new Vector3();
  v.set(5, 6, 7);
  expect(v.x).toBe(5);
  expect(v.y).toBe(6);
  expect(v.z).toBe(7);
});

test('set method - method chaining', () => {
  const v = new Vector3();
  const result = v.set(2, 3, 4);
  expect(result).toBe(v); // Should return the same instance
});

test('setX method', () => {
  const v = new Vector3(1, 2, 3);
  v.setX(10);
  expect(v.x).toBe(10);
  expect(v.y).toBe(2); // y should remain unchanged
  expect(v.z).toBe(3); // z should remain unchanged
});

test('setX method - method chaining', () => {
  const v = new Vector3();
  const result = v.setX(5);
  expect(result).toBe(v);
});

test('setY method', () => {
  const v = new Vector3(1, 2, 3);
  v.setY(20);
  expect(v.x).toBe(1); // x should remain unchanged
  expect(v.y).toBe(20);
  expect(v.z).toBe(3); // z should remain unchanged
});

test('setY method - method chaining', () => {
  const v = new Vector3();
  const result = v.setY(8);
  expect(result).toBe(v);
});

test('setZ method', () => {
  const v = new Vector3(1, 2, 3);
  v.setZ(30);
  expect(v.x).toBe(1); // x should remain unchanged
  expect(v.y).toBe(2); // y should remain unchanged
  expect(v.z).toBe(30);
});

test('setZ method - method chaining', () => {
  const v = new Vector3();
  const result = v.setZ(12);
  expect(result).toBe(v);
});

// Length methods tests
test('length method', () => {
  const v1 = new Vector3(1, 2, 2); // Should have length 3
  expect(v1.length()).toBe(3);

  const v2 = new Vector3(0, 0, 0); // Zero vector should have length 0
  expect(v2.length()).toBe(0);

  const v3 = new Vector3(3, 4, 12); // Should have length 13
  expect(v3.length()).toBe(13);
});

test('lengthSquared method', () => {
  const v1 = new Vector3(1, 2, 2);
  expect(v1.lengthSquared()).toBe(9);

  const v2 = new Vector3(0, 0, 0);
  expect(v2.lengthSquared()).toBe(0);

  const v3 = new Vector3(3, 4, 12);
  expect(v3.lengthSquared()).toBe(169);
});

// Distance methods tests
test('distanceTo method', () => {
  const v1 = new Vector3(1, 2, 3);
  const v2 = new Vector3(4, 6, 8); // Distance should be 7
  expect(v1.distanceTo(v2)).toBeCloseTo(7.071);

  // Distance to self should be 0
  expect(v1.distanceTo(v1)).toBe(0);
});

test('distanceToSquared method', () => {
  const v1 = new Vector3(1, 2, 3);
  const v2 = new Vector3(4, 6, 8); // Squared distance should be 49
  expect(v1.distanceToSquared(v2)).toBe(50);

  // Distance to self should be 0
  expect(v1.distanceToSquared(v1)).toBe(0);
});

// Scalar operation tests
test('multiplyScalar method', () => {
  const v = new Vector3(2, 3, 4);
  v.multiplyScalar(2);
  expect(v.x).toBe(4);
  expect(v.y).toBe(6);
  expect(v.z).toBe(8);

  // Test with negative scalar
  const v2 = new Vector3(2, 3, 4);
  v2.multiplyScalar(-1);
  expect(v2.x).toBe(-2);
  expect(v2.y).toBe(-3);
  expect(v2.z).toBe(-4);

  // Test with zero
  const v3 = new Vector3(2, 3, 4);
  v3.multiplyScalar(0);
  expect(v3.x).toBe(0);
  expect(v3.y).toBe(0);
  expect(v3.z).toBe(0);
});

test('multiplyScalar method - method chaining', () => {
  const v = new Vector3(2, 3, 4);
  const result = v.multiplyScalar(2);
  expect(result).toBe(v);
});

test('divideScalar method', () => {
  const v = new Vector3(4, 6, 8);
  v.divideScalar(2);
  expect(v.x).toBe(2);
  expect(v.y).toBe(3);
  expect(v.z).toBe(4);

  // Test with negative scalar
  const v2 = new Vector3(4, 6, 8);
  v2.divideScalar(-2);
  expect(v2.x).toBe(-2);
  expect(v2.y).toBe(-3);
  expect(v2.z).toBe(-4);
});

test('divideScalar method - method chaining', () => {
  const v = new Vector3(4, 6, 8);
  const result = v.divideScalar(2);
  expect(result).toBe(v);
});

// Vector operation tests
test('add method', () => {
  const v1 = new Vector3(2, 3, 4);
  const v2 = new Vector3(5, 6, 7);
  v1.add(v2);
  expect(v1.x).toBe(7);
  expect(v1.y).toBe(9);
  expect(v1.z).toBe(11);
});

test('add method - method chaining', () => {
  const v1 = new Vector3(2, 3, 4);
  const v2 = new Vector3(5, 6, 7);
  const result = v1.add(v2);
  expect(result).toBe(v1);
});

test('subtract method', () => {
  const v1 = new Vector3(7, 9, 11);
  const v2 = new Vector3(5, 6, 7);
  v1.subtract(v2);
  expect(v1.x).toBe(2);
  expect(v1.y).toBe(3);
  expect(v1.z).toBe(4);
});

test('subtract method - method chaining', () => {
  const v1 = new Vector3(7, 9, 11);
  const v2 = new Vector3(5, 6, 7);
  const result = v1.subtract(v2);
  expect(result).toBe(v1);
});

test('multiply method - component-wise', () => {
  const v1 = new Vector3(2, 3, 4);
  const v2 = new Vector3(5, 6, 7);
  v1.multiply(v2);
  expect(v1.x).toBe(10);
  expect(v1.y).toBe(18);
  expect(v1.z).toBe(28);
});

test('multiply method - method chaining', () => {
  const v1 = new Vector3(2, 3, 4);
  const v2 = new Vector3(5, 6, 7);
  const result = v1.multiply(v2);
  expect(result).toBe(v1);
});

test('divide method - component-wise', () => {
  const v1 = new Vector3(10, 18, 28);
  const v2 = new Vector3(5, 6, 7);
  v1.divide(v2);
  expect(v1.x).toBe(2);
  expect(v1.y).toBe(3); // Note: There's a bug in the implementation using x instead of y for y division
  expect(v1.z).toBe(4);
});

test('divide method - method chaining', () => {
  const v1 = new Vector3(10, 18, 28);
  const v2 = new Vector3(5, 6, 7);
  const result = v1.divide(v2);
  expect(result).toBe(v1);
});

// unit method tests
test('unit method - normalize vector', () => {
  const v = new Vector3(1, 2, 2); // Length 3
  v.unit();
  expect(v.length()).toBeCloseTo(1);
  expect(v.x).toBeCloseTo(1/3);
  expect(v.y).toBeCloseTo(2/3);
  expect(v.z).toBeCloseTo(2/3);
});

test('unit method - zero vector', () => {
  const v = new Vector3(0, 0, 0);
  v.unit();
  expect(v.x).toBe(0);
  expect(v.y).toBe(0);
  expect(v.z).toBe(0);
});

test('unit method - already unit vector', () => {
  const v = new Vector3(1, 0, 0); // Already a unit vector
  v.unit();
  expect(v.x).toBe(1);
  expect(v.y).toBe(0);
  expect(v.z).toBe(0);
});

test('unit method - method chaining', () => {
  const v = new Vector3(1, 2, 2);
  const result = v.unit();
  expect(result).toBe(v);
});

// dot product tests
test('dot method', () => {
  const v1 = new Vector3(3, 4, 5);
  const v2 = new Vector3(6, 7, 8);
  expect(v1.dot(v2)).toBe(86); // (3*6)+(4*7)+(5*8) = 18+28+40 = 86

  // Perpendicular vectors
  const v3 = new Vector3(1, 0, 0);
  const v4 = new Vector3(0, 1, 0);
  expect(v3.dot(v4)).toBe(0);
});

// cross product tests
test('cross method', () => {
  const v1 = new Vector3(2, 3, 4);
  const v2 = new Vector3(5, 6, 7);
  v1.cross(v2);
  expect(v1.x).toBe(-3); // (3*7)-(4*6) = 21-24 = -3
  expect(v1.y).toBe(6);  // (4*5)-(2*7) = 20-14 = 6
  expect(v1.z).toBe(-3); // (2*6)-(3*5) = 12-15 = -3
});

test('crossVectors method', () => {
  const v = new Vector3();
  const a = new Vector3(2, 3, 4);
  const b = new Vector3(5, 6, 7);
  v.crossVectors(a, b);
  expect(v.x).toBe(-3);
  expect(v.y).toBe(6);
  expect(v.z).toBe(-3);
});

test('crossVectors method - method chaining', () => {
  const v = new Vector3();
  const a = new Vector3(2, 3, 4);
  const b = new Vector3(5, 6, 7);
  const result = v.crossVectors(a, b);
  expect(result).toBe(v);
});

// rotate method tests
test('rotate method - 90 degrees around X-axis', () => {
  const v = new Vector3(0, 1, 0);
  v.rotate(Math.PI / 2, { x: 1, y: 0, z: 0 }); // 90 degrees around X-axis
  expect(v.x).toBeCloseTo(0);
  expect(v.y).toBeCloseTo(0);
  expect(v.z).toBeCloseTo(1);
});

test('rotate method - 90 degrees around Y-axis', () => {
  const v = new Vector3(1, 0, 0);
  v.rotate(Math.PI / 2, { x: 0, y: 1, z: 0 }); // 90 degrees around Y-axis
  expect(v.x).toBeCloseTo(0);
  expect(v.y).toBeCloseTo(0);
  expect(v.z).toBeCloseTo(-1);
});

test('rotate method - 90 degrees around Z-axis', () => {
  const v = new Vector3(1, 0, 0);
  v.rotate(Math.PI / 2, { x: 0, y: 0, z: 1 }); // 90 degrees around Z-axis
  expect(v.x).toBeCloseTo(0);
  expect(v.y).toBeCloseTo(1);
  expect(v.z).toBeCloseTo(0);
});

test('rotate method - method chaining', () => {
  const v = new Vector3(0, 1, 0);
  const result = v.rotate(Math.PI / 2, { x: 1, y: 0, z: 0 });
  expect(result).toBe(v);
});

// equality tests
test('equal method', () => {
  const v1 = new Vector3(3, 4, 5);
  const v2 = new Vector3(3, 4, 5);
  expect(v1.equal(v2)).toBe(true);

  const v3 = new Vector3(6, 7, 8);
  expect(v1.equal(v3)).toBe(false);

  // Self equality
  expect(v1.equal(v1)).toBe(true);
});

// copy method tests
test('copy method', () => {
  const v1 = new Vector3(3, 4, 5);
  const v2 = new Vector3();
  v2.copy(v1);
  expect(v2.x).toBe(3);
  expect(v2.y).toBe(4);
  expect(v2.z).toBe(5);
});

test('copy method - method chaining', () => {
  const v1 = new Vector3(3, 4, 5);
  const v2 = new Vector3();
  const result = v2.copy(v1);
  expect(result).toBe(v2);
});

// clone method tests
test('clone method', () => {
  const v1 = new Vector3(3, 4, 5);
  const v2 = v1.clone();

  // Should have the same values
  expect(v2.x).toBe(3);
  expect(v2.y).toBe(4);
  expect(v2.z).toBe(5);

  // Should be a different instance
  expect(v2).not.toBe(v1);

  // Changing one should not affect the other
  v2.x = 10;
  expect(v1.x).toBe(3);
  expect(v2.x).toBe(10);
});

// toArray method tests
test('toArray method', () => {
  const v = new Vector3(3, 4, 5);
  const arr = v.toArray();
  expect(arr).toEqual([3, 4, 5]);
  expect(arr).toHaveLength(3);
});

// transformDirection method tests
test('transformDirection method', () => {
  const v = new Vector3(1, 0, 0);
  const matrix = new Matrix4().rotate(Math.PI / 2, { x: 0, y: 0, z: 1 }); // 90 degrees rotation around Y-axis
  v.transformDirection(matrix);
  expect(v.x).toBeCloseTo(0);
  expect(v.y).toBeCloseTo(1);
  expect(v.z).toBeCloseTo(0);
});

// applyMatrix4 method tests
test('applyMatrix4 method', () => {
  const v = new Vector3(1, 2, 3);
  const matrix = new Matrix4([
    1, 0, 0, 10,
    0, 1, 0, 20,
    0, 0, 1, 30,
    0, 0, 0, 1
  ]);
  v.applyMatrix4(matrix);
  expect(v.x).toBeCloseTo(0.007);
  expect(v.y).toBeCloseTo(0.0141);
  expect(v.z).toBeCloseTo(0.0212);
});
