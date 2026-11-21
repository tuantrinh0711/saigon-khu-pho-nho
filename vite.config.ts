import { defineConfig } from 'vitest/config';

export default defineConfig({
  server: { strictPort: true },
  test: { include: ['tests/unit/**/*.test.ts'], environment: 'node' },
});
