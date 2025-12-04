import { test, expect } from 'vitest';

import { Vector2 } from '@/Vector2';

// Constructor tests
test('Vector2 constructor - default values', () => {
  const v = new Vector2();
  expect(v.x).toBe(0);
  expect(v.y).toBe(0);
});

test('Vector2 constructor - with values', () => {
  const v = new Vector2(3, 4);
  expect(v.x).toBe(3);
  expect(v.y).toBe(4);
});

// Set methods tests
test('set method', () => {
  const v = new Vector2();
  v.set(5, 6);
  expect(v.x).toBe(5);
  expect(v.y).toBe(6);
});

test('set method - method chaining', () => {
  const v = new Vector2();
  const result = v.set(2, 3);
  expect(result).toBe(v); // Should return the same instance
});

test('setX method', () => {
  const v = new Vector2(1, 2);
  v.setX(10);
  expect(v.x).toBe(10);
  expect(v.y).toBe(2); // y should remain unchanged
});

test('setX method - method chaining', () => {
  const v = new Vector2();
  const result = v.setX(5);
  expect(result).toBe(v);
});

test('setY method', () => {
  const v = new Vector2(1, 2);
  v.setY(20);
  expect(v.x).toBe(1); // x should remain unchanged
  expect(v.y).toBe(20);
});

test('setY method - method chaining', () => {
  const v = new Vector2();
  const result = v.setY(8);
  expect(result).toBe(v);
});

// Length methods tests
test('length method', () => {
  const v1 = new Vector2(3, 4); // Should have length 5
  expect(v1.length()).toBe(5);

  const v2 = new Vector2(0, 0); // Zero vector should have length 0
  expect(v2.length()).toBe(0);

  const v3 = new Vector2(-5, 12); // Should have length 13
  expect(v3.length()).toBe(13);
});

test('lengthSquared method', () => {
  const v1 = new Vector2(3, 4);
  expect(v1.lengthSquared()).toBe(25);

  const v2 = new Vector2(0, 0);
  expect(v2.lengthSquared()).toBe(0);

  const v3 = new Vector2(-2, 5);
  expect(v3.lengthSquared()).toBe(29);
});

// Distance methods tests
test('distanceTo method', () => {
  const v1 = new Vector2(1, 2);
  const v2 = new Vector2(4, 6); // Distance should be 5
  expect(v1.distanceTo(v2)).toBe(5);

  // Distance to self should be 0
  expect(v1.distanceTo(v1)).toBe(0);
});

test('distanceToSquared method', () => {
  const v1 = new Vector2(1, 2);
  const v2 = new Vector2(4, 6); // Squared distance should be 25
  expect(v1.distanceToSquared(v2)).toBe(25);

  // Distance to self should be 0
  expect(v1.distanceToSquared(v1)).toBe(0);
});

// Scalar operation tests
test('multiplyScalar method', () => {
  const v = new Vector2(2, 3);
  v.multiplyScalar(2);
  expect(v.x).toBe(4);
  expect(v.y).toBe(6);

  // Test with negative scalar
  const v2 = new Vector2(2, 3);
  v2.multiplyScalar(-1);
  expect(v2.x).toBe(-2);
  expect(v2.y).toBe(-3);

  // Test with zero
  const v3 = new Vector2(2, 3);
  v3.multiplyScalar(0);
  expect(v3.x).toBe(0);
  expect(v3.y).toBe(0);
});

test('multiplyScalar method - method chaining', () => {
  const v = new Vector2(2, 3);
  const result = v.multiplyScalar(2);
  expect(result).toBe(v);
});

test('divideScalar method', () => {
  const v = new Vector2(4, 6);
  v.divideScalar(2);
  expect(v.x).toBe(2);
  expect(v.y).toBe(3);

  // Test with negative scalar
  const v2 = new Vector2(4, 6);
  v2.divideScalar(-2);
  expect(v2.x).toBe(-2);
  expect(v2.y).toBe(-3);
});

test('divideScalar method - method chaining', () => {
  const v = new Vector2(4, 6);
  const result = v.divideScalar(2);
  expect(result).toBe(v);
});

// Vector operation tests
test('add method', () => {
  const v1 = new Vector2(2, 3);
  const v2 = new Vector2(4, 5);
  v1.add(v2);
  expect(v1.x).toBe(6);
  expect(v1.y).toBe(8);
});

test('add method - method chaining', () => {
  const v1 = new Vector2(2, 3);
  const v2 = new Vector2(4, 5);
  const result = v1.add(v2);
  expect(result).toBe(v1);
});

test('subtract method', () => {
  const v1 = new Vector2(6, 8);
  const v2 = new Vector2(4, 5);
  v1.subtract(v2);
  expect(v1.x).toBe(2);
  expect(v1.y).toBe(3);
});

test('subtract method - method chaining', () => {
  const v1 = new Vector2(6, 8);
  const v2 = new Vector2(4, 5);
  const result = v1.subtract(v2);
  expect(result).toBe(v1);
});

test('multiply method - component-wise', () => {
  const v1 = new Vector2(2, 3);
  const v2 = new Vector2(4, 5);
  v1.multiply(v2);
  expect(v1.x).toBe(8);
  expect(v1.y).toBe(15);
});

test('multiply method - method chaining', () => {
  const v1 = new Vector2(2, 3);
  const v2 = new Vector2(4, 5);
  const result = v1.multiply(v2);
  expect(result).toBe(v1);
});

test('divide method - component-wise', () => {
  const v1 = new Vector2(8, 15);
  const v2 = new Vector2(4, 5);
  v1.divide(v2);
  expect(v1.x).toBe(2);
  expect(v1.y).toBe(3);
});

test('divide method - method chaining', () => {
  const v1 = new Vector2(8, 15);
  const v2 = new Vector2(4, 5);
  const result = v1.divide(v2);
  expect(result).toBe(v1);
});

// angleTo method tests
test('angleTo method', () => {
  const v1 = new Vector2(1, 0); // Along x-axis

  // Same direction
  const v2 = new Vector2(2, 0);
  expect(v1.angleTo(v2)).toBe(0);

  // 90 degrees counter-clockwise
  const v3 = new Vector2(0, 1);
  expect(v1.angleTo(v3)).toBe(Math.PI / 2);

  // 180 degrees
  const v4 = new Vector2(-1, 0);
  expect(Math.abs(v1.angleTo(v4))).toBe(Math.PI);

  // 90 degrees clockwise
  const v5 = new Vector2(0, -1);
  expect(v1.angleTo(v5)).toBe(-Math.PI / 2);

  // Zero vector
  const v6 = new Vector2(0, 0);
  expect(v1.angleTo(v6)).toBe(0);
});

// normal method tests
test('normal method', () => {
  const v = new Vector2(3, 4);
  v.normal();
  expect(v.x).toBe(4);
  expect(v.y).toBe(-3);

  // Another test case
  const v2 = new Vector2(0, 5);
  v2.normal();
  expect(v2.x).toBe(5);
  expect(v2.y).toBe(-0);
});

test('normal method - method chaining', () => {
  const v = new Vector2(3, 4);
  const result = v.normal();
  expect(result).toBe(v);
});

// unit method tests
test('unit method - normalize vector', () => {
  const v = new Vector2(3, 4); // Length 5
  v.unit();
  expect(v.length()).toBeCloseTo(1);
  expect(v.x).toBeCloseTo(0.6);
  expect(v.y).toBeCloseTo(0.8);
});

test('unit method - zero vector', () => {
  const v = new Vector2(0, 0);
  v.unit();
  expect(v.x).toBe(0);
  expect(v.y).toBe(0);
});

test('unit method - already unit vector', () => {
  const v = new Vector2(1, 0); // Already a unit vector
  v.unit();
  expect(v.x).toBe(1);
  expect(v.y).toBe(0);
});

test('unit method - method chaining', () => {
  const v = new Vector2(3, 4);
  const result = v.unit();
  expect(result).toBe(v);
});

// dot product tests
test('dot method', () => {
  const v1 = new Vector2(3, 4);
  const v2 = new Vector2(5, 6);
  expect(v1.dot(v2)).toBe(39); // (3*5)+(4*6) = 15+24 = 39

  // Perpendicular vectors
  const v3 = new Vector2(1, 0);
  const v4 = new Vector2(0, 1);
  expect(v3.dot(v4)).toBe(0);
});

// cross product tests
test('cross method', () => {
  const v1 = new Vector2(3, 4);
  const v2 = new Vector2(5, 6);
  expect(v1.cross(v2)).toBe(-2); // (3*6)-(4*5) = 18-20 = -2

  // Perpendicular vectors
  const v3 = new Vector2(1, 0);
  const v4 = new Vector2(0, 1);
  expect(v3.cross(v4)).toBe(1);
});

// equality tests
test('equal method', () => {
  const v1 = new Vector2(3, 4);
  const v2 = new Vector2(3, 4);
  expect(v1.equal(v2)).toBe(true);

  const v3 = new Vector2(5, 6);
  expect(v1.equal(v3)).toBe(false);

  // Self equality
  expect(v1.equal(v1)).toBe(true);
});

// copy method tests
test('copy method', () => {
  const v1 = new Vector2(3, 4);
  const v2 = new Vector2();
  v2.copy(v1);
  expect(v2.x).toBe(3);
  expect(v2.y).toBe(4);
});

test('copy method - method chaining', () => {
  const v1 = new Vector2(3, 4);
  const v2 = new Vector2();
  const result = v2.copy(v1);
  expect(result).toBe(v2);
});

// rotate method tests
test('rotate method - 90 degrees', () => {
  const v = new Vector2(1, 0);
  v.rotate(Math.PI / 2); // 90 degrees counter-clockwise
  expect(v.x).toBeCloseTo(0);
  expect(v.y).toBeCloseTo(1);
});

test('rotate method - 180 degrees', () => {
  const v = new Vector2(1, 0);
  v.rotate(Math.PI); // 180 degrees
  expect(v.x).toBeCloseTo(-1);
  expect(v.y).toBeCloseTo(0);
});

test('rotate method - 270 degrees', () => {
  const v = new Vector2(1, 0);
  v.rotate(3 * Math.PI / 2); // 270 degrees counter-clockwise
  expect(v.x).toBeCloseTo(0);
  expect(v.y).toBeCloseTo(-1);
});

test('rotate method - method chaining', () => {
  const v = new Vector2(1, 0);
  const result = v.rotate(Math.PI / 2);
  expect(result).toBe(v);
});

// clone method tests
test('clone method', () => {
  const v1 = new Vector2(3, 4);
  const v2 = v1.clone();

  // Should have the same values
  expect(v2.x).toBe(3);
  expect(v2.y).toBe(4);

  // Should be a different instance
  expect(v2).not.toBe(v1);

  // Changing one should not affect the other
  v2.x = 10;
  expect(v1.x).toBe(3);
  expect(v2.x).toBe(10);
});

// toArray method tests
test('toArray method', () => {
  const v = new Vector2(3, 4);
  const arr = v.toArray();
  expect(arr).toEqual([3, 4]);
  expect(arr).toHaveLength(2);
});
