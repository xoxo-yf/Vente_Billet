import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    environment: 'node',
  },
  plugins: [
    // Nécessaire pour que Vitest comprenne les décorateurs NestJS (@Injectable, @Controller...)
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
