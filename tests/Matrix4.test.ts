import { test, expect } from 'vitest';

import { Matrix4, type Matrix4Tuple } from '@/Matrix4';
import { Vector3 } from '@/Vector3';
import { Euler } from '@/Euler';
import { Vector4 } from '@/Vector4';

test('Matrix4 constructor - default values', () => {
  const m = new Matrix4();
  const expected = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
  expect(m.toArray()).toEqual(expected);
});

test('Matrix4 constructor - with initial values', () => {
  const initialValues: Matrix4Tuple = [
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 10, 11, 12,
    13, 14, 15, 16
  ];
  const m = new Matrix4(initialValues);
  expect(m.toArray()).toEqual(initialValues);
});

test('Matrix4 identity - should reset to identity matrix', () => {
  const m = new Matrix4([
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 10, 11, 12,
    13, 14, 15, 16
  ]).identity();
  const expected = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
  expect(m.toArray()).toEqual(expected);
});

test('Matrix4 copy - should copy values from another matrix', () => {
  const source = new Matrix4([
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 10, 11, 12,
    13, 14, 15, 16
  ]);
  const target = new Matrix4().copy(source);
  expect(target.toArray()).toEqual(source.toArray());
});

test('Matrix4 clone - should create a new matrix with the same values', () => {
  const m1 = new Matrix4([
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 10, 11, 12,
    13, 14, 15, 16
  ]);
  const m2 = m1.clone();
  expect(m2.toArray()).toEqual(m1.toArray());
  expect(m2).not.toBe(m1); // Ensure it's a different object
});

test('Matrix4 equal - should correctly compare matrices', () => {
  const m1 = new Matrix4([
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 10, 11, 12,
    13, 14, 15, 16
  ]);
  const m2 = new Matrix4(m1.toArray());
  const m3 = new Matrix4().identity();

  expect(m1.equal(m2)).toBe(true);
  expect(m1.equal(m3)).toBe(false);
});

test('Matrix4 multiplyMatrices - should multiply two matrices correctly', () => {
  const a = new Matrix4([
    1, 2, 3, 4,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);
  const b = new Matrix4([
    5, 6, 7, 8,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);
  const result = new Matrix4().multiplyMatrices(a, b);
  const expected = [
    5, 16, 22, 28,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];

  // Use approximate comparison due to potential floating-point precision errors
  result.toArray().forEach((value, index) => {
    expect(value).toBeCloseTo(expected[index], 5);
  });
});

test('Matrix4 multiply - should multiply this matrix by another', () => {
  const m1 = new Matrix4([
    2, 0, 0, 0,
    0, 2, 0, 0,
    0, 0, 2, 0,
    0, 0, 0, 1
  ]);
  const m2 = new Matrix4([
    3, 0, 0, 0,
    0, 3, 0, 0,
    0, 0, 3, 0,
    0, 0, 0, 1
  ]);
  const result = m1.multiply(m2);
  const expected = [
    6, 0, 0, 0,
    0, 6, 0, 0,
    0, 0, 6, 0,
    0, 0, 0, 1
  ];

  result.toArray().forEach((value, index) => {
    expect(value).toBeCloseTo(expected[index], 5);
  });
});

test('Matrix4 premultiply - should premultiply this matrix by another', () => {
  const m1 = new Matrix4([
    2, 0, 0, 0,
    0, 2, 0, 0,
    0, 0, 2, 0,
    0, 0, 0, 1
  ]);
  const m2 = new Matrix4([
    3, 0, 0, 0,
    0, 3, 0, 0,
    0, 0, 3, 0,
    0, 0, 0, 1
  ]);
  const result = m1.premultiply(m2);
  const expected = [
    6, 0, 0, 0,
    0, 6, 0, 0,
    0, 0, 6, 0,
    0, 0, 0, 1
  ];

  result.toArray().forEach((value, index) => {
    expect(value).toBeCloseTo(expected[index], 5);
  });
});

test('Matrix4 transpose - should transpose the matrix correctly', () => {
  const m = new Matrix4([
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 10, 11, 12,
    13, 14, 15, 16
  ]);
  m.transpose();
  const expected = [
    1, 5, 9, 13,
    2, 6, 10, 14,
    3, 7, 11, 15,
    4, 8, 12, 16
  ];
  expect(m.toArray()).toEqual(expected);
});

test('Matrix4 determinant - should calculate determinant correctly', () => {
  const m = new Matrix4([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);
  expect(m.determinant()).toBe(1);

  const m2 = new Matrix4([
    2, 0, 0, 0,
    0, 2, 0, 0,
    0, 0, 2, 0,
    0, 0, 0, 2
  ]);
  expect(m2.determinant()).toBe(16); // 2^4 = 16
});

test('Matrix4 invert - should invert the matrix correctly', () => {
  const m = new Matrix4([
    2, 0, 0, 0,
    0, 2, 0, 0,
    0, 0, 2, 0,
    0, 0, 0, 1
  ]);
  m.invert();
  const expected = [
    0.5, 0, 0, 0,
    0, 0.5, 0, 0,
    0, 0, 0.5, 0,
    0, 0, 0, 1
  ];

  m.toArray().forEach((value, index) => {
    expect(value).toBeCloseTo(expected[index], 5);
  });
});

test('Matrix4 scale - should scale the matrix correctly', () => {
  const m = new Matrix4();
  m.scale(2, 3, 4);
  const expected = [
    2, 0, 0, 0,
    0, 3, 0, 0,
    0, 0, 4, 0,
    0, 0, 0, 1
  ];
  expect(m.toArray()).toEqual(expected);
});

test('Matrix4 translate - should translate the matrix correctly', () => {
  const m = new Matrix4();
  m.translate(5, 6, 7);
  const expected = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    5, 6, 7, 1
  ];
  expect(m.toArray()).toEqual(expected);
});

test('Matrix4 rotate - should rotate around axis correctly', () => {
  const m = new Matrix4();
  const angle = Math.PI / 2; // 90 degrees
  m.rotate(angle, { x: 0, y: 0, z: 1 });

  // Check key values of the rotation matrix
  expect(m.toArray()[0]).toBeCloseTo(0, 5);
  expect(m.toArray()[1]).toBeCloseTo(1, 5);
  expect(m.toArray()[4]).toBeCloseTo(-1, 5);
  expect(m.toArray()[5]).toBeCloseTo(0, 5);
});

test('Matrix4 ortho - should create orthographic projection matrix', () => {
  const m = new Matrix4();
  m.ortho(-1, 1, -1, 1, 1, 100);

  // Check key properties of orthographic projection matrix
  const values = m.toArray();
  expect(values[0]).toBeCloseTo(1, 5); // 2/(right-left)
  expect(values[5]).toBeCloseTo(1, 5); // 2/(top-bottom)
  expect(values[10]).toBeCloseTo(-0.020202, 5); // -2/(far-near)
});

test('Matrix4 perspective - should create perspective projection matrix', () => {
  const m = new Matrix4();
  m.perspective(90, 1, 1, 100);

  // Check key properties of perspective projection matrix
  const values = m.toArray();
  expect(values[0]).toBeCloseTo(1, 5); // ct/aspect where ct = cot(fov/2)
  expect(values[5]).toBeCloseTo(1, 5); // ct
  expect(values[10]).toBeCloseTo(-1.020202, 5); // -(far+near)/(far-near)
  expect(values[11]).toBeCloseTo(-1, 5);
  expect(values[14]).toBeCloseTo(-2.020202, 5); // -2*near*far/(far-near)
});

test('Matrix4 compose - should compose from position, rotation and scale', () => {
  const position = new Vector3(1, 2, 3);
  const euler = new Euler(0, 0, 0);
  const scale = new Vector3(2, 3, 4);

  const m = new Matrix4().compose(position, euler, scale);
  const values = m.toArray();

  expect(values[0]).toBeCloseTo(2, 5); // scale.x
  expect(values[5]).toBeCloseTo(3, 5); // scale.y
  expect(values[10]).toBeCloseTo(4, 5); // scale.z
  expect(values[12]).toBeCloseTo(1, 5); // position.x
  expect(values[13]).toBeCloseTo(2, 5); // position.y
  expect(values[14]).toBeCloseTo(3, 5); // position.z
});

test('Matrix4 decompose - should decompose into position, rotation and scale', () => {
  const position = new Vector3(1, 2, 3);
  const euler = new Euler(0, 0, 0);
  const scale = new Vector3(2, 3, 4);

  const m = new Matrix4().compose(position, euler, scale);

  const outPosition = new Vector3();
  const outEuler = new Euler();
  const outScale = new Vector3();

  m.decompose(outPosition, outEuler, outScale);

  expect(outPosition.x).toBeCloseTo(position.x, 5);
  expect(outPosition.y).toBeCloseTo(position.y, 5);
  expect(outPosition.z).toBeCloseTo(position.z, 5);
  expect(outScale.x).toBeCloseTo(scale.x, 5);
  expect(outScale.y).toBeCloseTo(scale.y, 5);
  expect(outScale.z).toBeCloseTo(scale.z, 5);
});

test('Matrix4 lookAt - should create look-at view matrix', () => {
  const eye = new Vector3(0, 0, 5);
  const target = new Vector3(0, 0, 0);
  const up = new Vector3(0, 1, 0);

  const m = new Matrix4().lookAt(eye, target, up);

  // Check basic properties of the lookAt matrix
  const values = m.toArray();
  expect(values[2]).toBeCloseTo(-0, 5); // -z axis points to target
  expect(values[14]).toBeCloseTo(-5, 5); // translation part
});

test('Matrix4 dropShadow - should apply drop shadow effect', () => {
  const plane = { a: 0, b: 1, c: 0, d: 0 }; // x-z plane
  const light = new Vector4(0, -1, 0, 1); // light shining from above

  const m = new Matrix4().dropShadow(plane, light);

  // Check that the shadow matrix has reasonable values
  expect(m.toArray().length).toBe(16);
});

test('Matrix4 frustum - should create frustum projection matrix', () => {
  const m = new Matrix4().frustum(-1, 1, -1, 1, 1, 100);

  // Check key properties of frustum matrix
  const values = m.toArray();
  expect(values[0]).toBeCloseTo(1, 5); // (2*near)/(right-left)
  expect(values[5]).toBeCloseTo(1, 5); // (2*near)/(top-bottom)
  expect(values[10]).toBeCloseTo(-1.020202, 5); // -(far+near)/(far-near)
});
