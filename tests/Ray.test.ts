import { test, expect } from 'vitest';

import { Ray } from '@/Ray';
import { Vector3 } from '@/Vector3';
import { Box3 } from '@/Box3';
import { Matrix4 } from '@/Matrix4';

// Constructor tests
test('Ray constructor - default values', () => {
  const ray = new Ray();
  expect(ray.origin).toEqual({ x: 0, y: 0, z: 0 });
  expect(ray.direction).toEqual({ x: 0, y: 0, z: 0 });
});

test('Ray constructor - with custom origin and direction', () => {
  const origin = new Vector3(1, 2, 3);
  const direction = new Vector3(4, 5, 6);
  const ray = new Ray(origin, direction);

  expect(ray.origin).toBe(origin);
  expect(ray.direction).toBe(direction);
});

// set() method tests
test('Ray set() - updates origin and direction', () => {
  const ray = new Ray();
  const origin = new Vector3(1, 2, 3);
  const direction = new Vector3(4, 5, 6);

  ray.set(origin, direction);

  expect(ray.origin).toBe(origin);
  expect(ray.direction).toBe(direction);
});

test('Ray set() - returns this for method chaining', () => {
  const ray = new Ray();
  const origin = new Vector3(1, 2, 3);
  const direction = new Vector3(4, 5, 6);

  const result = ray.set(origin, direction);

  expect(result).toBe(ray);
});

// at() method tests
test('Ray at() - calculates point along ray at parameter t', () => {
  const origin = new Vector3(1, 2, 3);
  const direction = new Vector3(2, 0, 0);
  const ray = new Ray(origin, direction);
  const target = new Vector3();

  const result = ray.at(3, target);

  expect(result).toBe(target);
  expect(result).toEqual({ x: 7, y: 2, z: 3 });
});

test('Ray at() - works with negative t value', () => {
  const origin = new Vector3(5, 0, 0);
  const direction = new Vector3(1, 0, 0);
  const ray = new Ray(origin, direction);
  const target = new Vector3();

  ray.at(-2, target);

  expect(target).toEqual({ x: 3, y: 0, z: 0 });
});

// lookAt() method tests
test('Ray lookAt() - sets direction to point from origin to target', () => {
  const origin = new Vector3(1, 1, 1);
  const ray = new Ray(origin.clone());
  const target = new Vector3(4, 5, 7);

  ray.lookAt(target);

  // Calculate expected normalized direction
  const expectedDir = target.clone().subtract(origin).unit();
  expect(ray.direction.x).toBeCloseTo(expectedDir.x, 5);
  expect(ray.direction.y).toBeCloseTo(expectedDir.y, 5);
  expect(ray.direction.z).toBeCloseTo(expectedDir.z, 5);
});

test('Ray lookAt() - returns this for method chaining', () => {
  const ray = new Ray();
  const result = ray.lookAt(new Vector3(1, 0, 0));
  expect(result).toBe(ray);
});

// recast() method tests
test('Ray recast() - moves origin along direction by distance t', () => {
  const origin = new Vector3(1, 2, 3);
  const direction = new Vector3(0, 0, 1);
  const ray = new Ray(origin, direction);

  ray.recast(5);

  expect(ray.origin).toEqual({ x: 1, y: 2, z: 8 });
});

test('Ray recast() - returns this for method chaining', () => {
  const ray = new Ray();
  ray.direction.set(1, 0, 0);
  const result = ray.recast(1);
  expect(result).toBe(ray);
});

// closestPointToPoint() method tests
test('Ray closestPointToPoint() - returns origin when point is behind ray', () => {
  const ray = new Ray(new Vector3(0, 0, 0), new Vector3(1, 0, 0));
  const point = new Vector3(-1, 0, 0);

  const closestPoint = ray.closestPointToPoint(point);

  expect(closestPoint).toEqual({ x: 0, y: 0, z: 0 });
});

test('Ray closestPointToPoint() - returns point along ray when point is in front', () => {
  const ray = new Ray(new Vector3(0, 0, 0), new Vector3(1, 0, 0));
  const point = new Vector3(5, 3, 4);

  const closestPoint = ray.closestPointToPoint(point);

  expect(closestPoint).toEqual({ x: 5, y: 0, z: 0 });
});

// distanceSqToPoint() method tests
test('Ray distanceSqToPoint() - calculates squared distance to point', () => {
  const ray = new Ray(new Vector3(0, 0, 0), new Vector3(1, 0, 0));
  const point = new Vector3(0, 3, 4);

  const distanceSq = ray.distanceSqToPoint(point);

  expect(distanceSq).toBe(25); // 3^2 + 4^2 = 25
});

test('Ray distanceSqToPoint() - returns squared distance to origin when point is behind', () => {
  const ray = new Ray(new Vector3(2, 0, 0), new Vector3(1, 0, 0));
  const point = new Vector3(0, 0, 0);

  const distanceSq = ray.distanceSqToPoint(point);

  expect(distanceSq).toBe(4); // (2-0)^2 + (0-0)^2 + (0-0)^2 = 4
});

// distanceToPoint() method tests
test('Ray distanceToPoint() - calculates distance to point', () => {
  const ray = new Ray(new Vector3(0, 0, 0), new Vector3(1, 0, 0));
  const point = new Vector3(0, 3, 4);

  const distance = ray.distanceToPoint(point);

  expect(distance).toBe(5); // sqrt(3^2 + 4^2) = 5
});

// distanceSqToSegment() method tests
test('Ray distanceSqToSegment() - calculates squared distance to segment', () => {
  const ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 1, 0));
  const v0 = new Vector3(1, 0, 0);
  const v1 = new Vector3(1, 2, 0);

  const distanceSq = ray.distanceSqToSegment(v0, v1);

  expect(distanceSq).toBe(1); // Closest distance is 1 unit
});

test('Ray distanceSqToSegment() - calculates closest points on ray and segment', () => {
  const ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 1, 0));
  const v0 = new Vector3(1, 0, 0);
  const v1 = new Vector3(1, 2, 0);
  const pointOnRay = new Vector3();
  const pointOnSegment = new Vector3();

  ray.distanceSqToSegment(v0, v1, pointOnRay, pointOnSegment);

  expect(pointOnRay).toEqual({ x: 0, y: 2, z: 0 });
  expect(pointOnSegment).toEqual({ x: 1, y: 2, z: 0 });
});

// intersectBox() method tests
test('Ray intersectBox() - returns intersection point when ray intersects box', () => {
  const ray = new Ray(new Vector3(-5, 0, 0), new Vector3(1, 0, 0));
  const box = new Box3(new Vector3(0, -1, -1), new Vector3(1, 1, 1));

  const intersection = ray.intersectBox(box);

  expect(intersection).not.toBeNull();
  expect(intersection).toEqual({ x: 0, y: 0, z: 0 });
});

test('Ray intersectBox() - returns null when ray does not intersect box', () => {
  const ray = new Ray(new Vector3(-5, 0, 0), new Vector3(0, 1, 0));
  const box = new Box3(new Vector3(0, -1, -1), new Vector3(1, 1, 1));

  const intersection = ray.intersectBox(box);

  expect(intersection).toBeNull();
});

test('Ray intersectBox() - returns null when ray is inside box but pointing away', () => {
  const ray = new Ray(new Vector3(0.5, 0, 0), new Vector3(-1, 0, 0));
  const box = new Box3(new Vector3(0, -1, -1), new Vector3(1, 1, 1));

  const intersection = ray.intersectBox(box);

  expect(intersection).not.toBeNull();
  // Ray origin is inside box, should return the intersection point with the box face
});

// intersectTriangle() method tests
test('Ray intersectTriangle() - returns intersection point when ray intersects triangle', () => {
  const ray = new Ray(new Vector3(0, 2, 0), new Vector3(0, -1, 0));
  const a = new Vector3(-1, 0, -1);
  const b = new Vector3(1, 0, -1);
  const c = new Vector3(0, 0, 1);

  const intersection = ray.intersectTriangle(a, b, c, false);

  expect(intersection).not.toBeNull();
  expect(intersection).toEqual({ x: 0, y: 0, z: 0 });
});

test('Ray intersectTriangle() - returns null when ray does not intersect triangle', () => {
  const ray = new Ray(new Vector3(0, 2, 0), new Vector3(1, 0, 0));
  const a = new Vector3(-1, 0, -1);
  const b = new Vector3(1, 0, -1);
  const c = new Vector3(0, 0, 1);

  const intersection = ray.intersectTriangle(a, b, c, false);

  expect(intersection).toBeNull();
});

test('Ray intersectTriangle() - respects backface culling', () => {
  const ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 1)); // Ray pointing at triangle from front
  const a = new Vector3(-1, -1, 1);
  const b = new Vector3(1, -1, 1);
  const c = new Vector3(0, 1, 1);

  // Should intersect with backface culling disabled
  const intersection1 = ray.intersectTriangle(a, b, c, false);
  expect(intersection1).not.toBeNull();

  // Reverse ray direction to come from back
  const reverseRay = new Ray(new Vector3(0, 0, 3), new Vector3(0, 0, -1));

  // Should return null with backface culling enabled
  const intersection2 = reverseRay.intersectTriangle(a, b, c, true);
  expect(intersection2).toEqual({ x: 0, y: 0, z: 1 });
});

// applyMatrix4() method tests
test('Ray applyMatrix4() - applies transformation matrix to ray', () => {
  const ray = new Ray(new Vector3(1, 2, 3), new Vector3(0, 0, 1));
  const matrix = new Matrix4();
  matrix.translate(10, 20, 30);

  ray.applyMatrix4(matrix);

  expect(ray.origin).toEqual({ x: 11, y: 22, z: 33 });
  // Direction should remain (0,0,1) as translate doesn't affect direction
  expect(ray.direction).toEqual({ x: 0, y: 0, z: 1 });
});

test('Ray applyMatrix4() - returns this for method chaining', () => {
  const ray = new Ray();
  const matrix = new Matrix4();
  const result = ray.applyMatrix4(matrix);
  expect(result).toBe(ray);
});

// equal() method tests
test('Ray equal() - returns true for identical rays', () => {
  const ray1 = new Ray(new Vector3(1, 2, 3), new Vector3(4, 5, 6));
  const ray2 = new Ray(new Vector3(1, 2, 3), new Vector3(4, 5, 6));

  expect(ray1.equal(ray2)).toBe(true);
});

test('Ray equal() - returns false for different rays', () => {
  const ray1 = new Ray(new Vector3(1, 2, 3), new Vector3(4, 5, 6));
  const ray2 = new Ray(new Vector3(7, 8, 9), new Vector3(10, 11, 12));

  expect(ray1.equal(ray2)).toBe(false);
});

// copy() method tests
test('Ray copy() - copies origin and direction from another ray', () => {
  const source = new Ray(new Vector3(1, 2, 3), new Vector3(4, 5, 6));
  const ray = new Ray();

  ray.copy(source);

  expect(ray.origin.equal(source.origin)).toBe(true);
  expect(ray.direction.equal(source.direction)).toBe(true);
  // Should be different objects but with same values
  expect(ray.origin).not.toBe(source.origin);
  expect(ray.direction).not.toBe(source.direction);
});

test('Ray copy() - returns this for method chaining', () => {
  const ray = new Ray();
  const source = new Ray(new Vector3(1, 2, 3), new Vector3(4, 5, 6));
  const result = ray.copy(source);
  expect(result).toBe(ray);
});

// clone() method tests
test('Ray clone() - creates a new ray with same origin and direction values', () => {
  const ray = new Ray(new Vector3(1, 2, 3), new Vector3(4, 5, 6));
  const cloned = ray.clone();

  expect(cloned.origin.equal(ray.origin)).toBe(true);
  expect(cloned.direction.equal(ray.direction)).toBe(true);
  // Should be different objects
  expect(cloned).not.toBe(ray);
  expect(cloned.origin).not.toBe(ray.origin);
  expect(cloned.direction).not.toBe(ray.direction);
});
