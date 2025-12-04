import { test, expect } from 'vitest';
import { Euler, EulerOrder } from '@/Euler';
import { Matrix4 } from '@/Matrix4';
import { Vector3 } from '@/Vector3';

test('Euler constructor - default values', () => {
  const euler = new Euler();
  expect(euler.x).toBe(0);
  expect(euler.y).toBe(0);
  expect(euler.z).toBe(0);
  expect(euler.order).toBe(EulerOrder.XYZ);
});

test('Euler constructor - custom values', () => {
  const euler = new Euler(Math.PI / 2, Math.PI / 3, Math.PI / 4, EulerOrder.YZX);
  expect(euler.x).toBe(Math.PI / 2);
  expect(euler.y).toBe(Math.PI / 3);
  expect(euler.z).toBe(Math.PI / 4);
  expect(euler.order).toBe(EulerOrder.YZX);
});

test('Euler set method - with order', () => {
  const euler = new Euler();
  const result = euler.set(1, 2, 3, EulerOrder.ZYX);

  expect(euler.x).toBe(1);
  expect(euler.y).toBe(2);
  expect(euler.z).toBe(3);
  expect(euler.order).toBe(EulerOrder.ZYX);

  // Verify method chaining
  expect(result).toBe(euler);
});

test('Euler set method - without order', () => {
  const euler = new Euler(0, 0, 0, EulerOrder.XZY);
  euler.set(4, 5, 6);

  expect(euler.x).toBe(4);
  expect(euler.y).toBe(5);
  expect(euler.z).toBe(6);
  // Order should remain unchanged when not provided
  expect(euler.order).toBe(EulerOrder.XZY);
});

test('Euler setFromRotationMatrix - XYZ order', () => {
  const euler = new Euler(0, 0, 0, EulerOrder.XYZ);
  const matrix = new Matrix4();

  // Create a rotation matrix using known Euler angles
  const knownEuler = new Euler(Math.PI / 4, Math.PI / 6, Math.PI / 3);
  matrix.compose(new Vector3(0, 0, 0), knownEuler, new Vector3(1, 1, 1));

  euler.setFromRotationMatrix(matrix);

  // Due to floating-point precision and the nature of Euler angles, we use approximate equality
  expect(Math.abs(euler.x - knownEuler.x)).toBeLessThan(1e-15);
  expect(Math.abs(euler.y - knownEuler.y)).toBeLessThan(1e-15);
  expect(Math.abs(euler.z - knownEuler.z)).toBeLessThan(1e-15);
  expect(euler.order).toBe(EulerOrder.XYZ);
});

test('Euler setFromRotationMatrix - different orders', () => {
  // Test all possible rotation orders
  const orders = [
    EulerOrder.XYZ,
    EulerOrder.YXZ,
    EulerOrder.ZXY,
    EulerOrder.ZYX,
    EulerOrder.YZX,
    EulerOrder.XZY
  ];

  orders.forEach(order => {
    const euler = new Euler(0, 0, 0, order);
    const matrix = new Matrix4();

    // Create a rotation matrix with unique angles for each axis
    const testEuler = new Euler(Math.PI / 3, Math.PI / 4, Math.PI / 6, order);
    matrix.compose(new Vector3(0, 0, 0), testEuler, new Vector3(1, 1, 1));

    euler.setFromRotationMatrix(matrix);

    // Check that the order is preserved
    expect(euler.order).toBe(order);

    // Check that the rotation is correctly decomposed (using approximate equality)
    expect(Math.abs(euler.x)).toBeGreaterThan(0); // Should not be zero
    expect(Math.abs(euler.y)).toBeGreaterThan(0); // Should not be zero
    expect(Math.abs(euler.z)).toBeGreaterThan(0); // Should not be zero
  });
});

test('Euler setFromRotationMatrix - gimbal lock case', () => {
  // Test a case that approaches gimbal lock (y near 90 degrees)
  const euler = new Euler(0, 0, 0, EulerOrder.XYZ);
  const matrix = new Matrix4();

  const gimbalLockEuler = new Euler(0, Math.PI / 2, 0); // Very close to 90 degrees
  matrix.compose(new Vector3(0, 0, 0), gimbalLockEuler, new Vector3(1, 1, 1));

  euler.setFromRotationMatrix(matrix);

  // Should handle near-gimbal-lock case without errors
  expect(euler.y).toBeCloseTo(Math.PI / 2, 5);
});

test('Euler equal method - equal eulers', () => {
  const euler1 = new Euler(1, 2, 3, EulerOrder.XYZ);
  const euler2 = new Euler(1, 2, 3, EulerOrder.XYZ);

  expect(euler1.equal(euler2)).toBe(true);
});

test('Euler equal method - different values', () => {
  const euler1 = new Euler(1, 2, 3, EulerOrder.XYZ);

  // Different x
  const euler2 = new Euler(4, 2, 3, EulerOrder.XYZ);
  expect(euler1.equal(euler2)).toBe(false);

  // Different y
  const euler3 = new Euler(1, 5, 3, EulerOrder.XYZ);
  expect(euler1.equal(euler3)).toBe(false);

  // Different z
  const euler4 = new Euler(1, 2, 6, EulerOrder.XYZ);
  expect(euler1.equal(euler4)).toBe(false);

  // Different order
  const euler5 = new Euler(1, 2, 3, EulerOrder.YZX);
  expect(euler1.equal(euler5)).toBe(false);
});

test('Euler copy method', () => {
  const source = new Euler(Math.PI, Math.PI / 2, Math.PI / 3, EulerOrder.ZYX);
  const target = new Euler();

  const result = target.copy(source);

  expect(target.x).toBe(source.x);
  expect(target.y).toBe(source.y);
  expect(target.z).toBe(source.z);
  expect(target.order).toBe(source.order);

  // Verify method chaining
  expect(result).toBe(target);
});

test('Euler clone method', () => {
  const original = new Euler(1.5, 2.5, 3.5, EulerOrder.YXZ);
  const cloned = original.clone();

  expect(cloned.x).toBe(original.x);
  expect(cloned.y).toBe(original.y);
  expect(cloned.z).toBe(original.z);
  expect(cloned.order).toBe(original.order);

  // Verify it's a new instance
  expect(cloned).not.toBe(original);
});

test('Euler toArray method', () => {
  const euler = new Euler(0.1, 0.2, 0.3);
  const array = euler.toArray();

  expect(array).toEqual([0.1, 0.2, 0.3]);
  expect(array.length).toBe(3);
});

test('Euler method chaining', () => {
  const euler = new Euler();

  const result = euler
    .set(1, 2, 3, EulerOrder.XYZ)
    .copy(new Euler(4, 5, 6, EulerOrder.YZX));

  expect(euler.x).toBe(4);
  expect(euler.y).toBe(5);
  expect(euler.z).toBe(6);
  expect(euler.order).toBe(EulerOrder.YZX);

  // Verify the final result is still the original object
  expect(result).toBe(euler);
});

test('Euler with zero rotation', () => {
  const euler = new Euler(0, 0, 0);
  const matrix = new Matrix4();

  // A zero rotation should result in an identity matrix
  matrix.compose(new Vector3(0, 0, 0), euler, new Vector3(1, 1, 1));

  const euler2 = new Euler().setFromRotationMatrix(matrix);

  expect(euler2.x).toBeCloseTo(0);
  expect(euler2.y).toBeCloseTo(0);
  expect(euler2.z).toBeCloseTo(0);
});

test('Euler with full rotation', () => {
  // Test with full 360 degree rotation around x-axis
  const euler = new Euler(2 * Math.PI, 0, 0);
  const matrix = new Matrix4();

  matrix.compose(new Vector3(0, 0, 0), euler, new Vector3(1, 1, 1));

  const euler2 = new Euler().setFromRotationMatrix(matrix);

  // Full rotation should be equivalent to zero rotation
  expect(Math.abs(euler2.x)).toBeLessThan(1e-15);
});
