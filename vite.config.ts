import { type ViteUserConfig } from 'vitest/config';
declare module "vite" {
	interface UserConfig {
    /**
		* Options for Vitest
		*/
		test?: ViteUserConfig['test'];
  }
}
import { defineConfig } from 'vite';
import path from 'path';
import checker from 'vite-plugin-checker';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'StarryMath',
      fileName: 'starry-math',
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    coverage: {
      enabled: true,
      provider: 'v8',
    },
  },
  plugins: [
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx,js,jsx}"',
      }
    }),
  ],
});
