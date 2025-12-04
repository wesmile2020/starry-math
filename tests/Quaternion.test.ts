import { test, expect } from 'vitest';

import { Quaternion } from '@/Quaternion';
import { Euler, EulerOrder } from '@/Euler';

// Constructor tests
test('Quaternion constructor - default values', () => {
  const q = new Quaternion();
  expect(q.x).toBe(0);
  expect(q.y).toBe(0);
  expect(q.z).toBe(0);
  expect(q.w).toBe(1);
});

test('Quaternion constructor - with custom values', () => {
  const q = new Quaternion(1, 2, 3, 4);
  expect(q.x).toBe(1);
  expect(q.y).toBe(2);
  expect(q.z).toBe(3);
  expect(q.w).toBe(4);
});

// set method tests
test('Quaternion set method', () => {
  const q = new Quaternion();
  const result = q.set(5, 6, 7, 8);

  // Check if values are set correctly
  expect(q.x).toBe(5);
  expect(q.y).toBe(6);
  expect(q.z).toBe(7);
  expect(q.w).toBe(8);

  // Check if method returns this for chaining
  expect(result).toBe(q);
});

// equal method tests
test('Quaternion equal method - identical quaternions', () => {
  const q1 = new Quaternion(1, 2, 3, 4);
  const q2 = new Quaternion(1, 2, 3, 4);

  expect(q1.equal(q2)).toBe(true);
});

test('Quaternion equal method - different quaternions', () => {
  const q1 = new Quaternion(1, 2, 3, 4);

  // Test different x
  const q2 = new Quaternion(9, 2, 3, 4);
  expect(q1.equal(q2)).toBe(false);

  // Test different y
  const q3 = new Quaternion(1, 9, 3, 4);
  expect(q1.equal(q3)).toBe(false);

  // Test different z
  const q4 = new Quaternion(1, 2, 9, 4);
  expect(q1.equal(q4)).toBe(false);

  // Test different w
  const q5 = new Quaternion(1, 2, 3, 9);
  expect(q1.equal(q5)).toBe(false);
});

// copy method tests
test('Quaternion copy method', () => {
  const source = new Quaternion(1, 2, 3, 4);
  const target = new Quaternion(0, 0, 0, 1);

  const result = target.copy(source);

  // Check if values are copied correctly
  expect(target.x).toBe(1);
  expect(target.y).toBe(2);
  expect(target.z).toBe(3);
  expect(target.w).toBe(4);

  // Check if method returns this for chaining
  expect(result).toBe(target);
});

// clone method tests
test('Quaternion clone method', () => {
  const original = new Quaternion(1, 2, 3, 4);
  const cloned = original.clone();

  // Check if values are identical
  expect(cloned.x).toBe(1);
  expect(cloned.y).toBe(2);
  expect(cloned.z).toBe(3);
  expect(cloned.w).toBe(4);

  // Check if it's a different object reference
  expect(cloned).not.toBe(original);
});

// setFromEuler method tests
test('Quaternion setFromEuler - XYZ order, zero rotation', () => {
  const euler = new Euler(0, 0, 0, EulerOrder.XYZ);
  const q = new Quaternion().setFromEuler(euler);

  // Zero rotation should result in identity quaternion
  expect(q.x).toBeCloseTo(0, 5);
  expect(q.y).toBeCloseTo(0, 5);
  expect(q.z).toBeCloseTo(0, 5);
  expect(q.w).toBeCloseTo(1, 5);
});

test('Quaternion setFromEuler - XYZ order, 90 degrees around X', () => {
  const euler = new Euler(Math.PI / 2, 0, 0, EulerOrder.XYZ);
  const q = new Quaternion().setFromEuler(euler);

  // 90 degrees around X should have (1,0,0) axis and w = cos(45°), x = sin(45°)
  expect(q.x).toBeCloseTo(Math.sqrt(2)/2, 5);
  expect(q.y).toBeCloseTo(0, 5);
  expect(q.z).toBeCloseTo(0, 5);
  expect(q.w).toBeCloseTo(Math.sqrt(2)/2, 5);
});

test('Quaternion setFromEuler - XYZ order, 90 degrees around Y', () => {
  const euler = new Euler(0, Math.PI / 2, 0, EulerOrder.XYZ);
  const q = new Quaternion().setFromEuler(euler);

  // 90 degrees around Y should have (0,1,0) axis and w = cos(45°), y = sin(45°)
  expect(q.x).toBeCloseTo(0, 5);
  expect(q.y).toBeCloseTo(Math.sqrt(2)/2, 5);
  expect(q.z).toBeCloseTo(0, 5);
  expect(q.w).toBeCloseTo(Math.sqrt(2)/2, 5);
});

test('Quaternion setFromEuler - XYZ order, 90 degrees around Z', () => {
  const euler = new Euler(0, 0, Math.PI / 2, EulerOrder.XYZ);
  const q = new Quaternion().setFromEuler(euler);

  // 90 degrees around Z should have (0,0,1) axis and w = cos(45°), z = sin(45°)
  expect(q.x).toBeCloseTo(0, 5);
  expect(q.y).toBeCloseTo(0, 5);
  expect(q.z).toBeCloseTo(Math.sqrt(2)/2, 5);
  expect(q.w).toBeCloseTo(Math.sqrt(2)/2, 5);
});

test('Quaternion setFromEuler - different rotation orders', () => {
  // Test all rotation orders with the same angles
  const angle = Math.PI / 3; // 60 degrees
  const orders = [
    EulerOrder.XYZ,
    EulerOrder.YXZ,
    EulerOrder.ZXY,
    EulerOrder.ZYX,
    EulerOrder.YZX,
    EulerOrder.XZY
  ];

  const quaternions = orders.map(order => {
    const euler = new Euler(angle, angle, angle, order);
    return new Quaternion().setFromEuler(euler);
  });
  // All should be different (for non-zero angles with different orders)
  // Just check a few combinations to ensure they're different
  expect(quaternions[0].z).not.toBeCloseTo(quaternions[1].z, 5);
  expect(quaternions[2].z).not.toBeCloseTo(quaternions[3].z, 5);
});

test('Quaternion setFromEuler - returns this for chaining', () => {
  const euler = new Euler(Math.PI / 2, 0, 0, EulerOrder.XYZ);
  const q = new Quaternion();
  const result = q.setFromEuler(euler);

  expect(result).toBe(q);
});

// Edge cases and special values
test('Quaternion with large values', () => {
  const q = new Quaternion(1000, -2000, 3000, 4000);
  expect(q.x).toBe(1000);
  expect(q.y).toBe(-2000);
  expect(q.z).toBe(3000);
  expect(q.w).toBe(4000);
});

test('Quaternion with negative values', () => {
  const q = new Quaternion(-1, -2, -3, -4);
  expect(q.x).toBe(-1);
  expect(q.y).toBe(-2);
  expect(q.z).toBe(-3);
  expect(q.w).toBe(-4);
});

test('Quaternion with zero values', () => {
  const q = new Quaternion(0, 0, 0, 0);
  expect(q.x).toBe(0);
  expect(q.y).toBe(0);
  expect(q.z).toBe(0);
  expect(q.w).toBe(0);
});
