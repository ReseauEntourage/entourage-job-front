// eslint-disable-next-line
require('dotenv').config();
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  video: false,
  projectId: process.env.CYPRESS_IO_PROJECT_ID,
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 120000,
  viewportWidth: 1920,
  viewportHeight: 1080,
  scrollBehavior: 'center',
  env: {
    adresseLocauxParis: `${process.env.ADRESSE_LOCAUX_PARIS}`,
  },
  e2e: {
    baseUrl: `${process.env.SERVER_URL}`,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  retries: 3,
});
