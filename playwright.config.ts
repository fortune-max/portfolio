import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: 'http://localhost:4321' },
  webServer: {
    command: 'E2E=1 npx astro build && HOST=127.0.0.1 PORT=4321 node dist/server/entry.mjs',
    url: 'http://localhost:4321',
    env: { CONTACT_DRY_RUN: '1' },
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
