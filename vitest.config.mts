import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
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
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
  },
});
