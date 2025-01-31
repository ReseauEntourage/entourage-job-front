import 'dotenv/config';
import { defineConfig } from 'cypress';

module.exports = defineConfig({
  video: false,
  projectId: process.env.CYPRESS_IO_PROJECT_ID,
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 120000,
  scrollBehavior: 'center',
  viewportWidth: 1920,
  viewportHeight: 1080,
  env: {
    adresseLocauxParis: `${process.env.NEXT_PUBLIC_ADRESSE_LOCAUX_PARIS}`,
  },
  e2e: {
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
    supportFile: 'cypress/support/e2e.ts',
  },
  retries: 3,
});
