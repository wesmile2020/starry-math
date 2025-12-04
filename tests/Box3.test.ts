import { test, expect } from 'vitest';
import { Box3 } from '@/Box3';
import { Vector3 } from '@/Vector3';

test('Box3 constructor - default values', () => {
  const box = new Box3();
  expect(box.min.x).toBe(0);
  expect(box.min.y).toBe(0);
  expect(box.min.z).toBe(0);
  expect(box.max.x).toBe(0);
  expect(box.max.y).toBe(0);
  expect(box.max.z).toBe(0);
});

test('Box3 constructor - custom values', () => {
  const min = new Vector3(1, 2, 3);
  const max = new Vector3(4, 5, 6);
  const box = new Box3(min, max);

  expect(box.min).toBe(min);
  expect(box.max).toBe(max);
  expect(box.min.x).toBe(1);
  expect(box.min.y).toBe(2);
  expect(box.min.z).toBe(3);
  expect(box.max.x).toBe(4);
  expect(box.max.y).toBe(5);
  expect(box.max.z).toBe(6);
});

test('Box3 set method', () => {
  const box = new Box3();
  const min = new Vector3(-1, -2, -3);
  const max = new Vector3(1, 2, 3);

  const result = box.set(min, max);

  // Verify values are set correctly
  expect(box.min.x).toBe(-1);
  expect(box.min.y).toBe(-2);
  expect(box.min.z).toBe(-3);
  expect(box.max.x).toBe(1);
  expect(box.max.y).toBe(2);
  expect(box.max.z).toBe(3);

  // Verify method chaining
  expect(result).toBe(box);
});

test('Box3 copy method', () => {
  const sourceBox = new Box3(
    new Vector3(10, 20, 30),
    new Vector3(40, 50, 60)
  );
  const targetBox = new Box3();

  const result = targetBox.copy(sourceBox);

  // Verify values are copied correctly
  expect(targetBox.min.x).toBe(10);
  expect(targetBox.min.y).toBe(20);
  expect(targetBox.min.z).toBe(30);
  expect(targetBox.max.x).toBe(40);
  expect(targetBox.max.y).toBe(50);
  expect(targetBox.max.z).toBe(60);

  // Verify method chaining
  expect(result).toBe(targetBox);

  // Verify it's a copy, not reference
  expect(targetBox.min).not.toBe(sourceBox.min);
  expect(targetBox.max).not.toBe(sourceBox.max);
});

test('Box3 clone method', () => {
  const originalBox = new Box3(
    new Vector3(5, 10, 15),
    new Vector3(20, 25, 30)
  );

  const clonedBox = originalBox.clone();

  // Verify cloned box has same values
  expect(clonedBox.min.x).toBe(5);
  expect(clonedBox.min.y).toBe(10);
  expect(clonedBox.min.z).toBe(15);
  expect(clonedBox.max.x).toBe(20);
  expect(clonedBox.max.y).toBe(25);
  expect(clonedBox.max.z).toBe(30);

  // Verify it's a new instance
  expect(clonedBox).not.toBe(originalBox);
  expect(clonedBox.min).not.toBe(originalBox.min);
  expect(clonedBox.max).not.toBe(originalBox.max);
});

test('Box3 equal method - equal boxes', () => {
  const box1 = new Box3(
    new Vector3(1, 2, 3),
    new Vector3(4, 5, 6)
  );
  const box2 = new Box3(
    new Vector3(1, 2, 3),
    new Vector3(4, 5, 6)
  );

  expect(box1.equal(box2)).toBe(true);
});

test('Box3 equal method - different boxes', () => {
  const box1 = new Box3(
    new Vector3(1, 2, 3),
    new Vector3(4, 5, 6)
  );

  // Different min
  const box2 = new Box3(
    new Vector3(10, 2, 3),
    new Vector3(4, 5, 6)
  );

  // Different max
  const box3 = new Box3(
    new Vector3(1, 2, 3),
    new Vector3(40, 5, 6)
  );

  expect(box1.equal(box2)).toBe(false);
  expect(box1.equal(box3)).toBe(false);
});

test('Box3 expandByNumber method', () => {
  const box = new Box3(
    new Vector3(0, 0, 0),
    new Vector3(10, 10, 10)
  );

  const result = box.expandByNumber(5);

  // Verify expansion
  expect(box.min.x).toBe(-5);
  expect(box.min.y).toBe(-5);
  expect(box.min.z).toBe(-5);
  expect(box.max.x).toBe(15);
  expect(box.max.y).toBe(15);
  expect(box.max.z).toBe(15);

  // Verify method chaining
  expect(result).toBe(box);
});

test('Box3 expandByNumber method - negative number', () => {
  const box = new Box3(
    new Vector3(0, 0, 0),
    new Vector3(10, 10, 10)
  );

  const result = box.expandByNumber(-2);

  // Verify contraction (negative expansion)
  expect(box.min.x).toBe(2);
  expect(box.min.y).toBe(2);
  expect(box.min.z).toBe(2);
  expect(box.max.x).toBe(8);
  expect(box.max.y).toBe(8);
  expect(box.max.z).toBe(8);

  // Verify method chaining
  expect(result).toBe(box);
});

test('Box3 expandByVector method', () => {
  const box = new Box3(
    new Vector3(0, 0, 0),
    new Vector3(10, 10, 10)
  );
  const expansionVector = new Vector3(2, 3, 4);

  const result = box.expandByVector(expansionVector);

  // Verify expansion
  expect(box.min.x).toBe(-2);
  expect(box.min.y).toBe(-3);
  expect(box.min.z).toBe(-4);
  expect(box.max.x).toBe(12);
  expect(box.max.y).toBe(13);
  expect(box.max.z).toBe(14);

  // Verify method chaining
  expect(result).toBe(box);
});

test('Box3 expandByVector method - different values per axis', () => {
  const box = new Box3(
    new Vector3(5, 10, 15),
    new Vector3(20, 25, 30)
  );
  const expansionVector = new Vector3(1, 2, 3);

  box.expandByVector(expansionVector);

  // Verify axis-specific expansion
  expect(box.min.x).toBe(4);
  expect(box.min.y).toBe(8);
  expect(box.min.z).toBe(12);
  expect(box.max.x).toBe(21);
  expect(box.max.y).toBe(27);
  expect(box.max.z).toBe(33);
});

test('Box3 method chaining', () => {
  const box = new Box3();
  const min = new Vector3(1, 2, 3);
  const max = new Vector3(10, 11, 12);
  const expansionVector = new Vector3(1, 1, 1);

  // Chain multiple operations
  const result = box
    .set(min, max)
    .expandByNumber(2)
    .expandByVector(expansionVector);

  // Verify all operations were applied
  expect(box.min.x).toBe(-2);
  expect(box.min.y).toBe(-1);
  expect(box.min.z).toBe(0);
  expect(box.max.x).toBe(13);
  expect(box.max.y).toBe(14);
  expect(box.max.z).toBe(15);

  // Verify final result is still the original box
  expect(result).toBe(box);
});
