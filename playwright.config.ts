import { defineConfig } from '@playwright/test';
const baseURL = process.env.APP_URL || 'http://localhost:3000';
if (baseURL !== 'http://localhost:3000')
  throw new Error('Local E2E requires APP_URL=http://localhost:3000.');
export default defineConfig({
  testDir: './e2e',
  outputDir: './tmp/e2e/results',
  timeout: 90000,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'off',
    screenshot: 'off',
  },
});
