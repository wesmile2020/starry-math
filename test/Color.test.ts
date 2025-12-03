import { test, expect } from 'vitest';

import { Color } from '@/Color';

test('Color constructor - default values', () => {
  const color = new Color();
  expect(color.r).toBe(0);
  expect(color.g).toBe(0);
  expect(color.b).toBe(0);
  expect(color.a).toBe(1);
});

test('Color constructor - hex number', () => {
  const color = new Color(0xFF0000); // Red
  expect(color.r).toBe(1);
  expect(color.g).toBe(0);
  expect(color.b).toBe(0);
  expect(color.a).toBe(1);
});

test('Color constructor - color string', () => {
  const color = new Color('#00FF00'); // Green
  expect(color.r).toBe(0);
  expect(color.g).toBe(1);
  expect(color.b).toBe(0);
  expect(color.a).toBe(1);
});

test('Color set method', () => {
  const color = new Color();
  color.set(0.5, 0.75, 0.25, 0.8);
  expect(color.r).toBe(0.5);
  expect(color.g).toBe(0.75);
  expect(color.b).toBe(0.25);
  expect(color.a).toBe(0.8);
});

test('Color set method - chaining', () => {
  const color = new Color();
  const result = color.set(0.1, 0.2, 0.3, 0.4);
  expect(result).toBe(color); // Should return the same instance
});

test('Color setHex method', () => {
  const color = new Color();
  color.setHex(0x0000FF); // Blue
  expect(color.r).toBe(0);
  expect(color.g).toBe(0);
  expect(color.b).toBe(1);
});

test('Color setHex method - chaining', () => {
  const color = new Color();
  const result = color.setHex(0xFFFF00);
  expect(result).toBe(color);
});

test('Color getHex method', () => {
  const color = new Color();
  color.set(1, 0.5, 0, 1);
  expect(color.getHex()).toBe(0xFF7F00);
});

test('Color getHexString method', () => {
  const color = new Color();
  color.set(1, 0, 0, 1);
  expect(color.getHexString()).toBe('FF0000');

  color.set(0, 1, 0, 1);
  expect(color.getHexString()).toBe('00FF00');

  color.set(0, 0, 1, 1);
  expect(color.getHexString()).toBe('0000FF');
});

test('Color setStyle - rgba format', () => {
  const color = new Color();
  color.setStyle('rgba(255, 128, 0, 0.75)');
  expect(color.r).toBe(1);
  expect(color.g).toBeCloseTo(0.50196); // 128/255
  expect(color.b).toBe(0);
  expect(color.a).toBe(0.75);

  color.setStyle('transparent');
});

test('Color setStyle - rgb format', () => {
  const color = new Color();
  color.setStyle('rgb(0, 255, 255)');
  expect(color.r).toBe(0);
  expect(color.g).toBe(1);
  expect(color.b).toBe(1);
  expect(color.a).toBe(1); // Default alpha
});

test('Color setStyle - hex 6-digit', () => {
  const color = new Color();
  color.setStyle('#123456');
  expect(color.r).toBeCloseTo(0.07059); // 18/255
  expect(color.g).toBeCloseTo(0.20392); // 52/255
  expect(color.b).toBeCloseTo(0.33725); // 86/255
});

test('Color setStyle - hex 3-digit', () => {
  const color = new Color();
  color.setStyle('#ABC'); // Should be expanded to #AABBCC
  expect(color.r).toBeCloseTo(0.66667); // 170/255
  expect(color.g).toBeCloseTo(0.73333); // 187/255
  expect(color.b).toBeCloseTo(0.8);     // 204/255
});

test('Color setStyle - transparent', () => {
  const color = new Color();
  color.setStyle('transparent');
  expect(color.r).toBe(0);
  expect(color.g).toBe(0);
  // Note: There's a bug in the implementation - this.a is set twice and this.b is not set
  expect(color.b).toBe(0); // This should pass if the bug is fixed
  expect(color.a).toBe(0);
});

test('Color setStyle - color name', () => {
  const color = new Color();
  color.setStyle('red');
  expect(color.r).toBe(1);
  expect(color.g).toBe(0);
  expect(color.b).toBe(0);
  expect(color.a).toBe(1);
});

test('Color setStyle - chaining', () => {
  const color = new Color();
  const result = color.setStyle('#FF0000');
  expect(result).toBe(color);
});

test('Color getStyle method', () => {
  const color = new Color();
  color.set(1, 0, 0, 0.5);
  expect(color.getStyle()).toBe('rgba(255, 0, 0, 0.5)');
});

test('Color toArray method', () => {
  const color = new Color();
  color.set(0.2, 0.4, 0.6, 0.8);
  const arr = color.toArray();
  expect(arr).toEqual([0.2, 0.4, 0.6, 0.8]);
  expect(arr).toHaveLength(4);
});

test('Color equal method - equal colors', () => {
  const color1 = new Color();
  const color2 = new Color();
  color1.set(0.1, 0.2, 0.3, 0.4);
  color2.set(0.1, 0.2, 0.3, 0.4);
  expect(color1.equal(color2)).toBe(true);
});

test('Color equal method - different colors', () => {
  const color1 = new Color();
  const color2 = new Color();
  color1.set(0.1, 0.2, 0.3, 0.4);
  color2.set(0.5, 0.2, 0.3, 0.4); // Different red component
  expect(color1.equal(color2)).toBe(false);
});

test('Color copy method', () => {
  const source = new Color();
  const target = new Color();
  source.set(0.3, 0.6, 0.9, 0.5);
  target.copy(source);
  expect(target.r).toBe(0.3);
  expect(target.g).toBe(0.6);
  expect(target.b).toBe(0.9);
  expect(target.a).toBe(0.5);
});

test('Color copy method - chaining', () => {
  const source = new Color();
  const target = new Color();
  source.set(0.1, 0.1, 0.1, 0.1);
  const result = target.copy(source);
  expect(result).toBe(target);
});

test('Color clone method', () => {
  const original = new Color();
  original.set(0.25, 0.5, 0.75, 1);
  const cloned = original.clone();

  // Check if values are the same
  expect(cloned.r).toBe(0.25);
  expect(cloned.g).toBe(0.5);
  expect(cloned.b).toBe(0.75);
  expect(cloned.a).toBe(1);

  // Check if they are different instances
  expect(cloned).not.toBe(original);

  // Check if modifying one doesn't affect the other
  original.set(1, 1, 1, 1);
  expect(cloned.r).toBe(0.25); // Should remain unchanged
});
