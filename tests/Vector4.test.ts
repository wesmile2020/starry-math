import { test, expect } from 'vitest';

import { Vector4 } from '@/Vector4';
import { Matrix4 } from '@/Matrix4';

test('Vector4 constructor - default values', () => {
  const v = new Vector4();
  expect(v.x).toBeCloseTo(0);
  expect(v.y).toBeCloseTo(0);
  expect(v.z).toBeCloseTo(0);
  expect(v.w).toBeCloseTo(0);
});

test('Vector4 constructor - with parameters', () => {
  const v = new Vector4(1, 2, 3, 4);
  expect(v.x).toBeCloseTo(1);
  expect(v.y).toBeCloseTo(2);
  expect(v.z).toBeCloseTo(3);
  expect(v.w).toBeCloseTo(4);
});

test('Vector4 set method', () => {
  const v = new Vector4();
  v.set(5, 6, 7, 8);
  expect(v.x).toBeCloseTo(5);
  expect(v.y).toBeCloseTo(6);
  expect(v.z).toBeCloseTo(7);
  expect(v.w).toBeCloseTo(8);
});

test('Vector4 setX, setY, setZ, setW methods', () => {
  const v = new Vector4(1, 2, 3, 4);

  v.setX(10);
  expect(v.x).toBeCloseTo(10);
  expect(v.y).toBeCloseTo(2);
  expect(v.z).toBeCloseTo(3);
  expect(v.w).toBeCloseTo(4);

  v.setY(20);
  expect(v.x).toBeCloseTo(10);
  expect(v.y).toBeCloseTo(20);
  expect(v.z).toBeCloseTo(3);
  expect(v.w).toBeCloseTo(4);

  v.setZ(30);
  expect(v.x).toBeCloseTo(10);
  expect(v.y).toBeCloseTo(20);
  expect(v.z).toBeCloseTo(30);
  expect(v.w).toBeCloseTo(4);

  v.setW(40);
  expect(v.x).toBeCloseTo(10);
  expect(v.y).toBeCloseTo(20);
  expect(v.z).toBeCloseTo(30);
  expect(v.w).toBeCloseTo(40);
});

test('Vector4 applyMatrix4 method', () => {
  // Create a simple translation matrix
  const matrix = new Matrix4([
    1, 0, 0, 5,
    0, 1, 0, 10,
    0, 0, 1, 15,
    0, 0, 0, 1
  ]);

  const v = new Vector4(1, 2, 3, 1);
  v.applyMatrix4(matrix);

  expect(v.x).toBeCloseTo(1); // 1*1 + 2*0 + 3*0 + 1*0
  expect(v.y).toBeCloseTo(2); // 1*0 + 2*1 + 3*0 + 1*0
  expect(v.z).toBeCloseTo(3); // 1*0 + 2*0 + 3*1 + 1*0
  expect(v.w).toBeCloseTo(71); // 1*5 + 2*10 + 3*15 + 1*1
});

test('Vector4 add method', () => {
  const v1 = new Vector4(1, 2, 3, 4);
  const v2 = new Vector4(5, 6, 7, 8);

  v1.add(v2);

  expect(v1.x).toBeCloseTo(6);
  expect(v1.y).toBeCloseTo(8);
  expect(v1.z).toBeCloseTo(10);
  expect(v1.w).toBeCloseTo(12);
});

test('Vector4 subtract method', () => {
  const v1 = new Vector4(10, 8, 6, 4);
  const v2 = new Vector4(5, 3, 2, 1);

  v1.subtract(v2);

  expect(v1.x).toBeCloseTo(5);
  expect(v1.y).toBeCloseTo(5);
  expect(v1.z).toBeCloseTo(4);
  expect(v1.w).toBeCloseTo(3);
});

test('Vector4 multiply method', () => {
  const v1 = new Vector4(2, 3, 4, 5);
  const v2 = new Vector4(6, 7, 8, 9);

  v1.multiply(v2);

  expect(v1.x).toBeCloseTo(12);
  expect(v1.y).toBeCloseTo(21);
  expect(v1.z).toBeCloseTo(32);
  expect(v1.w).toBeCloseTo(45);
});

test('Vector4 divide method', () => {
  const v1 = new Vector4(10, 20, 30, 40);
  const v2 = new Vector4(2, 4, 5, 8);

  v1.divide(v2);

  expect(v1.x).toBeCloseTo(5);
  expect(v1.y).toBeCloseTo(5);
  expect(v1.z).toBeCloseTo(6);
  expect(v1.w).toBeCloseTo(5);
});

// Note: There's a typo in the method name in Vector4.ts (multiplyScaler instead of multiplyScalar)
test('Vector4 multiplyScaler method', () => {
  const v = new Vector4(1, 2, 3, 4);

  v.multiplyScaler(2);

  expect(v.x).toBeCloseTo(2);
  expect(v.y).toBeCloseTo(4);
  expect(v.z).toBeCloseTo(6);
  expect(v.w).toBeCloseTo(8);
});

// Note: There's a typo in the method name in Vector4.ts (divideScaler instead of divideScalar)
test('Vector4 divideScaler method', () => {
  const v = new Vector4(8, 6, 4, 2);

  v.divideScaler(2);

  expect(v.x).toBeCloseTo(4);
  expect(v.y).toBeCloseTo(3);
  expect(v.z).toBeCloseTo(2);
  expect(v.w).toBeCloseTo(1);
});

test('Vector4 unit method', () => {
  const v = new Vector4(1, 0, 0, 0);

  v.unit();

  expect(v.x).toBeCloseTo(1);
  expect(v.y).toBeCloseTo(0);
  expect(v.z).toBeCloseTo(0);
  expect(v.w).toBeCloseTo(0);
  expect(v.length()).toBeCloseTo(1);

  // Test with a non-unit vector
  const v2 = new Vector4(3, 4, 0, 0);
  v2.unit();

  expect(v2.length()).toBeCloseTo(1);
  expect(v2.x).toBeCloseTo(0.6);
  expect(v2.y).toBeCloseTo(0.8);
});

// Note: There's a bug in the Vector4.unit() method - it doesn't check for zero length
test('Vector4 length method', () => {
  const v1 = new Vector4(1, 0, 0, 0);
  expect(v1.length()).toBeCloseTo(1);

  const v2 = new Vector4(0, 0, 0, 0);
  expect(v2.length()).toBeCloseTo(0);

  const v3 = new Vector4(1, 1, 1, 1);
  expect(v3.length()).toBeCloseTo(2); // sqrt(1+1+1+1) = sqrt(4) = 2

  const v4 = new Vector4(3, 4, 0, 0);
  expect(v4.length()).toBeCloseTo(5); // 3-4-5 triangle
});

test('Vector4 lengthSquare method', () => {
  const v1 = new Vector4(1, 0, 0, 0);
  expect(v1.lengthSquare()).toBeCloseTo(1);

  const v2 = new Vector4(0, 0, 0, 0);
  expect(v2.lengthSquare()).toBeCloseTo(0);

  const v3 = new Vector4(1, 1, 1, 1);
  expect(v3.lengthSquare()).toBeCloseTo(4); // 1+1+1+1 = 4

  const v4 = new Vector4(3, 4, 0, 0);
  expect(v4.lengthSquare()).toBeCloseTo(25); // 3^2 + 4^2 = 9 + 16 = 25
});

test('Vector4 equal method', () => {
  const v1 = new Vector4(1, 2, 3, 4);
  const v2 = new Vector4(1, 2, 3, 4);
  const v3 = new Vector4(5, 6, 7, 8);

  expect(v1.equal(v2)).toBe(true);
  expect(v1.equal(v3)).toBe(false);
});

test('Vector4 copy method', () => {
  const source = new Vector4(10, 20, 30, 40);
  const target = new Vector4(1, 2, 3, 4);

  target.copy(source);

  expect(target.x).toBeCloseTo(10);
  expect(target.y).toBeCloseTo(20);
  expect(target.z).toBeCloseTo(30);
  expect(target.w).toBeCloseTo(40);
});

test('Vector4 clone method', () => {
  const original = new Vector4(5, 10, 15, 20);
  const cloned = original.clone();

  expect(cloned).not.toBe(original); // Different objects
  expect(cloned.equal(original)).toBe(true); // Same values

  // Modify original to ensure they are independent
  original.set(1, 2, 3, 4);
  expect(cloned.x).toBeCloseTo(5); // Clone should not be affected
});

test('Vector4 toArray method', () => {
  const v = new Vector4(1, 2, 3, 4);
  const arr = v.toArray();

  expect(arr).toEqual([1, 2, 3, 4]);
  expect(arr.length).toBe(4);
});

test('Vector4 method chaining', () => {
  const v = new Vector4(1, 1, 1, 1);

  v.setX(2).setY(3).setZ(4).setW(5).multiplyScaler(2);

  expect(v.x).toBeCloseTo(4);
  expect(v.y).toBeCloseTo(6);
  expect(v.z).toBeCloseTo(8);
  expect(v.w).toBeCloseTo(10);
});

test('Vector4 edge cases - zero vector', () => {
  const v = new Vector4(0, 0, 0, 0);

  expect(v.lengthSquare()).toBeCloseTo(0);
  expect(v.length()).toBeCloseTo(0);

  // Note: Calling unit() on a zero vector should throw an error but doesn't in the current implementation
});

test('Vector4 edge cases - negative components', () => {
  const v = new Vector4(-1, -2, -3, -4);

  expect(v.lengthSquare()).toBeCloseTo(30); // 1 + 4 + 9 + 16 = 30
  expect(v.length()).toBeCloseTo(Math.sqrt(30));

  v.multiplyScaler(-1);
  expect(v.x).toBeCloseTo(1);
  expect(v.y).toBeCloseTo(2);
  expect(v.z).toBeCloseTo(3);
  expect(v.w).toBeCloseTo(4);
});
