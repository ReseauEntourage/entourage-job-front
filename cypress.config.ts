import 'dotenv/config';
import { defineConfig } from 'cypress';

module.exports = defineConfig({
  video: false,
  projectId: process.env.CYPRESS_IO_PROJECT_ID,
  defaultCommandTimeout: 10000, // 10 seconds
  pageLoadTimeout: 120000, // 2 minutes
  scrollBehavior: 'center',
  // Set a consistent viewport size for all tests
  viewportWidth: 1920,
  viewportHeight: 1080,
  env: {},
  e2e: {
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
    supportFile: 'cypress/support/e2e.ts',
  },
  retries: 3,
});
