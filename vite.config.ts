import { defineConfig } from 'vite';
import path from 'path';
import checker from 'vite-plugin-checker';
import pkg from './package.json';

const dependencies = Object.keys(pkg.dependencies);
const globals: Record<string, string> = {};
for (let i = 0; i < dependencies.length; i += 1) {
  globals[dependencies[i]] = dependencies[i];
}

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'StarryMath',
      fileName: 'starry-math',
    },
    rolldownOptions: {
      external: dependencies,
      output: {
        globals: {
          ...globals,
        },
      }
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, './src'),
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
