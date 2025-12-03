import { test, expect } from 'vitest';

import { Color } from '@/Color';

test('Color constructor', () => {
  const color = new Color();
  expect(color.r).toBe(0);
  expect(color.g).toBe(0);
  expect(color.b).toBe(0);
  expect(color.a).toBe(1);
});
