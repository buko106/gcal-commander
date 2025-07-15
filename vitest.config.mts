import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Disable console interception to allow proper stdout/stderr capture for CLI testing
    disableConsoleIntercept: true,
    include: ['test/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['dist/**/*', 'test/**/*', '**/*.d.ts'],
      reporter: ['html', 'text', 'lcov'],
      all: true,
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
