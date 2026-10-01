import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  outputDir: './tmp/e2e/results',
  timeout: 90000,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: process.env.APP_URL || 'http://localhost:3000',
    trace: 'off',
    screenshot: 'off',
  },
});
