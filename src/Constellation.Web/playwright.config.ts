import { defineConfig, devices } from '@playwright/test';

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
  projects: [
    {
      name: 'desktop',
      use: { viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'tablet',
      use: { viewport: { width: 768, height: 900 } },
    },
    {
      name: 'mobile',
      use: { viewport: { width: 402, height: 874 } },
    },
  ],
  webServer: {
    command: 'npx ng serve --port 4210',
    url: 'http://localhost:4210',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
