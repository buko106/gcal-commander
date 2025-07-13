import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Disable console interception to allow proper stdout/stderr capture for CLI testing
    disableConsoleIntercept: true,
    include: ['test/**/*.test.ts'],
    coverage: {
      provider: 'c8',
      include: ['src/**/*.ts'],
      exclude: ['dist/**/*', 'test/**/*', '**/*.d.ts', 'src/locales/**/*'],
      reporter: ['html', 'text', 'lcov'],
      all: true,
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
