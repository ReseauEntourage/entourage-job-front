require('dotenv').config();
import { defineConfig } from 'cypress';

module.exports = defineConfig({
  video: false,
  projectId: process.env.CYPRESS_IO_PROJECT_ID,
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 120000,
  scrollBehavior: 'center',
  env: {
    adresseLocauxParis: `${process.env.ADRESSE_LOCAUX_PARIS}`,
  },
  e2e: {
    baseUrl: `${process.env.SERVER_URL}`,
    supportFile: false,
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
  },
  retries: 3,
});
