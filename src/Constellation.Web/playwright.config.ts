import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4210',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx ng serve --port 4210',
    url: 'http://localhost:4210',
    reuseExistingServer: false,
    timeout: 120000,
  },
});
